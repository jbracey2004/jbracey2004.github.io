function isIterable(obj) {
	if (obj == null) {
		return false;
	}
	return typeof obj[Symbol.iterator] === 'function';
}
newMatrixAry = function (n) { return new Float32Array(n * n).fill().map((item, index) => (((index % (n + 1)) == 0)) ? 1 : 0); }
p5.Matrix.prototype.rowStride = function (setValue) {
	if (setValue) {
		var aryRet = [];
		var aryValue = [];
		if(setValue.length) {
			for(var itm of setValue) {aryValue.push(floor(itm));}
		} else {
			aryValue.push(floor(setValue));
		}
		var idx = 0;
		for (var elemId in this) {
			if(idx >= aryValue.length) {break;}
			var elem = this[elemId];
			if (isIterable(elem)) {
				if (typeof(elem) !== "string") {
					var dimOld = floor(elem.length ** 0.5);
					var dimNew = aryValue[idx];
					var dimMax = Math.max(dimOld, dimNew);
					var idName = elemId.replace(/([\d\.\,])+$/, "");
					var idNew = idName + dimNew.toString();
					this[idNew] = newMatrixAry(dimNew);
					for(var di = 0; di < dimMax; di++) {
						for(var dj = 0; dj < dimMax; dj++) {
							var idxOld = (di * dimOld) + dj;
							var idxNew = (di * dimNew) + dj;
							if(idxOld < this[elemId].length && idxNew < this[idNew].length) {
								this[idNew][idxNew] = this[elemId][idxOld];
							}
						}
					}
					aryRet.push(this[idNew]);
					delete this[elemId];
					idx ++;
				}
			}
		}
		if (aryRet.length = 1) { aryRet = aryRet[0]; }
		return aryRet;
	} else {
		var aryRet = [];
		for(var elemId in this) {
			var elem = this[elemId];
			if(isIterable(elem)) {
				if(elem.__proto__ !== String) {
					aryRet.push(floor(elem.length ** 0.5));
				}
			}
		}
		if(aryRet.length = 1) aryRet = aryRet[0];
		return aryRet;
	}
}
Object.defineProperty(p5.Matrix.prototype, "RowStride", {
	get: function getRowStride() { return this.rowStride(); }, set: function setRowStride(value) { this.rowStride(value); }
});