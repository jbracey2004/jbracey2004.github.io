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
	this.isClipping = false;
}

function logab(a, x) { return (log(x))/(log(a));}
function sign(x) { if(x > 0) {return 1;} else if (x < 0) { return -1;} else {return 0;} }
function RectToPolar(pos) { let retAng = atan2(pos.Y, pos.X); 
							if (retAng < 0) { retAng += TAU * (int(abs(retAng) / TAU) + 1); }
							return {Dist: sqrt(pos.X*pos.X + pos.Y*pos.Y), Ang: retAng}; }

plotArea2D.prototype.X = function (setX) {
    if (typeof (setX) === 'undefined') {
        return this.uvX * this.ParentElement.width;
    }
    else {
        this.uvX = setX / this.ParentElement.width;
        return { uvX: this.uvX, X: setX };
    }
};
plotArea2D.prototype.Y = function (setY) {
    if (typeof (setY) === 'undefined') {
        return this.uvY * this.ParentElement.height;
    }
    else {
        this.uvY = setY / this.ParentElement.height;
        return { uvY: this.uvY, Y: setY };
    }
};
plotArea2D.prototype.Pos = function (setPos) {
    if (typeof (setPos) === 'undefined') {
        return { X: this.uvX * this.ParentElement.width, Y: this.uvY * this.ParentElement.height };
    }
    else {
        this.uvY = setPos.X / this.ParentElement.width;
        this.uvY = setPos.Y / this.ParentElement.height;
        return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: setPos };
    }
};
plotArea2D.prototype.uvPos = function (setUVPos) {
    if (typeof (setUVPos) === 'undefined') {
        return { uvX: this.uvX, uvY: this.uvY };
    }
    else {
        this.uvX = setUVPos.X;
        this.uvY = setUVPos.Y;
        return { uvPos: { X: this.uvX, Y: this.uvY }, Pos: this.Pos() };
    }
};

plotArea2D.prototype.Width = function (setWidth) {
    if (typeof (setWidth) === 'undefined') {
        return this.uvWidth * this.ParentElement.width;
    }
    else {
        this.uvWidth = setWidth / this.ParentElement.width;
        return { uvWidth: this.uvWidth, Width: setWidth };
    }
};
plotArea2D.prototype.Height = function (setHeight) {
    if (typeof (setHeight) === 'undefined') {
        return this.uvHeight * this.ParentElement.height;
    }
    else {
        this.uvHeight = setHeight / this.ParentElement.height;
        return { uvHeight: this.uvHeight, Width: setHeight };
    }
};
plotArea2D.prototype.uvSize = function (setUVSize) {
    if (typeof (setUVSize) === 'undefined') {
        return { uvWidth: this.uvWidth, uvHeight: this.uvHeight };
    }
    else {
        this.uvWidth = setUVSize.Width;
        this.uvHeight = setUVSize.Height;
        return { uvSize: { X: this.uvWidth, Y: this.uvHeight }, Size: this.Size() };
    }
};
plotArea2D.prototype.Size = function (setSize) {
    if (typeof (setSize) === 'undefined') {
        return { Width: this.uvWidth * this.ParentElement.width, Height: this.uvHeight * this.ParentElement.height };
    }
    else {
        this.uvWidth = setSize.Width / this.ParentElement.width;
        this.uvHeight = setSize.Height / this.ParentElement.height;
        return { uvSize: { uvW: this.uvWidth, uvH: this.uvHeight }, Size: setSize };
    }
};
plotArea2D.prototype.ClientArea = function (setArea) {
    if (typeof (setArea) === 'undefined') {
        let min = this.Pos();
        let size = this.Size();
        let max = { X: min.X + size.Width, Y: min.Y + size.Height };
        return { Min: min, Max: max, Size: size };
    }
    else {
        this.Pos(setArea.Min);
        this.Size({ Width: setArea.Max.X - setArea.Min.X, Height: setArea.Max.Y - setArea.Min.Y });
        return { uvMin: this.uvPos(), uvSize: this.uvSize() };
    }
};

