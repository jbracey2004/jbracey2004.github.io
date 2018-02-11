function splineNode(setPos, setTangentPre, setTangentPost)
{
	this.Pos = setPos;
	this.TanPre = setTangentPre;
	this.TanPost = setTangentPost;
}

function spline(setNodes)
{
	this.nodes = [];
	if (!(typeof (setNodes) === 'undefined')) {
		for (var i = 0; i < setNodes.length; i++) { this.nodes.push(setNodes[i]); }
	}
}
spline.prototype.NetDifference = function() {
	return vecN.diff(this.nodes[this.nodes.length - 1].Pos, this.nodes[0].Pos);
}
spline.prototype.MapSplinePosToNodeIndex = function(splinePos) {
	var fPos = splinePos;
	while(fPos<0) {fPos += 1;}
	return (fPos % 1) * this.nodes.length;
}
spline.prototype.MapNodeIndexToSplinePos = function(nodeIndex) {
	var idxPos = nodeIndex;
	while(idxPos < 0) {idxPos += this.nodes.length;}
	return (idxPos/this.nodes.lengt) % 1;
}
spline.prototype.addNodes = function(newNodes) {
	for (var i = 0; i < setNodes.length; i++) { this.nodes.push(setNodes[i]); }
}
spline.prototype.removeNode = function(idxNode, intCount) {
	this.nodes.splice(idxNode, intCount);
}
spline.interpolate = function(fPos, vecPos1, vecTan1, vecPos2, vecTan2) {
	var vecRet = new vecN();
	vecN.sum(vecRet, vecN.scale(vecPos1, 2 * fPos ** 3 - 3 * fPos ** 2 + 1));
	vecN.sum(vecRet, vecN.scale(vecTan1, fPos ** 3 - 2 * fPos ** 2 + fPos + 1));
	vecN.sum(vecRet, vecN.scale(vecPos2, -2 * fPos ** 3 + 3 * fPos ** 2));
	vecN.sum(vecRet, vecN.scale(vecTan2, fPos ** 3 - 1 * fPos ** 2));
	return vecRet;
}