function plotArea2D(parent)
{
	this.ParentElement = parent;
	this.uvX = 0;
	this.uvY = 0;
	this.uvWidth = 1;
	this.uvHeight = 1;
	this.PlotMinX = -1;
	this.PlotMinY = 1;
	this.PlotMaxX = 1;
	this.PlotMaxY = -1;
}

plotArea2D.prototype.X = function(setX) {
	if (typeof(setX) === 'undefined') {
		return this.uvX * this.ParentElement.width;
	}
	else {
		this.uvX = setX / this.ParentElement.width;
		return { uvX:this.uvX, X:setX };
	}
}
plotArea2D.prototype.Y = function(setY) {
	if (typeof (setY) === 'undefined') {
		return this.uvY * this.ParentElement.height;
	}
	else {
		this.uvY = setY / this.ParentElement.height;
		return { uvY: this.uvY, Y:setY };
	}
}
plotArea2D.prototype.Pos = function (setPos) {
	if (typeof (setPos) === 'undefined') {
		return { X: this.uvX*this.ParentElement.width, Y: this.uvY*this.ParentElement.height };
	}
	else {
		this.uvY = setPos.X / this.ParentElement.width;
		this.uvY = setPos.Y / this.ParentElement.height;
		return {uvPos:{X:this.uvX, Y:this.uvY}, Pos:setPos};
	}
}
plotArea2D.prototype.uvPos = function (setUVPos) {
	if (typeof (setUVPos) === 'undefined') {
		return { uvX:this.uvX, uvY:this.uvY };
	}
	else {
		this.uvX = setUVPos.X;
		this.uvY = setUVPos.Y;
		return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: this.Pos() };
	}
}

plotArea2D.prototype.Width = function(setWidth) {
	if (typeof (setWidth) === 'undefined') {
		return this.uvWidth * this.ParentElement.width;
	}
	else {
		this.uvWidth = setWidth / this.ParentElement.width;
		return { uvWidth: this.uvWidth, Width:setWidth };
	}
}
plotArea2D.prototype.Height = function(setHeight) {
	if (typeof (setHeight) === 'undefined') {
		return this.uvHeight * this.ParentElement.height;
	}
	else {
		this.uvHeight = setHeight / this.ParentElement.height;
		return { uvHeight: this.uvHeight, Width:setHeight };
	}
}
plotArea2D.prototype.uvSize = function (setUVSize) {
	if (typeof (setUVSize) === 'undefined') {
		return { uvWidth: this.uvWidth, uvHeight: this.uvHeight };
	}
	else {
		this.uvWidth = setUVSize.Width;
		this.uvHeight = setUVSize.Height;
		return { uvSize: { X: this.uvWidth, Y: this.uvHeight }, Size: this.Size() };
	}
}
plotArea2D.prototype.Size = function (setSize) {
	if (typeof (setSize) === 'undefined') {
		return { Width: this.uvWidth * this.ParentElement.width, Height: this.uvHeight * this.ParentElement.height };
	}
	else {
		this.uvWidth = setSize.Width / this.ParentElement.width;
		this.uvHeight = setSize.Height / this.ParentElement.height;
		return { uvSize:{uvW:this.uvWidth, uvH:this.uvHeight}, Size:setSize };
	}
}

plotArea2D.prototype.CenterWidthOnParent = function() {
	this.uvX = 0.5*(1-this.uvWidth);
	return {uvPos:this.uvPos(), uvSize:this.uvSize()};
}
plotArea2D.prototype.CenterHeightOnParent = function() {
	this.uvY = 0.5 * (1 - this.uvHeight);
	return { uvPos: this.uvPos(), uvSize: this.uvSize() };
}