plotArea2D.prototype.CenterWidthOnParent = function () {
    this.uvX = 0.5 * (1 - this.uvWidth);
    return { uvPos: this.uvPos(), uvSize: this.uvSize() };
};
plotArea2D.prototype.CenterHeightOnParent = function () {
    this.uvY = 0.5 * (1 - this.uvHeight);
    return { uvPos: this.uvPos(), uvSize: this.uvSize() };
};

plotArea2D.prototype.PlotArea = function (setArea) {
    if (typeof (setArea) === 'undefined') {
        return { Min: this.PlotMinPos(), Max: this.PlotMaxPos(), Size: this.PlotSize() };
    }
    else {
        this.PlotMinPos(setArea.Min);
        this.PlotMaxPos(setArea.Max);
        return this.PlotArea();
    }
};
plotArea2D.prototype.PlotAreaPolar = function () {
	let areaPlot = this.PlotArea();
	return {
		TopLeft: RectToPolar(areaPlot.Min),
		TopRight: RectToPolar({ X: areaPlot.Max.X, Y: areaPlot.Min.Y }),
		BottomLeft: RectToPolar({ X: areaPlot.Min.X, Y: areaPlot.Max.Y }),
		BottomRight: RectToPolar(areaPlot.Max)
	};
};
plotArea2D.prototype.PlotPos = function (setPos) {
    if (typeof (setPos) === 'undefined') {
        return { X: this.PlotMinX, Y: this.PlotMinY };
    }
    else {
        let sz = this.PlotSize();
        this.PlotMinX = setPos.X;
        this.PlotMinY = setPos.Y;
        this.PlotMaxX = setPos.X + sz.X;
        this.PlotMaxY = setPos.Y + sz.Y;
        return this.PlotArea();
    }
};
plotArea2D.prototype.PlotPosCenter = function (setPos) {
    if (typeof (setPos) === 'undefined') {
        return { X: (this.PlotMaxX + this.PlotMinX) * 0.5, Y: (this.PlotMaxY + this.PlotMinY) * 0.5 };
    }
    else {
        let sz = this.PlotSize();
        this.PlotMinX = setPos.X - sz.Width * 0.5;
        this.PlotMinY = setPos.Y - sz.Height * 0.5;
        this.PlotMaxX = setPos.X + sz.Width * 0.5;
        this.PlotMaxY = setPos.Y + sz.Height * 0.5;
        return this.PlotArea();
    }
};
plotArea2D.prototype.PlotSizeOnCenter = function (setSize) {
    if (typeof (setSize) === 'undefined') {
        return { Width: (this.PlotMaxX - this.PlotMinX), Height: (this.PlotMaxY - this.PlotMinY) };
    }
    else {
        return this.PlotSizeOnPos(setSize, this.PlotPosCenter());
    }
};
plotArea2D.prototype.PlotSizeOnPos = function (setSize, pos) {
    if (typeof (pos) === 'undefined') { pos = this.PlotPosCenter(); }
    if (typeof (setSize) === 'undefined') {
        return { Width: (this.PlotMaxX - this.PlotMinX), Height: (this.PlotMaxY - this.PlotMinY) };
    }
    else {
        let cp = this.PlotPosCenter();
        let sz = this.PlotSize();
        let psz = { X: setSize.Width / sz.Width, Y: setSize.Height / sz.Height };
        let p = { X: cp.X * psz.X + pos.X * (1 - psz.X), Y: cp.Y * psz.Y + pos.Y * (1 - psz.Y) };
        this.PlotMinX = p.X - setSize.Width * 0.5;
        this.PlotMinY = p.Y - setSize.Height * 0.5;
        this.PlotMaxX = p.X + setSize.Width * 0.5;
        this.PlotMaxY = p.Y + setSize.Height * 0.5;
        return this.PlotArea();
    }
};
plotArea2D.prototype.PlotMinPos = function (setPos) {
    if (typeof (setPos) === 'undefined') {
        return { X: this.PlotMinX, Y: this.PlotMinY };
    }
    else {
        this.PlotMinX = setPos.X;
        this.PlotMinY = setPos.Y;
        return this.PlotArea();
    }
};
plotArea2D.prototype.PlotMaxPos = function (setPos) {
    if (typeof (setPos) === 'undefined') {
        return { X: this.PlotMaxX, Y: this.PlotMaxY };
    }
    else {
        this.PlotMaxX = setPos.X;
        this.PlotMaxY = setPos.Y;
        return this.PlotArea();
    }
};
plotArea2D.prototype.PlotWidth = function (setWidth) {
    if (typeof (setWidth) === 'undefined') {
        return this.PlotMaxX - this.PlotMinX;
    }
    else {
        this.PlotMaxX = this.PlotMinX + setWidth;
        return this.PlotArea();
    }
};
plotArea2D.prototype.PlotHeight = function (setHeight) {
    if (typeof (setHeight) === 'undefined') {
        return this.PlotMaxY - this.PlotMinY;
    }
    else {
        this.PlotMaxY = this.PlotMinY + setHeight;
        return this.PlotArea();
    }
};
plotArea2D.prototype.PlotSize = function (setSize) {
    if (typeof (setSize) === 'undefined') {
        return { Width: this.PlotWidth(), Height: this.PlotHeight() };
    }
    else {
        this.PlotMaxX = this.PlotMinX + setSize.Width;
        this.PlotMaxY = this.PlotMinY + setSize.Height;
        return this.PlotArea();
    }
};

