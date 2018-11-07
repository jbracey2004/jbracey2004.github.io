BodyGadget = function (objBody) {
    this.__proto__ = BodyGadget.__proto__;
    this.body = objBody;
    this.refBody = objBody.instance;
    this.hud = document.createElement("div");
    this.hud.style.pointerEvents = "none";
    this.buttonDelete = document.createElement("button");
    this.buttonDelete.style.pointerEvents = "auto";
    this.buttonDelete.innerText = "X";
    this.buttonDelete.style.backgroundColor = "#00000000";
    this.buttonDelete.style.color = "white";
    this.buttonDelete.style.fontWeight = "bold";
    this.buttonDelete.style.width = "16px";
    this.buttonDelete.style.height = "16px";
    this.buttonDelete.style.padding = "0";
    this.buttonDelete.subject = this;
    this.hud.appendChild(this.buttonDelete);
    document.body.appendChild(this.hud);
    this.buttonDelete.onmousedown = function (event) {
        this.subject.body.Delete(true);
        delete this.subject.body;
        delete this.subject.refBody;
        event.stopPropagation();
    };
    this.update = function () {
        if (this.refBody) {
            let rect = {
                min: PlayFieldToClient(this.refBody.bounds.min, { width: PlayScreen_Width, height: PlayScreen_Height }),
                max: PlayFieldToClient(this.refBody.bounds.max, { width: PlayScreen_Width, height: PlayScreen_Height })
            };
            rect.size = { width: rect.max.x - rect.min.x, height: rect.max.y - rect.min.y };
            this.hud.style.position = "absolute";
            this.hud.style.left = rect.min.x + "px";
            this.hud.style.top = rect.min.y + "px";
            this.hud.style.width = rect.size.width + "px";
            this.hud.style.height = rect.size.height + "px";
            this.hud.style.border = "solid yellow";
            this.hud.style.pointerEvents = "none";
            return true;
        } else {
            document.body.removeChild(this.hud);
            return false;
        }
    };
    this.Delete = function () {
        document.body.removeChild(this.hud);
        delete this.hud;
        delete this.body;
        delete this.refBody;
    };
    this.update();
};