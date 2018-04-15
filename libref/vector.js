var v_X = 0;
var v_Y = 1;
var v_Z = 2;
var v_W = 3;
function vecN() {
	this.components = new Array(...arguments);
}
function vec2(_x, _y) { vecN.call(this, _x, _y); }
function vec3(_x, _y, _z) { vecN.call(this, _x, _y, _z); }
function vec4(_x, _y, _z, _w) { vecN.call(this, _x, _y, _z, _w); }
Object.defineProperty(vecN.__proto__, "X", {
	get: function getX() { return vecN.cX(this); }, set: function setX(value) { vecN.cX(this, value); }
});
Object.defineProperty(vecN.__proto__, "Y", {
	get: function getY() { return vecN.cY(this); }, set: function setY(value) { vecN.cY(this, value); }
});
Object.defineProperty(vecN.__proto__, "Z", {
	get: function getZ() { return vecN.cZ(this); }, set: function setZ(value) { vecN.cZ(this, value); }
});
Object.defineProperty(vecN.__proto__, "W", {
	get: function getW() { return vecN.cW(this); }, set: function setW(value) { vecN.cW(this, value); }
});
Object.defineProperty(vecN.__proto__, "Norm", {
	get: function getNorm() { return vecN.norm(this); }, set: function setNorm(value) { vecN.norm(this, value); }
});
Object.defineProperty(vecN.__proto__, "Mag", {
	get: function getMag() { return vecN.mag(this); }, set: function setMag(value) { vecN.mag(this, value); }
});
Object.defineProperty(vecN.__proto__, "Dimensions", {
	get: function getDimensions() { return vecN.dimLen(this); }, set: function setDimensions(value) { vecN.dimLen(this, value); }
});
vecN.cN = function (v, idxComponent, setValue) {
	if (typeof (setValue) === 'undefined') {
		if (idxComponent >= 0 && idxComponent < v.components.length) {
			return v.components[idxComponent];
		} else {
			return 0;
		}
	} else {
		if (idxComponent >= 0 && idxComponent < v.components.length) {
			v.components[idxComponent] = setValue;
		} else {
			if(idxComponent >= 0) {
				vecN.dimLen(v, idxComponent);
				v.components[idxComponent] = setValue;
			} else {
				for (var di = 0; di < v.componenta.length; di++) {
					v.components[di] = setValue;
				}
			}
		}
		return v.components;
	}
}
vecN.cX = function (v, setValue) { return vecN.cN(v, v_X, setValue); }
vecN.cY = function (v, setValue) { return vecN.cN(v, v_Y, setValue); }
vecN.cZ = function (v, setValue) { return vecN.cN(v, v_Z, setValue); }
vecN.cW = function (v, setValue) { return vecN.cN(v, v_W, setValue); }
vecN.dimLen = function(v, setDim) {
	if(typeof(setDim) === 'undefined') {
		return v.components.length;
	} else {
		var dimOld = v.components.length;
		ary = [setDim];
		for (var i = 0; i < setDim; i++) {
			if(i < dimOld) {ary[i] = v.components[i]} else {ary[i] = 0;}
		}
		v.components = ary;
		return ary;
	}
}
vecN.mag = function (v, setMag) {
	if (typeof (setMag) === 'undefined') {
		var ret = 0;
		for (var i = 0; i < v.components.length; i++) {
			ret += v.components[i] ** 2;
		}
		return ret ** 0.5;
	} else {
		var fMagInv = 1 / vecN.mag(v);
		for (var i = 0; i < v.components.length; i++) {
			if (i < v.components.length) {
				v.components[i] *= fMagInv * setMag;
			}
		}
		return v.components;
	}
}
vecN.norm = function (v, setNorm) {
	if (typeof (setNorm) === 'undefined') {
		var fMagInv = 1 / vecN.mag(v);
		var ary = [v.components.length];
		for (var i = 0; i < v.components.length; i++) {
			ary[i] = v.components[i] * fMagInv;
		}
		return new vecN(...ary);
	} else {
		var fMagVInv = 1 / vecN.mag(setNorm);
		var fMag = vecN.mag(v);
		for (var i = 0; i < v.components.length; i++) {
			if (i < setNorm.components.length) {
				v.components[i] = setNorm.components[i] * fMagVInv * fMag;
			}
		}
		return v.components;
	}
}
vecN.dot = function (a, b) {
	var dims = max(a.components.length, b.components.length);
	var ret = 0;
	for (var i = 0; i < dims; i++) {
		var fa = 0;
		var fb = 0;
		if (i < a.components.length) { fa = a.components[i]; }
		if (i < b.components.length) { fb = b.components[i]; }
		ret += (fa * fb);
	}
	return ret;
}
vecN.sum = function (a, b) {
	var dims = max(a.components.length, b.components.length);
	var ary = [dims];
	for (var i = 0; i < dims; i++) {
		var fa = 0;
		var fb = 0;
		if (i < a.components.length) { fa = a.components[i]; }
		if (i < b.components.length) { fb = b.components[i]; }
		ary[i] = fa + fb;
	}
	return new vecN(...ary);
}
vecN.diff = function (a, b) {
	var dims = max(a.components.length, b.components.length);
	var ary = [dims];
	for (var i = 0; i < dims; i++) {
		var fa = 0;
		var fb = 0;
		if (i < a.components.length) { fa = a.components[i]; }
		if (i < b.components.length) { fb = b.components[i]; }
		ary[i] = fa - fb;
	}
	return new vecN(...ary);
}
vecN.dist = function (a, b) {
	var vecTmp = vecN.diff(a, b);
	var ret = 0;
	for (var i = 0; i < vecTmp.components.length; i++) {
		ret += vecTmp.components[i] ** 2;
	}
	return ret ** 0.5;
}
vecN.product = function (a, b) {
	var dims = max(a.components.length, b.components.length);
	var ary = [dims];
	for (var i = 0; i < dims; i++) {
		var fa = 0;
		var fb = 0;
		if (i < a.components.length) { fa = a.components[i]; }
		if (i < b.components.length) { fb = b.components[i]; }
		ary[i] = fa * fb;
	}
	return new vecN(...ary);
}
vecN.scale = function (v, s) {
	var ary = [v.components.length];
	for (var i = 0; i < v.components.length; i++) {
		ary[i] = v.components[i] * s;
	}
	return new vecN(...ary);
}
vecN.prototype.toString = function () {
	var strRet = "(";
	for (var i = 0; i < this.components.length; i++) {
		strRet += this.components[i].toString();
		if (i < this.components.length - 1) { strRet += ", "; }
	}
	strRet += ")";
	return strRet;
}
vec2.cross = function (a, b) {
	return vecN.cX(a) * vecN.cY(b) - vecN.cY(a) * vecN.cX(b);
}
vec3.cross = function (a, b) {
	var ary = [3];
	ary[v_X] = vecN.cY(a) * vecN.cZ(b) - vecN.cZ(a) * vecN.cY(b);
	ary[v_Y] = vecN.cZ(a) * vecN.cX(b) - vecN.cX(a) * vecN.cZ(b);
	ary[v_z] = vecN.cX(a) * vecN.cY(b) - vecN.cY(a) * vecN.cX(b);
	return new vecN(...ary);
}