plotArea2D.prototype.PlotArea = function(setArea) {
	if (typeof (setArea) === 'undefined') {
		return { Min: this.PlotMinPos(), Max: this.PlotMaxPos(), Size: this.PlotSize() };
	}
	else {
		this.PlotMinPos(setArea.Min);
		this.PlotMaxPos(setArea.Max);
		return this.PlotArea();
	}
}
plotArea2D.prototype.PlotPos = function (setPos) {
	if (typeof (setPos) === 'undefined') {
		return { X: this.PlotMinX, Y: this.PlotMinY };
	}
	else {
		var sz = this.PlotSize();
		this.PlotMinX = setPos.X;
		this.PlotMinY = setPos.Y;
		this.PlotMaxX = setPos.X + sz.X;
		this.PlotMaxY = setPos.Y + sz.Y;
		return this.PlotArea();
	}
}
plotArea2D.prototype.PlotPosCenter = function (setPos) {
	if (typeof (setPos) === 'undefined') {
		return { X: (this.PlotMaxX + this.PlotMinX)*0.5, Y: (this.PlotMaxY+this.PlotMinY)*0.5 };
	}
	else {
		var sz = this.PlotSize();
		this.PlotMinX = setPos.X - sz.Width*0.5;
		this.PlotMinY = setPos.Y - sz.Height*0.5;
		this.PlotMaxX = setPos.X + sz.Width*0.5;
		this.PlotMaxY = setPos.Y + sz.Height*0.5;
		return this.PlotArea();
	}
}
plotArea2D.prototype.PlotSizeOnCenter = function (setSize) {
	if (typeof (setSize) === 'undefined') {
		return { X: (this.PlotMaxX + this.PlotMinX) * 0.5, Y: (this.PlotMaxY + this.PlotMinY) * 0.5 };
	}
	else {
		var p = this.PlotPosCenter();
		this.PlotMinX = p.X - setSize.Width * 0.5;
		this.PlotMinY = p.Y - setSize.Height * 0.5;
		this.PlotMaxX = p.X + setSize.Width * 0.5;
		this.PlotMaxY = p.Y + setSize.Height * 0.5;
		return this.PlotArea();
	}
}
plotArea2D.prototype.PlotMinPos = function (setPos) {
	if (typeof (setPos) === 'undefined') {
		return { X: this.PlotMinX, Y: this.PlotMinY };
	}
	else {
		this.PlotMinX = setPos.X;
		this.PlotMinY = setPos.Y;
		return this.PlotArea();
	}
}
plotArea2D.prototype.PlotMaxPos = function (setPos) {
	if (typeof (setPos) === 'undefined') {
		return { X: this.PlotMaxX, Y: this.PlotMaxY };
	}
	else {
		this.PlotMaxX = setPos.X;
		this.PlotMaxY = setPos.Y;
		return this.PlotArea();
	}
}
plotArea2D.prototype.PlotWidth = function(setWidth) {
	if (typeof(setWidth) === 'undefined') {
		return this.PlotMaxX - this.PlotMinX;
	}
	else {
		this.PlotMaxX = this.PlotMinX + setWidth;
		return this.PlotArea();
	}
}
plotArea2D.prototype.PlotHeight = function (setHeight) {
	if (typeof (setHeight) === 'undefined') {
		return this.PlotMaxY - this.PlotMinY;
	}
	else {
		this.PlotMaxY = this.PlotMinY + setHeight;
		return this.PlotArea();
	}
}
plotArea2D.prototype.PlotSize = function (setSize) {
	if (typeof (setSize) === 'undefined') {
		return {Width:this.PlotWidth(), Height:this.PlotHeight()};
	}
	else {
		this.PlotMaxX = this.PlotMinX + setSize.Width;
		this.PlotMaxY = this.PlotMinY + setSize.Height;
		return this.PlotArea();
	}
}

