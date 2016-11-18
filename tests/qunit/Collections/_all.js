(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./LinkedList", "./Queue", "./OrderedStringKeyDictionary"], function (require, exports) {
    "use strict";
    var LinkedList_1 = require("./LinkedList");
    var Queue_1 = require("./Queue");
    var OrderedStringKeyDictionary_1 = require("./OrderedStringKeyDictionary");
    function run() {
        LinkedList_1.default();
        Queue_1.default();
        OrderedStringKeyDictionary_1.default();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=_all.js.map