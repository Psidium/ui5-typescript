sap.ui.define(["sap/ui/core/Batata"], function (Batata_1) {
    "use strict";
    var exports = {};
    if (Batata_1 && !Batata_1.default)
        Batata_1.default = Batata_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    var Oi = /** @class */ (function () {
        function Oi() {
        }
        Oi.prototype.oi = function (aaa) {
            console.log('oi');
        };
        return Oi;
    }());
    exports.Oi = Oi;
    var oi = new Oi();
    oi.oi(1);
    var bat = new Batata_1.default();
    bat;
    return exports.default || exports;
});
