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
	this.Dimensions = setDimensions;
	this.node = setNodes;
}