var aryMotion = [];
function vectorMotion() {
    this.__proto__ = vectorMotion.__proto__;
    this.Position = new vecN();
    this.Velocity = new vecN();
    this.Acceleration = new vecN();
    this.OnUpdate = function (mot) {return;};
    aryMotion.push(this);
}
vectorMotion.Consume = function (dt) {
    for (let mot of aryMotion) {
        mot.Velocity = vecN.sum(mot.Velocity, vecN.scale(mot.Acceleration, dt));
        mot.Position = vecN.sum(mot.Position, vecN.scale(mot.Velocity, dt));
        if (mot.OnUpdate) {
            mot.OnUpdate(mot);
        }
    }
};