plotArea2D.prototype.MapUVToPosUV = function (UV) {
    return { X: this.uvX + UV.X * this.uvWidth, Y: this.uvY + UV.Y * this.uvHeight };
};
plotArea2D.prototype.MapPosUVToUV = function (posUV) {
    return { X: (posUV.X - this.uvX) / this.uvWidth, Y: (posUV.Y - this.uvY) / this.uvHeight };
};
plotArea2D.prototype.MapPosUVToClient = function (posUV) {
    return { X: posUV.X * this.ParentElement.width, Y: posUV.Y * this.ParentElement.height };
};
plotArea2D.prototype.MapUVToClient = function (UV) {
    return { X: UV.X * this.ParentElement.width, Y: UV.Y * this.ParentElement.height };
};
plotArea2D.prototype.MapClientToUV = function (Pos) {
    return this.MapPosUVToUV(this.MapClientToPosUV(Pos));
};
plotArea2D.prototype.MapClientToPlot = function (Pos) {
    return this.MapUVToPlot(this.MapClientToUV(Pos));
};
plotArea2D.prototype.MapClientToPosUV = function (Pos) {
    return { X: (Pos.X / this.ParentElement.width), Y: (Pos.Y / this.ParentElement.height) };
};
plotArea2D.prototype.MapUVToPlot = function (UV) {
    return { X: this.PlotMinX + UV.X * this.PlotWidth(), Y: this.PlotMinY + UV.Y * this.PlotHeight() };
};
plotArea2D.prototype.MapPosUVToPlot = function (posUV) {
    return this.MapUVToPlot(this.MapPosUVToUV(posUV));
};
plotArea2D.prototype.MapPlotToUV = function (plotXY) {
    return { X: (plotXY.X - this.PlotMinX) / this.PlotWidth(), Y: (plotXY.Y - this.PlotMinY) / this.PlotHeight() };
};
plotArea2D.prototype.MapPlotToPosUV = function (plotXY) {
    return this.MapUVToPosUV(this.MapPlotToUV(plotXY));
};
plotArea2D.prototype.MapPlotToClient = function (plotXY) {
    return this.MapPosUVToClient(this.MapUVToPosUV(this.MapPlotToUV(plotXY)));
};
plotArea2D.prototype.PlotUnitToClientUnit = function () {
    return { X: (this.Width() / this.PlotWidth()), Y: (this.Height() / this.PlotHeight()) };
};
plotArea2D.prototype.ClientUnitToPlotUnit = function () {
    return { X: (this.PlotWidth() / this.Width()), Y: (this.PlotHeight() / this.Height()) };
};

