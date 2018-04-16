var StickType = { Analog: 1, Digital: 2 };

function RectToPolar(pos) {
	var retAng = atan2(pos.Y, pos.X);
	if (retAng < 0) { retAng += TAU * (int(abs(retAng) / TAU) + 1); };
	return { Dist: sqrt(pos.X * pos.X + pos.Y * pos.Y), Ang: retAng };
}
function controlStick(parent) {
	var ref = this;	
	this.ParentElement = parent;
	this.uvX = 0;
	this.uvY = 0;
	this.uvWidth = 1;
	this.uvHeight = 1;
	this.Value = new vec2(0, 0);
	this.Type = StickType.Analog;
	this.BackgroundColor = "#00000000";
	this.BaseColor = "#404040FF";
	this.StickColor = "#FFFFFF80"
	this.Element = document.createElement("canvas");
	document.body.appendChild(this.Element);
	var objStyle = this.Element.style;
	objStyle["position"] = "absolute";
	objStyle["pointer-events"] = "all";
	this.DrawContext = this.Element.getContext("2d");
	this.Element.width = 256;
	this.Element.height = 256;
	function onPointerStart(e) {
		ref.Element.style["pointer-events"] = "none"
		var uvPos = { X: e.layerX / ref.Width(), Y: e.layerY / ref.Height() };
		var posStick = { X: 2 * uvPos.X - 1, Y: 2 * uvPos.Y - 1 };
		ref.Value = new vec2(posStick.X, posStick.Y);
		ref.ParentElement.addEventListener("pointermove", onPointerMove, false);
		ref.ParentElement.addEventListener("pointerup", onPointerRelease, true);
		ref.ParentElement.addEventListener("pointerleave", onPointerRelease, true);
		ref.Update();
		e.preventDefault();
	}
	function onPointerMove(e) {
		var area = ref.ClientArea();
		var uvPos = { X: (e.layerX - area.Min.X) / area.Size.Width, Y: (e.layerY - area.Min.Y) / area.Size.Height };
		uvPos.X = Math.max(Math.min(uvPos.X, 1), 0);
		uvPos.Y = Math.max(Math.min(uvPos.Y, 1), 0);
		var posStick = { X: 2 * uvPos.X - 1, Y: 2 * uvPos.Y - 1 };
		ref.Value = new vec2(posStick.X, posStick.Y);
		ref.Update();
		e.preventDefault();
	}
	function onPointerRelease(e) {
		ref.Value = new vec2(0, 0);
		ref.ParentElement.removeEventListener("pointermove", onPointerMove);
		ref.ParentElement.removeEventListener("pointerup", onPointerRelease);
		ref.ParentElement.removeEventListener("pointerleave", onPointerRelease);
		ref.Element.style["pointer-events"] = "all"
		ref.Update();
		e.preventDefault();
	}
	function onParentResize(e) {
		ref.Update();
	}
	this.Element.addEventListener("pointerdown", onPointerStart);
	window.addEventListener("resize", onParentResize);
	this.Update();
}
controlStick.prototype.X = function (setX) {
	if (typeof (setX) === 'undefined') {
		return this.uvX * this.ParentElement.width;
	}
	else {
		this.uvX = setX / this.ParentElement.width;
		return { uvX: this.uvX, X: setX };
	}
}
controlStick.prototype.Y = function (setY) {
	if (typeof (setY) === 'undefined') {
		return this.uvY * this.ParentElement.height;
	}
	else {
		this.uvY = setY / this.ParentElement.height;
		return { uvY: this.uvY, Y: setY };
	}
}
controlStick.prototype.Pos = function (setPos) {
	var areaP = { x: this.ParentElement.offsetLeft, y: this.ParentElement.offsetTop, w: this.ParentElement.width, h: this.ParentElement.height };
	if (typeof (setPos) === 'undefined') {
		return { X: areaP.x + this.uvX * areaP.w, Y: areaP.y + this.uvY * areaP.h };
	}
	else {
		this.uvY = (setPos.X - areaP.x) / areaP.w;
		this.uvY = (setPos.Y - areaP.y) / areaP.h;
		return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: setPos };
	}
}
controlStick.prototype.uvPos = function (setUVPos) {
	if (typeof (setUVPos) === 'undefined') {
		return { uvX: this.uvX, uvY: this.uvY };
	}
	else {
		this.uvX = setUVPos.X;
		this.uvY = setUVPos.Y;
		return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: this.Pos() };
	}
}
controlStick.prototype.Width = function (setWidth) {
	if (typeof (setWidth) === 'undefined') {
		return this.uvWidth * this.ParentElement.width;
	}
	else {
		this.uvWidth = setWidth / this.ParentElement.width;
		return { uvWidth: this.uvWidth, Width: setWidth };
	}
}
controlStick.prototype.Height = function (setHeight) {
	if (typeof (setHeight) === 'undefined') {
		return this.uvHeight * this.ParentElement.height;
	}
	else {
		this.uvHeight = setHeight / this.ParentElement.height;
		return { uvHeight: this.uvHeight, Width: setHeight };
	}
}
controlStick.prototype.uvSize = function (setUVSize) {
	if (typeof (setUVSize) === 'undefined') {
		return { uvWidth: this.uvWidth, uvHeight: this.uvHeight };
	}
	else {
		this.uvWidth = setUVSize.Width;
		this.uvHeight = setUVSize.Height;
		return { uvSize: { X: this.uvWidth, Y: this.uvHeight }, Size: this.Size() };
	}
}
controlStick.prototype.Size = function (setSize) {
	if (typeof (setSize) === 'undefined') {
		return { Width: this.uvWidth * this.ParentElement.width, Height: this.uvHeight * this.ParentElement.height };
	}
	else {
		this.uvWidth = setSize.Width / this.ParentElement.width;
		this.uvHeight = setSize.Height / this.ParentElement.height;
		return { uvSize: { uvW: this.uvWidth, uvH: this.uvHeight }, Size: setSize };
	}
}
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
}
controlStick.prototype.uvArea = function (setArea) {
	if (typeof (setArea) === 'undefined') {
		var min = {X: this.uvX, Y: this.uvY};
		var size = {Width: this.uvWidth, Height: this.uvHeight};
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
}
controlStick.prototype.Update = function () {
	var area = this.ClientArea();
	var posStick = {X:0.5 + 0.25*this.Value.X , Y:0.5 + 0.25*this.Value.Y};
	this.Element.style.left = area.Min.X.toString()+"px";
	this.Element.style.top = area.Min.Y.toString()+"px";
	this.Element.style.width = area.Size.Width.toString()+"px";
	this.Element.style.height = area.Size.Height.toString()+"px";
	this.DrawContext.clearRect(0, 0, this.Element.width, this.Element.height);
	this.DrawContext.fillStyle = this.BackgroundColor;
	this.DrawContext.fillRect(0, 0, this.Element.width, this.Element.height);
	this.DrawContext.fillStyle = this.BaseColor;
	this.DrawContext.beginPath();
	this.DrawContext.arc(this.Element.width * 0.5, this.Element.height * 0.5, this.Element.width * 0.5, 0 , 2 * Math.PI);
	this.DrawContext.stroke();
	this.DrawContext.fill();
	this.DrawContext.fillStyle = this.StickColor;
	this.DrawContext.beginPath();
	this.DrawContext.arc(posStick.X * this.Element.width , posStick.Y * this.Element.height, this.Element.width * 0.25, 0, 2 * Math.PI);
	this.DrawContext.stroke();
	this.DrawContext.fill();
}