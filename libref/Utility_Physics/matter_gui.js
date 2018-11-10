BodyGadget = function (objBody) {
    this.__proto__ = BodyGadget.__proto__;
    this.body = objBody;
    this.refBody = objBody.instance;
    this.hudBody = document.createElement("div");
    this.hudBody.style.pointerEvents = "none";
    this.hudBody.style.border = "solid yellow";
    this.buttonDelete = document.createElement("button");
    this.buttonDelete.style.pointerEvents = "auto";
    this.buttonDelete.innerText = "X";
    this.buttonDelete.style.backgroundColor = "#00000000";
    this.buttonDelete.style.color = "yellow";
    this.buttonDelete.style.fontWeight = "bold";
    this.buttonDelete.style.width = "16px";
    this.buttonDelete.style.height = "16px";
    this.buttonDelete.style.padding = "0";
    this.buttonDelete.subject = this;
    this.hudBody.appendChild(this.buttonDelete);
    this.buttonDelete.onmousedown = function (event) {
        this.subject.body.Delete(true);
        delete this.subject.body;
        delete this.subject.refBody;
        event.stopPropagation();
    };
    document.body.appendChild(this.hudBody);
    this.hudMain = document.createElement("div");
    this.hudMain.style.backgroundColor = "#20202080";
    this.hudMain.style.position = "absolute";
    this.hudMain.style.left = "0px";
    this.hudMain.style.top = "24px";
    this.hudMain.style.width = (windowWidth*0.5)+"px";
    this.hudMain.style.height = "240px";
    this.hudMain.style.padding = "0";
    document.body.appendChild(this.hudMain);
    this.update = function () {
        if (this.refBody) {
            let rect = {
                min: PlayFieldToClient(this.refBody.bounds.min, { width: PlayScreen_Width, height: PlayScreen_Height }),
                max: PlayFieldToClient(this.refBody.bounds.max, { width: PlayScreen_Width, height: PlayScreen_Height })
            };
            rect.size = { width: rect.max.x - rect.min.x, height: rect.max.y - rect.min.y };
            this.hudBody.style.position = "absolute";
            this.hudBody.style.left = (rect.min.x) + "px";
            this.hudBody.style.top = (rect.min.y) + "px";
            this.hudBody.style.width = (rect.size.width) + "px";
            this.hudBody.style.height = (rect.size.height) + "px";
            this.buttonDelete.style.hidden = !this.refBody.isStatic;
            this.hudMain.style.width = (windowWidth * 0.5) + "px";
            return true;
        } else {
            document.body.removeChild(this.hudBody);
            document.body.removeChild(this.hudMain);
            return false;
        }
    };
    this.Delete = function () {
        document.body.removeChild(this.hudBody);
        document.body.removeChild(this.hudMain);
        delete this.hudBody;
        delete this.hudMain;
        delete this.body;
        delete this.refBody;
    };
    this.update();
};