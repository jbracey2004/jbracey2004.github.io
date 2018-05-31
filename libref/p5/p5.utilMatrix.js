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
				if (typeof (elem) !== "string") {
					aryRet.push(floor(elem.length ** 0.5));
				}
			}
		}
		if(aryRet.length = 1) aryRet = aryRet[0];
		return aryRet;
	}
}
p5.Matrix.prototype.elemAry = function() {
	var aryRet = [];
	for (var elemId in this) {
		var elem = this[elemId];
		if (isIterable(elem)) {
			if (typeof (elem) !== "string") {
				aryRet.push(elem);
			}
		}
	}
	return aryRet;
}
p5.Matrix.prototype.rowAry = function(idxRow, setData) {
	var rowStride = this.rowStride();
	var aryElem = this.elemAry();
	if(aryElem.length == 0) {return [];}
	if(idxRow >=0 && idxRow < rowStride) {
		if(setData) {
			if (!isIterable(setData)) {return [];}
			for (var di = 0; di < rowStride; di++) {
				if(di < setData.length) {
					aryElem[0][idxRow * rowStride + di] = setData[di];
				}
			}
			return aryElem[0];
		} else {
			var aryRet = [];
			for(var di = 0; di < rowStride; di ++) {
				aryRet.push(aryElem[0][idxRow*rowStride + di]);
			}
			return aryRet;
		}
	}
}
Object.defineProperty(p5.Matrix.prototype, "RowStride", {
	get: function getRowStride() { return this.rowStride(); }, set: function setRowStride(value) { this.rowStride(value); }
});
Object.defineProperty(p5.Matrix.prototype, "Row", {
	get: function getRow(idxRow) { return this.rowAry(idxRow); }, set: function setRow(idxRow, value) { this.rowAry(idxRow, value); }
});