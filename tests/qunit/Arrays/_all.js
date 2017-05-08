(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "QUnit", "./Utility", "./Procedure", "./Compare"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<reference types="qunit"/>
    ///<amd-dependency path="QUnit"/>
    var Utility_1 = require("./Utility");
    var Procedure_1 = require("./Procedure");
    var Compare_1 = require("./Compare");
    function run() {
        Utility_1.default();
        Procedure_1.default();
        Compare_1.default();
    }
    exports.default = run;
});
//# sourceMappingURL=_all.js.map