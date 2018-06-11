function canvas2D3D(id, context3DType, parent) {
	this.ParentElement = parent;
	this.uvX = 0;
	this.uvY = 0;
	this.uvWidth = 1;
	this.uvHeight = 1;
	this.canvas3D = document.createElement("canvas");
	this.context3D = this.canvas3D.getContext(context3DType);
	this.parentElement.appendChild(this.canvas3D);
	this.canvas2D = document.createElement("canvas");
	this.context2D = this.canvas2D.getContext("2d");
	this.parentElement.appendChild(this.canvas2D);
	this.Update();
}

canvas2D3D.prototype.X = function (setX) {
	if (typeof (setX) === 'undefined') {
		return this.uvX * this.ParentElement.width;
	}
	else {
		this.uvX = setX / this.ParentElement.width;
		return { uvX: this.uvX, X: setX };
	}
}
canvas2D3D.prototype.Y = function (setY) {
	if (typeof (setY) === 'undefined') {
		return this.uvY * this.ParentElement.height;
	}
	else {
		this.uvY = setY / this.ParentElement.height;
		return { uvY: this.uvY, Y: setY };
	}
}
canvas2D3D.prototype.Pos = function (setPos) {
	if (typeof (setPos) === 'undefined') {
		return { X: this.uvX * this.ParentElement.width, Y: this.uvY * this.ParentElement.height };
	}
	else {
		this.uvY = setPos.X / this.ParentElement.width;
		this.uvY = setPos.Y / this.ParentElement.height;
		return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: setPos };
	}
}
canvas2D3D.prototype.uvPos = function (setUVPos) {
	if (typeof (setUVPos) === 'undefined') {
		return { uvX: this.uvX, uvY: this.uvY };
	}
	else {
		this.uvX = setUVPos.X;
		this.uvY = setUVPos.Y;
		return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: this.Pos() };
	}
}

canvas2D3D.prototype.Width = function (setWidth) {
	if (typeof (setWidth) === 'undefined') {
		return this.uvWidth * this.ParentElement.width;
	}
	else {
		this.uvWidth = setWidth / this.ParentElement.width;
		return { uvWidth: this.uvWidth, Width: setWidth };
	}
}
canvas2D3D.prototype.Height = function (setHeight) {
	if (typeof (setHeight) === 'undefined') {
		return this.uvHeight * this.ParentElement.height;
	}
	else {
		this.uvHeight = setHeight / this.ParentElement.height;
		return { uvHeight: this.uvHeight, Width: setHeight };
	}
}
canvas2D3D.prototype.uvSize = function (setUVSize) {
	if (typeof (setUVSize) === 'undefined') {
		return { uvWidth: this.uvWidth, uvHeight: this.uvHeight };
	}
	else {
		this.uvWidth = setUVSize.Width;
		this.uvHeight = setUVSize.Height;
		return { uvSize: { X: this.uvWidth, Y: this.uvHeight }, Size: this.Size() };
	}
}
canvas2D3D.prototype.Size = function (setSize) {
	if (typeof (setSize) === 'undefined') {
		return { Width: this.uvWidth * this.ParentElement.width, Height: this.uvHeight * this.ParentElement.height };
	}
	else {
		this.uvWidth = setSize.Width / this.ParentElement.width;
		this.uvHeight = setSize.Height / this.ParentElement.height;
		return { uvSize: { uvW: this.uvWidth, uvH: this.uvHeight }, Size: setSize };
	}
}
canvas2D3D.prototype.ClientArea = function (setArea) {
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

canvas2D3D.prototype.Update = function() {
	var area = this.ClientArea();
	this.canvas3D.offsetLeft = area.Min.X;
	this.canvas3D.offsetTop = area.Min.Y;
	this.canvas3D.offsetWidth = area.Size.Width;
	this.canvas3D.offsetHeight = area.Size.Height;
	this.canvas2D.offsetLeft = area.Min.X;
	this.canvas2D.offsetTop = area.Min.Y;
	this.canvas2D.offsetWidth = area.Size.Width;
	this.canvas2D.offsetHeight = area.Size.Height;
}