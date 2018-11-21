BodyGadget = function (objBody) {
    this.__proto__ = BodyGadget.__proto__;
    this.body = objBody;
    this.refBody = objBody.instance;
    this.hudBody = document.createElement("div");
    this.hudBody.style.pointerEvents = "none";
    this.hudBody.style.border = "solid yellow";
    this.buttonDelete = document.createElement("button");
    this.buttonDelete.style.pointerEvents = "auto";
    this.buttonDelete.innerText = "X";
    this.buttonDelete.style.backgroundColor = "#00000000";
    this.buttonDelete.style.color = "yellow";
    this.buttonDelete.style.fontWeight = "bold";
    this.buttonDelete.style.width = "16px";
    this.buttonDelete.style.height = "16px";
    this.buttonDelete.style.padding = "0";
    this.buttonDelete.subject = this;
    this.hudBody.appendChild(this.buttonDelete);
    this.buttonDelete.onclick = function (event) {
        this.subject.body.Delete(true);
        delete this.subject.body;
        delete this.subject.refBody;
    };
    document.body.appendChild(this.hudBody);
    this.hudMain = document.createElement("div");
    this.hudMain.style.pointerEvents = "auto";
    this.hudMain.style.backgroundColor = "#20202080";
    this.hudMain.style.color = "white";
    this.hudMain.style.position = "absolute";
    this.hudMain.style.left = "0px";
    this.hudMain.style.top = "24px";
    this.hudMain.style.width = "auto";
    this.hudMain.style.height = "auto";
    this.hudMain.style.padding = "0";
    document.body.appendChild(this.hudMain);
    this.hudMain_buttonClose = document.createElement("button");
    this.hudMain_buttonClose.innerText = "Close";
    this.hudMain_buttonClose.subject = this;
    this.hudMain_buttonClose.onclick = function (event) { this.subject.Delete(); };
    this.hudMain.appendChild(this.hudMain_buttonClose);
    this.hudMain_tableMain = document.createElement("table");
    this.hudMain_tableMain.width = "100%";
    this.hudMain.appendChild(this.hudMain_tableMain);
    this.hudMain_AppendHeading = function (str, idHeading) {
        let ret = document.createElement("tr");
        ret.innerHTML = "<td colspan=\"2\"><span id=\"" + "hudHeading_" + idHeading + "\"><strong>"+str+"</strong></span></td>";
        this.hudMain_tableMain.appendChild(ret);
        let headingRet = document.getElementById("hudHeading_" + idHeading);
        return { elem: ret, field: headingRet };
    };
    this.hudMain_AppendField = function (str, typeField, idField, strAttr, objValue, FxnonChange) {
        let ret = document.createElement("tr");
        ret.innerHTML = "<td style=\"width:auto\">" + str + "</td><td><input id=\"" + "hudField_"+idField + "\" type=\"" + typeField + "\" style=\"width:100%; background-color:#ffffff20; color:white; \" "+strAttr+" /></td>";
        this.hudMain_tableMain.appendChild(ret);
        let fieldRet = document.getElementById("hudField_" + idField);
        if (typeField === "checkbox") { fieldRet.checked = objValue; } else { fieldRet.value = objValue; }
        fieldRet.onchange = FxnonChange;
        fieldRet.subject = this;
        return { elem:ret, field: fieldRet };
    };
    this.update = function () {
        if (this.refBody) {
            let rect = {
                min: PlayFieldToClient(this.refBody.bounds.min, { width: PlayScreen_Width, height: PlayScreen_Height }),
                max: PlayFieldToClient(this.refBody.bounds.max, { width: PlayScreen_Width, height: PlayScreen_Height })
            };
            rect.size = { width: rect.max.x - rect.min.x, height: rect.max.y - rect.min.y };
            this.hudBody.style.position = "absolute";
            this.hudBody.style.left = (rect.min.x) + "px";
            this.hudBody.style.top = (rect.min.y) + "px";
            this.hudBody.style.width = (rect.size.width) + "px";
            this.hudBody.style.height = (rect.size.height) + "px";
            this.buttonDelete.style.hidden = !this.refBody.isStatic;
            this.hudMain.style.width = (windowWidth * 0.5) + "px";
            return true;
        } else {
            if (this.hudBody) { document.body.removeChild(this.hudBody); }
            if (this.hudMain) { document.body.removeChild(this.hudMain); }
            return false;
        }
    };
    this.Delete = function () {
        document.body.removeChild(this.hudBody);
        document.body.removeChild(this.hudMain);
        delete this.hudBody;
        delete this.hudMain;
        delete this.body;
        delete this.refBody;
    };

    this.hudMain_AppendField("Label", "text", "label", "", this.refBody.label, function (event) {
        if (this.subject) {
            if (this.subject.refBody) {
                this.subject.refBody.label = this.value;
            }
        }
    });
    this.hudMain_AppendHeading("Physics");
    this.hudMain_AppendField("Static", "checkbox", "isstatic","", this.refBody.isStatic, function (event) {
        if (this.subject) {
            if (this.subject.refBody) {
                Matter.Body.setStatic(this.subject.refBody, this.checked);
									let fieldRet; 
									fieldRet = document.getElementById("hudField_mass");
                    if (fieldRet) { fieldRet.value = this.subject.refBody.mass; }
             fieldRet = document.getElementById("hudField_density");
                    if (fieldRet) { fieldRet.value = this.subject.refBody.density; }
            }
        }
    });
    this.hudMain_AppendField("Density", "number", "density","step=\"0.000000000000000001\"", this.refBody.density, function (event) {
        if (this.subject) {
            if (this.subject.refBody) {
                if (this.value) {
                    Matter.Body.setDensity(this.subject.refBody, this.value);
                    let fieldRet = document.getElementById("hudField_mass");
                    if (fieldRet) { fieldRet.value = this.subject.refBody.mass; }
                }
            }
        }
    });
    this.hudMain_AppendField("Mass", "number", "mass", "step=\"0.000000000000000001\"", this.refBody.mass, function (event) {
        if (this.subject) {
            if (this.subject.refBody) {
                if (this.value) {
                    Matter.Body.setMass(this.subject.refBody, this.value);
                    let fieldRet = document.getElementById("hudField_density");
                    if (fieldRet) { fieldRet.value = this.subject.refBody.density; }
                }
            }
        }
    });
    this.hudMain_AppendField("Contact Friction", "number", "frictionContact", "step=\"0.000000000000000001\"", this.refBody.friction, function (event) {
        if (this.subject) {
            if (this.subject.refBody) {
                if (this.value) {
                    this.subject.refBody.friction = this.value;
                }
            }
        }
    });
    this.hudMain_AppendField("Air Friction", "number", "frictionAir", "step=\"0.000000000000000001\"", this.refBody.frictionAir, function (event) {
        if (this.subject) {
            if (this.subject.refBody) {
                if (this.value) {
                    this.subject.refBody.frictionAir = this.value;
                }
            }
        }
    });
    this.hudMain_AppendField("Static Friction", "number", "frictionStatic", "step=\"0.000000000000000001\"", this.refBody.frictionStatic, function (event) {
        if (this.subject) {
            if (this.subject.refBody) {
                if (this.value) {
                    this.subject.refBody.frictionStatic = this.value;
                }
            }
        }
    });
    this.hudMain_AppendField("Restitution", "number", "restitution", "step=\"0.000000000000000001\"", this.refBody.restitution, function (event) {
        if (this.subject) {
            if (this.subject.refBody) {
                if (this.value) {
                    this.subject.refBody.restitution = this.value;
                }
            }
        }
    });
    this.hudMain_buttonDelete = document.createElement("button");
    this.hudMain_buttonDelete.innerText = "Delete Body";
    this.hudMain_buttonDelete.subject = this;
    this.hudMain_buttonDelete.onclick = this.buttonDelete.onclick;
    this.hudMain.appendChild(this.hudMain_buttonDelete);
    this.update();
};