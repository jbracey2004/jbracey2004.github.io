var StickType = { Analog: 1, Digital: 2 };
function controlStick(parent) {
	this.ParentElement = parent;
	this.uvX = 0;
	this.uvY = 0;
	this.uvWidth = 1;
	this.uvHeight = 1;
	this.Value = new vec2(0, 0);
	this.Type = StickType.Analog;
	this.Element = document.createElement("canvas");
	document.body.appendChild(this.Element);
	var objStyle = this.Element.style;
	objStyle["position"] = "absolute";
	objStyle["display"] = "float";
	this.DrawContext = this.Element.getContext("2d");
	this.Element.width = 256;
	this.Element.height = 256;
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
	if (typeof (setPos) === 'undefined') {
		return { X: this.uvX * this.ParentElement.width, Y: this.uvY * this.ParentElement.height };
	}
	else {
		this.uvY = setPos.X / this.ParentElement.width;
		this.uvY = setPos.Y / this.ParentElement.height;
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
controlStick.prototype.Update = function () {
	var area = this.ClientArea();
	this.Element.style.left = area.Min.X.toString()+"px";
	this.Element.style.top = area.Min.Y.toString()+"px";
	this.Element.style.width = area.Size.Width.toString()+"px";
	this.Element.style.height = area.Size.Height.toString()+"px";
	this.Element.left = this.Element.style.left;
	this.Element.top = this.Element.style.top;
	this.DrawContext.fillStyle = "#00008040";
	this.DrawContext.fillRect(0, 0, this.Element.width, this.Element.height);
}