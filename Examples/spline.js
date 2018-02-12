var SplineEndBehaviour = {Halt: 0, Loop: 1, ContinueTan: 2, ContinuePattern: 3};
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
spline.prototype.MapSplinePosToNodeIndex = function (splinePos) {
	return (splinePos * this.nodes.length);
}
spline.prototype.MapNodeIndexToSplinePos = function (nodeIndex) {
	return (nodeIndex) / (this.nodes.length);
}
spline.prototype.AdjustNodeIndexToEndBehaviour = function(nodeIndex, intSplineEndBehaviour) {
	var fIdx = nodeIndex;
	var NLen = this.nodes.length;
	if (intSplineEndBehaviour === SplineEndBehaviour.Halt || 
		intSplineEndBehaviour === SplineEndBehaviour.ContinueTan) {
		if (fIdx < 0) { fIdx = 0; }
		if (fIdx > NLen - 1) { fIdx = NLen - 1; }
	}
	if (intSplineEndBehaviour === SplineEndBehaviour.Loop ||
		intSplineEndBehaviour === SplineEndBehaviour.ContinuePattern) {
		if (fIdx < 0) { fIdx += ((1 + floor(-fIdx / NLen)) * NLen); }
		if (fIdx > NLen - 1) { fIdx -= ((floor(fIdx / NLen)) * NLen); }
	}
	return fIdx;
}
spline.prototype.addNodes = function(newNodes) {
	for (var i = 0; i < setNodes.length; i++) { this.nodes.push(setNodes[i]); }
}
spline.prototype.removeNodesAt = function(idxNode, intCount) {
	this.nodes.splice(idxNode, intCount);
}
spline.prototype.PosAt = function(fnodePos, intSplineEndBehaviour) {
	var NLen = this.nodes.length;
	var fPos = this.MapSplinePosToNodeIndex(fnodePos);
	var fPosSt = floor(fPos);
	var fPosEd = fPosSt + 1;
	var fPosT = fPos - fPosSt;
	var vecRet = new vecN();
	if(fPos >= 0 && fPos <= NLen - 1) {
		var nodeSt = this.nodes[fPosSt];
		var nodeEd = this.nodes[fPosEd];
		vecRet = spline.interpolate(fPosT, nodeSt.Pos, nodeSt.PostTan, nodeEd.Pos, nodeEd.PreTan);
	} else {
		switch (intSplineEndBehaviour) {
			case SplineEndBehaviour.Halt:
				if(fPos < 0) vecRet = this.nodes[0].Pos;
				if(fPos > NLen - 1) vecRet = this.nodes[NLen - 1].Pos;
				break;
			case SplineEndBehaviour.ContinueTan:
				var extrap = 0;
				if (fPos < 0) {
					extrap = int(-fPos);
					vecRet = vecN.sum(this.nodes[0].Pos, vecN.scale(this.nodes[0].TanPre, extrap));
				} else if (fPos > NLen - 1) {
					extrap = int(fPos - (NLen - 1));
					vecRet = vecN.sum(this.nodes[NLen].Pos, vecN.scale(this.nodes[NLen].TanPost, extrap));
				}
				break;
			case SplineEndBehaviour.ContinuePattern:
				var extrap = 0;
				if (fPos < 0) {
					extrap = int(-fPos);
					vecRet = vecN.sum(this.nodes[0].Pos, vecN.scale(this.NetDifference(), -extrap));
				} else if (fPos > NLen - 1) {
					extrap = int(fPos - (NLen - 1));
					vecRet = vecN.sum(this.nodes[NLen].Pos, vecN.scale(this.NetDifference(), extrap));
				}
				intSplineEndBehaviour = SplineEndBehaviour.Loop;
			case SplineEndBehaviour.Loop:
				if(fPos < 0) {
					fPos += ((1 + floor(-fPos / NLen)) * NLen);
				} else if(fPos > NLen - 1) {
					fPos -= ((floor(fPos / NLen)) * NLen);
				}
				fPosSt = floor(fPos);
				fPosEd = (fPosSt + 1) % (NLen);
				fPosT = fPos - fPosSt;
				var nodeSt = this.nodes[fPosSt];
				var nodeEd = this.nodes[fPosEd];
				vecRet = vecN.sum(vecRet, spline.interpolate(fPosT, nodeSt.Pos, nodeSt.PostTan, nodeEd.Pos, nodeEd.PreTan));
				break;
		}
	}
	return vecRet;
}
spline.interpolate = function(fPos, vecPos1, vecTan1, vecPos2, vecTan2) {
	var vecRet = new vecN();
	vecN.sum(vecRet, vecN.scale(vecPos1, 2 * fPos ** 3 - 3 * fPos ** 2 + 1));
	vecN.sum(vecRet, vecN.scale(vecTan1, fPos ** 3 - 2 * fPos ** 2 + fPos + 1));
	vecN.sum(vecRet, vecN.scale(vecPos2, -2 * fPos ** 3 + 3 * fPos ** 2));
	vecN.sum(vecRet, vecN.scale(vecTan2, fPos ** 3 - 1 * fPos ** 2));
	return vecRet;
}