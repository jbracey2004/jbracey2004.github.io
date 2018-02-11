var v_X = 0;
var v_Y = 1;
var v_Z = 2;
var v_W = 3;
function vecN() {
	this.__proto__ = vecN.__proto__;
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
	if (idxComponent >= 0 && idxComponent < v.components.length) {
		if (typeof (setValue) === 'undefined') {
			return v.components[idxComponent];
		} else {
			v.components[idxComponent] = setValue;
			return v.components;
		}
	} else {
		return 0;
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
	for (var i = 0; i < vecTmp.length; i++) {
		ret += vecTmp[i] ** 2;
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
