var StickType = { Analog: 1, Digital: 2 };

function RectToPolar(pos) {
	var retAng = atan2(pos.Y, pos.X);
	if (retAng < 0) { retAng += TAU * (int(abs(retAng) / TAU) + 1); }
	return { Dist: sqrt(pos.X * pos.X + pos.Y * pos.Y), Ang: retAng };
}
function controlStick(parent) {
	var ref = this;
	this.ParentElement = parent;
	this.objStartEvent = null;
	this.uvX = 0;
	this.uvY = 0;
	this.uvWidth = 1;
	this.uvHeight = 1;
	this.Value = new vec2(0, 0);
	this.Type = StickType.Analog;
	this.BaseColor = "#00000010";
    this.StickColor = "#00000020";
	function onPointerStart(e) {
        if (ref.objStartEvent) { return; }
		var area = ref.ClientArea();
		var posMouse = {X:mouseX - this.offsetLeft, Y:mouseY - this.offsetTop};
		if ((posMouse.X >= area.Min.X && posMouse.X <= area.Max.X) &&
			(posMouse.Y >= area.Min.Y && posMouse.Y <= area.Max.Y)) {
			ref.objStartEvent = e;
			var uvPos = { X: (posMouse.X - area.Min.X) / area.Size.Width, Y: (posMouse.Y - area.Min.Y) / area.Size.Height };
			var posStick = { X: 2 * uvPos.X - 1, Y: 2 * uvPos.Y - 1 };
			ref.Value = new vec2(posStick.X, posStick.Y);
			//e.preventDefault();
			//e.stopPropagation();
		}
	}
	function onPointerMove(e) {
		if(!(ref.objStartEvent)) {return;}
		if(ref.objStartEvent.pointerId !== e.pointerId) {return;}
		var area = ref.ClientArea();
		var posMouse = { X: mouseX - this.offsetLeft, Y: mouseY - this.offsetTop };
		var uvPos = { X: (posMouse.X - area.Min.X) / area.Size.Width, Y: (posMouse.Y - area.Min.Y) / area.Size.Height };
		uvPos.X = Math.max(Math.min(uvPos.X, 1), 0);
		uvPos.Y = Math.max(Math.min(uvPos.Y, 1), 0);
		var posStick = { X: 2 * uvPos.X - 1, Y: 2 * uvPos.Y - 1 };
		ref.Value = new vec2(posStick.X, posStick.Y);
		//e.preventDefault();
		//e.stopPropagation();
	}
	function onPointerRelease(e) {
		if(!(ref.objStartEvent)) {return;}
		if(ref.objStartEvent.pointerId !== e.pointerId) {return;}
		ref.Value = new vec2(0, 0);
		ref.objStartEvent = null;
	}	
	this.ParentElement.addEventListener("pointerdown", onPointerStart, false);	
	this.ParentElement.addEventListener("pointermove", onPointerMove, false);	
	this.ParentElement.addEventListener("pointerup", onPointerRelease, false);
	this.ParentElement.addEventListener("pointerleave", onPointerRelease, false);	
}
controlStick.prototype.ParentArea = function () {
    return {
        x: this.ParentElement.offsetLeft,
        y: this.ParentElement.offsetTop,
        w: this.ParentElement.offsetWidth,
        h: this.ParentElement.offsetHeight
    };
};
controlStick.prototype.X = function (setX) {
    if (typeof (setX) === 'undefined') {
        return this.uvX * this.ParentArea().w;
    }
    else {
        this.uvX = setX / this.ParentArea().w;
        return { uvX: this.uvX, X: setX };
    }
};
controlStick.prototype.Y = function (setY) {
    if (typeof (setY) === 'undefined') {
        return this.uvY * this.ParentArea().h;
    }
    else {
        this.uvY = setY / this.ParentArea().h;
        return { uvY: this.uvY, Y: setY };
    }
};
controlStick.prototype.Pos = function (setPos) {
    var areaP = { x: this.ParentArea().x, y: this.ParentArea().y, w: this.ParentArea().w, h: this.ParentArea().h };
    if (typeof (setPos) === 'undefined') {
        return { X: areaP.x + this.uvX * areaP.w, Y: areaP.y + this.uvY * areaP.h };
    }
    else {
        this.uvY = (setPos.X - areaP.x) / areaP.w;
        this.uvY = (setPos.Y - areaP.y) / areaP.h;
        return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: setPos };
    }
};
controlStick.prototype.uvPos = function (setUVPos) {
    if (typeof (setUVPos) === 'undefined') {
        return { uvX: this.uvX, uvY: this.uvY };
    }
    else {
        this.uvX = setUVPos.X;
        this.uvY = setUVPos.Y;
        return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: this.Pos() };
    }
};
controlStick.prototype.Width = function (setWidth) {
    if (typeof (setWidth) === 'undefined') {
        return this.uvWidth * this.ParentArea().w;
    }
    else {
        this.uvWidth = setWidth / this.ParentArea().w;
        return { uvWidth: this.uvWidth, Width: setWidth };
    }
};
controlStick.prototype.Height = function (setHeight) {
    if (typeof (setHeight) === 'undefined') {
        return this.uvHeight * this.ParentArea().h;
    }
    else {
        this.uvHeight = setHeight / this.ParentArea().h;
        return { uvHeight: this.uvHeight, Width: setHeight };
    }
};
controlStick.prototype.uvSize = function (setUVSize) {
    if (typeof (setUVSize) === 'undefined') {
        return { uvWidth: this.uvWidth, uvHeight: this.uvHeight };
    }
    else {
        this.uvWidth = setUVSize.Width;
        this.uvHeight = setUVSize.Height;
        return { uvSize: { X: this.uvWidth, Y: this.uvHeight }, Size: this.Size() };
    }
};
controlStick.prototype.Size = function (setSize) {
    if (typeof (setSize) === 'undefined') {
        return { Width: this.uvWidth * this.ParentArea().w, Height: this.uvHeight * this.ParentArea().h };
    }
    else {
        this.uvWidth = setSize.Width / this.ParentArea().w;
        this.uvHeight = setSize.Height / this.ParentArea().h;
        return { uvSize: { uvW: this.uvWidth, uvH: this.uvHeight }, Size: setSize };
    }
};
controlStick.prototype.ClientArea = function (setArea) {
    if (typeof (setArea) === 'undefined') {
        var min = this.Pos();
        var size = this.Size();
        var max = { X: min.X + size.Width, Y: min.Y + size.Height };
        return { Min: min, Max: max, Size: size };
    }
    else {
        this.Pos(setArea.Min);
        this.Size({ Width: setArea.Max.X - setArea.Min.X, Height: setArea.Max.Y - setArea.Min.Y });
        return { uvMin: this.uvPos(), uvSize: this.uvSize() };
    }
};
controlStick.prototype.uvArea = function (setArea) {
    if (typeof (setArea) === 'undefined') {
        var min = { X: this.uvX, Y: this.uvY };
        var size = { Width: this.uvWidth, Height: this.uvHeight };
        var max = { X: min.X + size.Width, Y: min.Y + size.Height };
        return { Min: min, Max: max, Size: size };
    }
    else {
        this.uvX = setArea.Min.X;
        this.uvY = setArea.Min.Y;
        this.uvWidth = setArea.Max.X - setArea.Min.X;
        this.uvHeight = setArea.Max.Y - setArea.Min.Y;
        return { uvMin: this.uvPos(), uvSize: this.uvSize() };
    }
};
controlStick.prototype.AreaContainsPoint = function (vec) {
    var area = this.ClientArea();
    var parea = this.ParentArea();
    var posMouse = { X: vec.X - parea.x, Y: vec.Y - parea.y };
    if ((posMouse.X >= area.Min.X && posMouse.X <= area.Max.X) &&
        (posMouse.Y >= area.Min.Y && posMouse.Y <= area.Max.Y)) {
        return true;
    } else {
        return false;
    }
};
controlStick.prototype.mapPointToUV = function (vec) {
    var area = this.ClientArea();
    var parea = this.ParentArea();
    var posMouse = { X: vec.X - parea.x, Y: vec.Y - parea.y };
    var uvPos = { X: (posMouse.X - area.Min.X) / area.Size.Width, Y: (posMouse.Y - area.Min.Y) / area.Size.Height };
    return uvPos;
};
controlStick.prototype.Render = function () {
    var area = this.ClientArea();
    var posStick = { X: 0.5 + 0.25 * this.Value.X, Y: 0.5 + 0.25 * this.Value.Y };
    noStroke();
    fill(this.BaseColor);
    ellipse(area.Min.X + (area.Size.Width * 0.5), area.Min.Y + (area.Size.Height * 0.5), area.Size.Width, area.Size.Height);
    fill(this.StickColor);
    ellipse(area.Min.X + (posStick.X * area.Size.Width), area.Min.Y + (posStick.Y * area.Size.Height), area.Size.Width * 0.5, area.Size.Height * 0.5);
};