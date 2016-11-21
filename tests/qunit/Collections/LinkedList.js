(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./ICollection", "../../../dist/amd/System/Collections/LinkedList"], function (require, exports) {
    "use strict";
    var ICollectionTests = require("./ICollection");
    var LinkedList_1 = require("../../../dist/amd/System/Collections/LinkedList");
    function run() {
        ICollectionTests.StringCollection('LinkedList', new LinkedList_1.default());
        ICollectionTests.NumberCollection('LinkedList', new LinkedList_1.default());
        ICollectionTests.InstanceCollection('LinkedList', new LinkedList_1.default());
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=LinkedList.js.map
