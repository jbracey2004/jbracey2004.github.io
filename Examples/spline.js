var v_X = 0;
var v_Y = 1;
var v_Z = 2;
var v_W = 3;
function vecN()
{
	this.__proto__ = vecN.__proto__;
	this.dimensions = arguments.length;
	this.components = new Array(...arguments);
}
Object.defineProperty(vecN.__proto__, "X", {
	get: function getX() { return vecN.cX(this); }, set: function setX(value) { vecN.cX(this, value);}
});
Object.defineProperty(vecN.__proto__, "Y", {
	get: function getY() { return vecN.cY(this); }, set: function setY(value) { vecN.cY(this, value);}
});
Object.defineProperty(vecN.__proto__, "Z", {
	get: function getZ() { return vecN.cZ(this); }, set: function setZ(value) { vecN.cZ(this, value);}
});
Object.defineProperty(vecN.__proto__, "W", {
	get: function getW() { return vecN.cW(this); }, set: function setW(value) { vecN.cW(this, value);}
});
Object.defineProperty(vecN.__proto__, "Norm", {
	get: function getNorm() {return vecN.norm(this);},set: function setNorm(value) {vecN.norm(this, value);}
});
Object.defineProperty(vecN.__proto__, "Mag", {
	get: function getMag() {return vecN.mag(this);},set: function setMag(value) {vecN.mag(this, value);}
});
vecN.component = function(v, idxComponent, setValue) {
	if(idxComponent >=0 && idxComponent < v.components.length) {
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
vecN.cX = function(v, setValue) { return vecN.component(v, v_X, setValue);}
vecN.cY = function(v, setValue) { return vecN.component(v, v_Y, setValue);}
vecN.cZ = function(v, setValue) { return vecN.component(v, v_Z, setValue);}
vecN.cW = function(v, setValue) { return vecN.component(v, v_W, setValue);}
vecN.mag = function(v, setMag) {
	if(typeof(setMag) === 'undefined') {
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
vecN.norm = function(v, setNorm) {
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
vecN.dot = function(a, b) {
	var dims = max(a.components.length,b.components.length);
	var ret = 0;
	for(var i=0; i<dims; i++) {
		var fa = 0;
		var fb = 0;
		if(i < a.components.length) {fa = a.components[i];}
		if(i < b.components.length) {fb = b.components[i];}
		ret += (fa*fb);
	}
	return ret;
}
vecN.sum = function (a, b) {
	var dims = max(a.components.length, b.components.length);
	var ret = [dims];
	for (var i = 0; i < dims; i++) {
		var fa = 0;
		var fb = 0;
		if (i < a.components.length) { fa = a.components[i]; }
		if (i < b.components.length) { fb = b.components[i]; }
		ret[i] = fa+fb;
	}
	return ret;
}
vecN.diff = function (a, b) {
	var dims = max(a.components.length, b.components.length);
	var ret = [dims];
	for (var i = 0; i < dims; i++) {
		var fa = 0;
		var fb = 0;
		if (i < a.components.length) { fa = a.components[i]; }
		if (i < b.components.length) { fb = b.components[i]; }
		ret[i] = fa - fb;
	}
	return ret;
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
	var ret = [dims];
	for (var i = 0; i < dims; i++) {
		var fa = 0;
		var fb = 0;
		if (i < a.components.length) { fa = a.components[i]; }
		if (i < b.components.length) { fb = b.components[i]; }
		ret[i] = fa * fb;
	}
	return ret;
}
vecN.prototype.toString = function() {
	var strRet = "("; 
	for(var i=0; i<this.components.length; i++){
		strRet += this.components[i].toString();
		if(i<this.components.length -1) {strRet+=", ";}
		}
	strRet += ")"; 
	return strRet;
}

function vec2(_x, _y)
{
	vecN.call(this, _x, _y);
	this.__proto__ = vecN.__proto__;
}

function vec3(_x, _y, _z) 
{
	vecN.call(this, _x, _y, _z);
	this.__proto__ = vecN.__proto__;
}

function vec4(_x, _y, _z, _w) 
{
	vecN.call(this, _x, _y, _z, _w);
	this.__proto__ = vecN.__proto__;
}

function splineNode(setDimensions, setPos, setTangentPre, setTangentPost)
{
	this.Dimensions = setDimensions;
	this.Pos = [this.Dimensions];
	this.TanPre = [this.Dimensions];
	this.TanPost = [this.Dimensions];
	for(var di=0; di<this.Dimensions; di++) {
		if (di < setPos.length) { this.Pos[di] = setPos[di]; }
		if (di < TanPre.length) { this.TanPre[di] = setTangentPre[di]; }
		if (di < TanPost.length) { this.TanPost[di] = setTangentPost[di]; }
	}
}

function spline(setDimensions, setNodes)
{
	if (!(typeof(setDimensions) === 'undefined')) {this.Dimensions = setDimensions;} else {this.Dimensions = 1;}
	if (!(typeof(setDimensions) === 'undefined')) {this.node = setNodes} else {this.node = []};
}