function boxN(_min, _max) {
	this.__proto__ = boxN.__proto__;
	if(typeof(_min) === 'undefined') {this.Min = new vecN();} else {this.Min = _min;}
	if(typeof(_max) === 'undefined') {this.Max = new vecN();} else {this.Max = _max;}
}
Object.defineProperty(boxN.__proto__, "Size", {
	get: function getSize() { return boxN.size(this); }, set: function setSize(value) { boxN.size(this, value); }
});
Object.defineProperty(boxN.__proto__, "Center", {
	get: function getCenter() { return boxN.center(this); }, set: function setCenter(value) { boxN.center(this, value); }
});
boxN.size = function (b, setSize) {
	if (typeof (setSize) === 'undefined') {
		return vecN.diff(b.Max, b.Min);
	} else {
		b.Max = vecN.sum(b.Min, setSize);
		return {Min:b.Min, Max:b.Max};
	}
}
boxN.center = function (b, setCenter) {
	if (typeof (setCenter) === 'undefined') {
		return vecN.scale(vecN.sum(b.Min, b.Max), 0.5);
	} else {
		var sz = boxN.size(b);
		b.Min = vecN.sum(setCenter, vecN.scale(sz, -0.5));
		b.Max = vecN.sum(setCenter, vecN.scale(sz, 0.5));
		return { Min: b.Min, Max: b.Max };
	}
}
boxN.prototype.coInsides = function (b) {
	var dims = max(this.Min.components.length, this.Max.components.length, b.Min.components.length, b.Max.components.length);
	var bolRet = true;
	for (var di = 0; di < dims; di++) {
		var v1min = vecN.cN(this.Min, di); var v1max = vecN.cN(this.Max, di);
		var v2min = vecN.cN(b.Min, di); var v2max = vecN.cN(b.Max, di);
		if (!((v1min >= v2min && v1min <= v2max) && (v1max >= v2min && v1max <= v2max))) {
			bolRet = false;
			break;
		}
	}
	return bolRet;
}
boxN.prototype.containsVec = function (p) {
	var dims = max(this.Min.components.length, this.Max.components.length, b.Min.components.length, b.Max.components.length);
	var bolRet = true;
	for(var di = 0; di < dims; di ++) {
		var pn = vecN.cN(p, di);
		var bmin = vecN.cN(this.Min, di); var bmax = vecN.cN(this.Max, di);
		if(!(pn >= bmin && pn <= bmax)) {
			bolRet = false;
			break;
		}
	}
	return bolRet;
}
boxN.intersects = function(a, b) {
	var dims = max(a.Min.components.length, a.Max.components.length, b.Min.components.length, b.Max.components.length);
	var bolRet = true;
	for(var di = 0; di < dims; di ++) {
		var v1min = vecN.cN(a.Min, di); var v1max = vecN.cN(a.Max, di);
		var v2min = vecN.cN(b.Min, di); var v2max = vecN.cN(b.Max, di);
		if(!((v1min >= v2min && v1min <=v2max) || (v1max >= v2min && v1max <= v2max))) {
			bolRet = false;
			break;
		}
	}
	return bolRet;
}
boxN.intersection = function (a, b) {
	var dims = max(a.Min.components.length, a.Max.components.length, b.Min.components.length, b.Max.components.length);
	var vecRet = new boxN();
	for (var di = 0; di < dims; di++) {
		var v1min = vecN.cN(a.Min, di); var v1max = vecN.cN(a.Max, di);
		var v2min = vecN.cN(b.Min, di); var v2max = vecN.cN(b.Max, di);
		if ((v1min >= v2min && v1min <= v2max) || (v1max >= v2min && v1max <= v2max)) {
			vecN.cN(vecRet.Min, di, max(v1min, v2min));
			vecN.cN(vecRet.Max, di, min(v1max, v2max));
		} else {
			vecN.cN(vecRet.Min, di, NaN);
			vecN.cN(vecRet.Max, di, NaN);
		}
	}
	return vecRet;
}