plotArea2D.prototype.MapUVToPosUV = function (UV) {
	return { X: this.uvX + UV.X * this.uvWidth, Y: this.uvY + UV.Y * this.uvHeight };
}
plotArea2D.prototype.MapPosUVToUV = function (posUV) {
	return { X: (posUV.X - this.uvX) / this.uvWidth, Y: (posUV.Y - this.uvY) / this.uvHeight };
}
plotArea2D.prototype.MapPosUVToClient = function (posUV) {
	return { X: posUV.X * this.ParentElement.width, Y: posUV.Y * this.ParentElement.height };
}
plotArea2D.prototype.MapUVToClient = function (UV) {
	return { X:UV.X*this.ParentElement.width, Y: UV.Y*this.ParentElement.height};
}
plotArea2D.prototype.MapClientToUV = function(Pos) {
	return this.MapPosUVToUV(this.MapClientToPosUV(Pos));
}
plotArea2D.prototype.MapClientToPosUV = function (Pos) {
	return { X: (Pos.X / this.ParentElement.width), Y: (Pos.Y / this.ParentElement.height) };
}
plotArea2D.prototype.MapUVToPlot = function(UV) {
	return {X:this.PlotMinX + UV.X*this.PlotWidth(), Y:this.PlotMinY + UV.Y*this.PlotHeight()}
}
plotArea2D.prototype.MapPosUVToPlot = function (posUV) {
	return this.MapUVToPlot(this.MapPosUVToUV(posUV));
}
plotArea2D.prototype.MapPlotToUV = function(plotXY) {
	return {X:(plotXY.X-this.PlotMinX)/this.PlotWidth(), Y:(plotXY.Y-this.PlotMinY)/this.PlotHeight()};
}
plotArea2D.prototype.MapPlotToPosUV = function (plotXY) {
	return this.MapUVToPosUV(this.MapPlotToUV(plotXY));
}
plotArea2D.prototype.MapPlotToClient = function(plotXY) {
	return this.MapPosUVToClient(this.MapUVToPosUV(this.MapPlotToUV(plotXY)));
}
plotArea2D.prototype.PlotUnitToClientUnit = function () {
	return { X:(this.Width() / this.PlotWidth()), Y: (this.Height() / this.PlotHeight())};
}
plotArea2D.prototype.ClientUnitToPlotUnit = function () {
	return { X: (this.PlotWidth() / this.Width()), Y: (this.PlotHeight() / this.Height())};
}

plotArea2D.prototype.ContainsMousePointer = function() {
	var UV = this.MapClientToUV({X:mouseX, Y:mouseY});
	return (UV.X>=0 && UV.X<=1 && UV.Y>=0 && UV.Y<=1);
}

plotArea2D.prototype.Update = function() {

}
plotArea2D.prototype.DrawBorder = function (color, thickness) {
	stroke(color);
	strokeWeight(thickness);
	noFill();
	var posThis = this.Pos();
	var sizeThis = this.Size();
	rect(posThis.X, posThis.Y, sizeThis.Width, sizeThis.Height);
}
plotArea2D.prototype.DrawAxis_Rect = function(color,thickness,axisMarkLength,gridLength) {
	stroke(color);
	var areaPlot = this.PlotArea();
	var areaGrid = {X:areaPlot.Size.Width/gridLength, Y:areaPlot.Size.Height/gridLength};
	var posOrigin = this.MapPlotToClient({X:0, Y:0});
	var posThis = this.Pos();
	var sizeThis = this.Size();
	if (posOrigin.Y >= posThis.Y && posOrigin.Y <= posThis.Y + sizeThis.Height) {
		strokeWeight(thickness);
		line(posThis.X, posOrigin.Y, posThis.X + sizeThis.Width, posOrigin.Y);
		strokeWeight(1);
		for (var gridI = areaPlot.Min.X, gridCI = 0; gridCI <= gridLength; gridI += areaGrid.X, gridCI += 1) {
			var gridXi = this.MapPlotToClient({ X: gridI - (gridI % areaGrid.X)}).X;
			if (gridXi >= posThis.X && gridXi <= posThis.X + sizeThis.Width) {
				line(gridXi, max(posOrigin.Y - axisMarkLength,posThis.Y), gridXi, min(posOrigin.Y + axisMarkLength, posThis.Y + sizeThis.Height));
			}
		}
	}
	if (posOrigin.X >= posThis.X && posOrigin.X <= posThis.X + sizeThis.Width) {
		strokeWeight(thickness);
		line(posOrigin.X,posThis.Y,posOrigin.X,posThis.Y + sizeThis.Height);
		strokeWeight(1);
		for (var gridI = areaPlot.Min.Y, gridCI = 0; gridCI <= gridLength; gridI += areaGrid.Y, gridCI += 1) {
			var gridYi = this.MapPlotToClient({ Y: gridI - (gridI % areaGrid.Y) }).Y;
			if (gridYi >= posThis.Y && gridYi <= posThis.Y + sizeThis.Height) {
				line(max(posOrigin.X - axisMarkLength, posThis.X), gridYi, min(posOrigin.X + axisMarkLength, posThis.X + sizeThis.Width), gridYi);
			}
		}
	}
}
plotArea2D.prototype.DrawAxis_Polar = function (color, thickness) {

}
plotArea2D.prototype.DrawCurve = function() {

}