plotArea2D.prototype.uvMousePointer = function () {
    return this.MapClientToUV({ X: mouseX, Y: mouseY });
};
plotArea2D.prototype.PlotMousePointer = function () {
    return this.MapUVToPlot(this.uvMousePointer());
};
plotArea2D.prototype.ContainsMousePointer = function () {
    let UV = this.uvMousePointer();
    return (UV.X >= 0 && UV.X <= 1 && UV.Y >= 0 && UV.Y <= 1);
};
plotArea2D.prototype.RectFnxContainsMousePointer = function (fnx, thickness, OnMousePointerOnCurve) {
    if (!(typeof (fnx) === 'function')) return false;
    let bolRet = false;
    let areaPlot = this.PlotArea();
    let posThis = this.Pos();
    let sizeThis = this.Size();
    let resUnit = this.ClientUnitToPlotUnit();
    let plotPointer = this.PlotMousePointer();
    let pointerFy = fnx(plotPointer.X);
    if (abs(plotPointer.Y - pointerFy) <= abs(thickness * resUnit.Y)) {
        if (typeof (OnMousePointerOnCurve) === 'function') OnMousePointerOnCurve();
        bolRet = true;
    }
    return bolRet;
};

plotArea2D.prototype.DrawBorder = function (color, thickness) {
    stroke(color);
    strokeWeight(thickness);
    noFill();
    let posThis = this.Pos();
    let sizeThis = this.Size();
    rect(posThis.X, posThis.Y, sizeThis.Width, sizeThis.Height);
};
plotArea2D.prototype.Fill = function (color) {
    noStroke();
    fill(color);
    let posThis = this.Pos();
    let sizeThis = this.Size();
    rect(posThis.X, posThis.Y, sizeThis.Width, sizeThis.Height);
};
plotArea2D.prototype.DrawGrid_Rect = function (color, thickness, gridLength) {
    let areaPlot = this.PlotArea();
    let gridCount = { X: 1 + abs(areaPlot.Size.Width / gridLength.X), Y: 1 + abs(areaPlot.Size.Height / gridLength.Y) };
    let gridTick = { X: sign(areaPlot.Size.Width) * abs(gridLength.X), Y: sign(areaPlot.Size.Height) * abs(gridLength.Y) };
    let posThis = this.Pos();
    let sizeThis = this.Size();
    stroke(color);
    strokeWeight(thickness);
    for (let gridI = areaPlot.Min.X, gridCI = 0; gridCI <= gridCount.X; gridI += gridTick.X, gridCI++) {
        let gridIP = gridI - (gridI % gridTick.X);
        let gridXi = this.MapPlotToClient({ X: gridIP }).X;
        if (gridXi >= posThis.X && gridXi <= posThis.X + sizeThis.Width + 1) {
            line(gridXi, posThis.Y, gridXi, posThis.Y + sizeThis.Height);
        }
    }
    for (let gridI = areaPlot.Min.Y, gridCI = 0; gridCI <= gridCount.Y; gridI += gridTick.Y, gridCI++) {
        let gridIP = gridI - (gridI % gridTick.Y);
        let gridYi = this.MapPlotToClient({ Y: gridIP }).Y;
        if (gridYi >= posThis.Y && gridYi <= posThis.Y + sizeThis.Height + 1) {
            line(posThis.X, gridYi, posThis.X + sizeThis.Width, gridYi);
        }
    }
};
plotArea2D.prototype.DrawGrid_Polar = function (color, thickness, gridLength, sectorColor, sectorThickness, sectorLength) {
    let areaPlot = this.PlotArea();
    let areaSize = areaPlot.Size;
    let gridCount = { X: int(abs(areaSize.Width / gridLength)) * 2, Y: int(abs(areaSize.Height / gridLength)) * 2 };
    let gridInvCount = { X: 1 / gridCount.X, Y: 1 / gridCount.Y };
    let areaMaxDist = -Infinity;
    let areaMinDist = Infinity;
    let areaMaxAngle = -Infinity;
    let areaMinAngle = Infinity;
    for (let Xi = -1; Xi <= gridCount.X + 1; Xi++) {
        for (let Yi = -1; Yi <= gridCount.Y + 1; Yi++) {
            let posRect = {
                X: areaPlot.Min.X + Xi * gridInvCount.X * areaSize.Width,
                Y: areaPlot.Min.Y + Yi * gridInvCount.Y * areaSize.Height
            };
            let posPolar = RectToPolar(posRect);
            areaMaxDist = max(posPolar.Dist, areaMaxDist);
            areaMinDist = min(posPolar.Dist, areaMinDist);
            areaMaxAngle = max(posPolar.Ang, areaMaxAngle);
            areaMinAngle = min(posPolar.Ang, areaMinAngle);
        }
    }
    let posOrigin = this.MapPlotToClient({ X: 0, Y: 0 });
    this.BeginClipping();
    noFill();
    stroke(color);
    strokeWeight(thickness);
    for (let gridI = areaMinDist; gridI <= areaMaxDist; gridI += gridLength) {
        let gridIP = gridI - (gridI % gridLength);
        let gridII = this.MapPlotToClient({ X: gridIP, Y: gridIP });
        ellipse(posOrigin.X, posOrigin.Y, (gridII.X - posOrigin.X) * 2, (gridII.Y - posOrigin.Y) * 2);
    }
    if (sectorColor && sectorThickness && sectorLength) {
        let sectorLengthRad = sectorLength * TAU;
        stroke(sectorColor);
        strokeWeight(sectorThickness);
        for (let gridI = areaMinAngle; gridI <= areaMaxAngle; gridI += sectorLengthRad) {
            let gridIP = gridI - (gridI % sectorLengthRad);
            let gridII = this.MapPlotToClient({ X: cos(gridIP) * areaMaxDist, Y: sin(gridIP) * areaMaxDist });
            line(posOrigin.X, posOrigin.Y, gridII.X, gridII.Y);
        }
    }
    this.EndClipping();
};
let intpItr;
plotArea2D.prototype.DrawAxis = function (colorAxis, colorMarks, thickness, axisMarkLength, gridLength) {
    let areaPlot = this.PlotArea();
    let gridCount = { X: 1 + abs(areaPlot.Size.Width / gridLength.X), Y: 1 + abs(areaPlot.Size.Height / gridLength.Y) };
    let gridTick = { X: sign(areaPlot.Size.Width) * abs(gridLength.X), Y: sign(areaPlot.Size.Height) * abs(gridLength.Y) };
    let posOrigin = this.MapPlotToClient({ X: 0, Y: 0 });
    let posThis = this.Pos();
    let sizeThis = this.Size();
    if (posOrigin.Y >= posThis.Y && posOrigin.Y <= posThis.Y + sizeThis.Height) {
        stroke(colorAxis);
        strokeWeight(thickness);
        line(posThis.X, posOrigin.Y, posThis.X + sizeThis.Width, posOrigin.Y);
        stroke(colorMarks);
        for (let gridI = areaPlot.Min.X, gridCI = 0; gridCI <= gridCount.X; gridI += gridTick.X, gridCI++) {
            let gridIP = gridI - (gridI % gridTick.X);
            let gridXi = this.MapPlotToClient({ X: gridIP }).X;
            let lengthMark = axisMarkLength;
            strokeWeight(thickness * 0.5);
            if (gridXi >= posThis.X && gridXi <= posThis.X + sizeThis.Width + 1) {
                line(gridXi, max(posOrigin.Y - lengthMark, posThis.Y), gridXi, min(posOrigin.Y + lengthMark, posThis.Y + sizeThis.Height));
            }
        }
    }
    if (posOrigin.X >= posThis.X && posOrigin.X <= posThis.X + sizeThis.Width) {
        stroke(colorAxis);
        strokeWeight(thickness);
        line(posOrigin.X, posThis.Y, posOrigin.X, posThis.Y + sizeThis.Height + 1);
        stroke(colorMarks);
        for (let gridI = areaPlot.Min.Y, gridCI = 0; gridCI <= gridCount.Y; gridI += gridTick.Y, gridCI++) {
            let gridIP = gridI - (gridI % gridTick.Y);
            let gridYi = this.MapPlotToClient({ Y: gridIP }).Y;
            let lengthMark = axisMarkLength;
            strokeWeight(thickness * 0.5);
            if (gridYi >= posThis.Y && gridYi <= posThis.Y + sizeThis.Height + 1) {
                line(max(posOrigin.X - lengthMark, posThis.X), gridYi, min(posOrigin.X + lengthMark, posThis.X + sizeThis.Width), gridYi);
            }
        }
    }
};
plotArea2D.prototype.DrawCurve_RectFnx = function (fnx, color, thickness, samplesOfX) {
    if (!(typeof (fnx) === 'function')) return 0;
    let areaPlot = this.PlotArea();
    let posThis = this.Pos();
    let sizeThis = this.Size();
    let resSample = areaPlot.Size.Width / samplesOfX;
    this.BeginClipping();
    noFill();
    stroke(color);
    strokeWeight(thickness);
    beginShape();
    for (let Xi = areaPlot.Min.X, Ni = 0; Ni <= samplesOfX; Xi += resSample, Ni++) {
        let Yi = fnx(Xi);
        if (typeof (Yi) === 'undefined') { endShape(); beginShape(); continue; }
        let PosI = this.MapPlotToClient({ X: Xi, Y: Yi });
        vertex(PosI.X, PosI.Y);
    }
    endShape();
    this.EndClipping();
};
plotArea2D.prototype.DrawCurve_ParmetricFnx = function (fxnt, color, thickness, tStart, tEnd, tSamples) {
    if (!(typeof (fxnt) === 'function')) return 0;
    let areaPlot = this.PlotArea();
    let posThis = this.Pos();
    let sizeThis = this.Size();
    let resSample = (tEnd - tStart) / tSamples;
    this.BeginClipping();
    noFill();
    stroke(color);
    strokeWeight(thickness);
    beginShape();
    for (let Ti = tStart, Ni = 0; Ni <= tSamples; Ti += resSample, Ni++) {
        let valXY = fxnt(Ti);
        let PosI = this.MapPlotToClient({ X: valXY.X, Y: valXY.Y });
        vertex(PosI.X, PosI.Y);
    }
    endShape();
    this.EndClipping();
};
plotArea2D.prototype.DrawClipped = function (sub) {
    this.BeginClipping();
    sub();
    this.EndClipping();
};
plotArea2D.prototype.BeginClipping = function () {
    let parent = this.ParentElement;
    if (typeof (parent) === 'undefined') { return false; }
    let contextDraw2D = parent.getContext("2d");
    if (typeof (contextDraw2D) === 'undefined') { return false; }
    let areaClient = this.ClientArea();
    contextDraw2D.save();
    contextDraw2D.rect(areaClient.Min.X, areaClient.Min.Y, areaClient.Size.Width, areaClient.Size.Height);
    contextDraw2D.clip();
    this.isClipping = true;
    return true;
};
plotArea2D.prototype.EndClipping = function () {
    if (!this.isClipping) { return false; }
    let parent = this.ParentElement;
    if (typeof (parent) === 'undefined') { return false; }
    let contextDraw2D = parent.getContext("2d");
    if (typeof (contextDraw2D) === 'undefined') { return false; }
    contextDraw2D.restore();
    this.isClipping = false;
    return true;
};