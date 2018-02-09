var v_X = 0;
var v_Y = 1;
var v_Z = 2;
var v_W = 3;
function vecN()
{
	this.dimensions = arguments.length;
	this.components = [arguments.length]
	for (var i = 0; i < arguments.length; i++) { this.components.push(arguments[i]);}
}
Object.defineProperty(vecN.prototype, "X", {
    get: function getX() {
		while (this.components.length <= v_X) {this.components.push(0);}
        return this.components[v_X];
    },
	set: function setX(value) {
		while (this.components.length <= v_X) { this.push(0); }
		this.components[v_X] = value;
	}
});
Object.defineProperty(vecN.prototype, "Y", {
	get: function getX() {
		while (this.components.length <= v_Y) { this.push(0); }
		return this.components[v_Y];
	},
	set: function setX(value) {
		while (this.components.length <= v_Y) { this.componentspush(0); }
		this.components[v_Y] = value;
	}
});
Object.defineProperty(vecN.prototype, "Z", {
	get: function getX() {
		while (this.length <= v_Z) { this.push(0); }
		return this.entries[v_Z];
	},
	set: function setX(value) {
		while (this.length <= v_Z) { this.push(0); }
		this.entries[v_Z] = value;
	}
});
Object.defineProperty(vecN.prototype, "W", {
	get: function getX() {
		while (this.length <= v_W) { this.push(0); }
		return this.entries[v_W];
	},
	set: function setX(value) {
		while (this.length <= v_W) { this.push(0); }
		this.entries[v_W] = value;
	}
});
vecN.prototype.toString = function() {
	var strRet = "("; 
	for(var i=0; i<this.components.length; i++){
		strRet += this.components[i].toString();
		if(i<this.components.length -1) {strRet+=", ";}
		}
	strRet += ")"; 
	return strRet;
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