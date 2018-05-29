newMatrixAry = function (n) { return new Float32Array(n * n).fill().map((item, index) => (((index % (n + 1)) == 0)) ? 1 : 0); }
p5.Matrix.prototype.rowStride = function(setValue) {
	if(setValue) {
		if(setValue == 3) {
			if(this.mat3) return this.mat3;
			if(this.mat4) {
				this.mat3 = newMatrixAry(3)
				for(var i = 0; i < 3; i++) {
					for(var j =0; j < 3; j++) {
						this.mat3[i * 3 + j] = this.mat4[i * 4 + j];
					}
				}
				delete(this.mat4);
				return this.mat3;
			}
			return null;
		}
		if(setValue == 4) {
			if (this.mat4) return this.mat4;
			if (this.mat3) {
				this.mat4 = newMatrixAry(4);
				for (var i = 0; i < 3; i++) {
					for (var j = 0; j < 3; j++) {
						this.mat4[i * 4 + j] = this.mat3[i * 3 + j];
					}
				}
				delete(this.mat3);
				return this.mat4;
			}
			return null;
		}
		return null;
	} else {
		if (this.mat3) return 3;
		if (this.mat4) return 4;
		return -1;
	}	
}
/*p5.Matrix.prototype.rowStride = function (setValue) {
	if (setValue) {
		if (setValue == 3) {
			if (this.mat3) return this.mat3;
			if (this.mat4) {
				this.mat3 = newMatrixAry(3)
				for (var i = 0; i < 3; i++) {
					for (var j = 0; j < 3; j++) {
						this.mat3[i * 3 + j] = this.mat4[i * 4 + j];
					}
				}
				delete (this.mat4);
				return this.mat3;
			}
			return null;
		}
		if (setValue == 4) {
			if (this.mat4) return this.mat4;
			if (this.mat3) {
				this.mat4 = newMatrixAry(4);
				for (var i = 0; i < 3; i++) {
					for (var j = 0; j < 3; j++) {
						this.mat4[i * 4 + j] = this.mat3[i * 3 + j];
					}
				}
				delete (this.mat3);
				return this.mat4;
			}
			return null;
		}
		return null;
	} else {
		var aryRet = [];
		for(var elem in this) {
			aryRet.push(.name);
			//if(typeof(elem) === "Array") {
			//	aryRet.push(aryData);
			//}
		}
		return aryRet;
	}
} */
Object.defineProperty(p5.Matrix.prototype, "RowStride", {
	get: function getRowStride() { return this.rowStride(); }, set: function setRowStride(value) { this.rowStride(value); }
});