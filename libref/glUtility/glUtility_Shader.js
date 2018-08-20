function clsGLShader(gl, glProgram) {
    this.contextGL = gl;
    this.glRef = glProgram;
}
clsGLShader.prototype.AttributeLocation = function (strAttrName) {
    return this.contextGL.getAttribLocation(this.glRef, strAttribName);
}
clsGLShader.prototype.UniformLocation = function (strUniformName) {
    return this.contextGL.getUniformLocation(this.glRef, strUniformName);
}

glUT.createShaderFromSource = function (contextGL, glType, strShaderSrc) {
    var glShader = contextGL.createShader(glType);
    contextGL.shaderSource(glShader, strShaderSrc);
    contextGL.compileShader(glShader);
    var glResult = contextGL.getShaderPAramater(glShader, contextGL.COMPILE_STATUS);
    var strLog = contextGL.getShaderInfoLog(glShader);
    console.log(strLog);
    return { Shader : glShader, Result : glResult, Log : strLog };
}
glUT.createShaderProgram = function (contextGL, aryShaders) {
    var glProgram = contextGL.createProgram();
    for (var itmShader of aryShaders) { contextGL.attachShader(glProgram, itmShader);}
    contextGL.linkProgram(glProgram);
    var glResult = contextGL.getProgramParameter(glProgram, contextGL.LINK_STATUS);
    var strLog = contextGL.getProgramInfoLog(glProgram);
    console.log(strLog);
    return { Program: glProgram, Result : glResult, Log : strLog };
}

