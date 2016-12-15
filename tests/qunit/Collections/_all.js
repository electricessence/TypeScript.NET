(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./LinkedList", "./Queue", "./OrderedStringKeyDictionary", "../../../dist/amd/System.Linq/Linq", "../../../dist/amd/System/Collections/Set"], function (require, exports) {
    "use strict";
    var LinkedList_1 = require("./LinkedList");
    var Queue_1 = require("./Queue");
    var OrderedStringKeyDictionary_1 = require("./OrderedStringKeyDictionary");
    var Linq_1 = require("../../../dist/amd/System.Linq/Linq");
    var Set_1 = require("../../../dist/amd/System/Collections/Set");
    function run() {
        LinkedList_1.default();
        Queue_1.default();
        OrderedStringKeyDictionary_1.default();
        var s = new Set_1.Set([1, 2, 3]);
        Linq_1.Enumerable([1, 2, 3]);
        if (s.linq.any(function (v) { return v == 1; }))
            console.log(".linq preload working");
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=_all.js.map