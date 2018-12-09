var Physics2D = {};
Physics2D.Composite_lstInstances = [];
Physics2D.Body_lstInstances = [];
Physics2D.Composite_fromInstance = function (objInstance) { return Physics2D.Composite_lstInstances.filter(itm => (itm.instance === objInstance)); };
Physics2D.Body_fromInstance = function (objInstance) { return Physics2D.Body_lstInstances.filter(itm => (itm.instance === objInstance)); };
Physics2D.Engine = function (objInstance) {
    this.__proto__ = Physics2D.Engine.__proto__;
    if (objInstance) {
        this.instance = objInstance;
    } else {
        this.instance = Matter.Engine.create();
    }
    this.World = new Physics2D.Composite(this.instance.world);
    this.AutoRun_Start = function () {
        this.runner = Matter.Runner.create();
        Matter.Runner.start(this.runner, this.instance);
        return this.runner;
    };
    this.AutoRun_Pause = function (bolPause) {
        this.runner.enabled = !bolPause;
    };
    this.AutoRun_Stop = function () {
        Matter.Runner.stop(this.runner);
        delete this.runner;
        return null;
    };
    this.AutoRender_Start = function (objOptions) {
        if (objOptions) {
            objOptions.engine = this.instance;
            this.render = Matter.Render.create(objOptions);
        } else if(this.refRender) {
            this.render = this.refRender;
            delete this.refRender;
        } else {
            this.render = Matter.Render.create({ engine: this.instance });
        }
        Matter.Render.run(this.render);
        return this.render;
    };
    this.AutoRender_Stop = function () {
        this.refRender = this.render;
        Matter.Render.stop(this.render);
        return null;
    };
    this.StepSimulation = function (dt=15, correction=1) {
        Matter.Engine.update(this.instance, dt, correction);
    };
    this.getPlayArea = function() {
        let ret = {};
        if (this.render) {
            ret = {width:this.render.canvas.width, height:this.render.canvas.height};
        }
        return ret;
    };
    this.setPlayArea = function (value) {
        if (this.render) {
            this.render.canvas.width = value.width;
            this.render.canvas.height = value.height;
            return value;
        }
        return;
    };
    this.RenderDebug = function (context, viewport, bolBypassEngine) {
		if (!this.render || bolBypassEngine) {
            if (!viewport) {
                viewport = { x: 0, y: 0, width: context.canvas.width, height: context.canvas.height };
            }
            let bodies = Matter.Composite.allBodies(this.instance.world);
            context.save();
            context.scale(context.canvas.width / viewport.width, context.canvas.height/viewport.height);
            context.translate(-viewport.x, -viewport.y);
			for (let bodyI of bodies) {
				if (bodyI.render.visible) {
					var vertices = bodyI.vertices;
					context.beginPath();
					context.moveTo(vertices[0].x, vertices[0].y);
					for (let j = 1; j < vertices.length; j += 1) {
						context.lineTo(vertices[j].x, vertices[j].y);
					}
					context.lineTo(vertices[0].x, vertices[0].y);
					if (bodyI.render.linewidth && bodyI.render.strokeStyle) {
						context.lineWidth = bodyI.render.linewidth;
						context.strokeStyle = bodyI.render.strokeStyle;
						context.stroke();
					}
					if (bodyI.render.fillStyle) {
						context.fillStyle = bodyI.render.fillStyle;
						context.fill();
					}
				}
            }
            context.restore();
        } else {
            if (!viewport) {
                viewport = {x: 0, y: 0, width: this.render.canvas.width, height: this.render.canvas.height };
            }
            context.drawImage(this.render.canvas,viewport.x,viewport.y,viewport.width,viewport.height, 0, 0, context.canvas.width, context.canvas.height);
        }
    };
};
Physics2D.Composite = function (objInstance, objOptions) {
    this.__proto__ = Physics2D.Composite.__proto__;
    if (!objOptions) objOptions = {};
    if (objInstance) { this.instance = objInstance; } else { this.instance = Matter.Composite.create(objOptions); }
    this.SetWrapBounds = function (bounds) {
        this.WrapBounds = bounds;
        for (let obj of Matter.Composite.allBodies(this.instance)) {
            if (this.WrapBounds) {
                obj.plugin.wrap = this.WrapBounds;
            } else {
                obj.plugin.wrap = null;
                delete obj.plugin.wrap;
            }
        }
    };
    this.AddObject = function (obj) {
        obj.AddTo(this);
        if (this.WrapBounds) { obj.instance.plugin.wrap = this.WrapBounds; }
    };
    this.CreateBody = function (objOptions) {
        if (!objOptions) objOptions = {};
        let objRet = new Physics2D.Body(Matter.Body.create(objOptions));
        this.AddObject(objRet);
        return objRet;
    };
    this.CreateBody_Rectangle = function (x, y, w, h, objOptions) {
        if (!objOptions) objOptions = {};
        let objRet = new Physics2D.Body(Matter.Bodies.rectangle(x + w * 0.5, y + h * 0.5, w, h, objOptions));
        this.AddObject(objRet);
        return objRet;
    };
    this.CreateBody_Polygon = function (x, y, sides, r, objOptions) {
        if (!objOptions) objOptions = {};
        let objRet = new Physics2D.Body(Matter.Bodies.polygon(x, y, sides, r, objOptions));
        this.AddObject(objRet);
        return objRet;
    };
    this.CreateBody_Circle = function (x, y, r, objOptions) {
        if (!objOptions) objOptions = {};
        let objRet = new Physics2D.Body(Matter.Bodies.circle(x, y, r, objOptions));
        this.AddObject(objRet);
        return objRet;
    };
    this.CreateBody_Ellipse = function (x, y, rx, ry, segs, objOptions) {
        if (!objOptions) objOptions = {};
        let vrt = []; for (let i = 0; i < segs; i++) { let a = (i / segs) * 2 * PI; vrt.push({ x: rx * cos(a), y: ry * sin(a) }); }
        let objRet = new Physics2D.Body(Matter.Bodies.fromVerticies(x, y, vrt, objOptions));
        this.AddObject(objRet);
        return objRet;
    };
    this.CreateBody_Verticies = function (x, y, vrts, objOptions) {
        if (!objOptions) objOptions = {};
        let objRet = new Physics2D.Body(Matter.Bodies.fromVerticies(x, y, vrts, objOptions));
        this.AddObject(objRet);
        return objRet;
    };
    this.Delete = function () {
        Physics2D.Composite_lstInstances = Physics2D.Composite_lstInstances.filter(itm => (itm.instance !== this));
    };
    Physics2D.Composite_lstInstances.push(this);
};
Physics2D.Body = function (objInstance, objOptions) {
    this.__proto__ = Physics2D.Body.__proto__;
    if (!objOptions) objOptions = {};
    if (objInstance) { this.instance = objInstance; } else { this.instance = Matter.Body.create(objOptions); }
    this.AddParts = function (aryBodies) {
        let aryTmp = this.instance.parts;
        for (let objBody of aryBodies) {
            if (objBody) {
                if (typeof (objBody) === Physics2D.Body) {
                    aryTmp.push(objBody.instance);
                } else if (objBody.type === "body") {
                    aryTmp.push(objBody);
                }
            }
        }
        return Matter.Body.setParts(this.instance, aryTmp);
    };
    this.RemoveParts = function (aryBodies) {
        let aryTmp = this.instance.parts.filter(x => !aryBodies.includes(x));
        return Matter.Body.setParts(this.instance, aryTmp);
    };
    this.AddTo = function (objComposite) {
        Matter.Composite.add(objComposite.instance, this.instance);
        this.Composite = objComposite;
    };
    this.Delete = function (bolDeep) {
        if (this.Composite) {
            if (bolDeep) { bolDeep = true; } else { bolDeep = false; }
            Matter.Composite.remove(this.Composite.instance, this.instance, bolDeep);
            delete this.instance;
        }
        Physics2D.Body_lstInstances = Physics2D.Body_lstInstances.filter(itm => (itm.instance !== this));
    };
    Physics2D.Body_lstInstances.push(this);
};
