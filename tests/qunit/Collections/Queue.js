(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './ICollection', 'source/System/Collections/Queue'], factory);
    }
})(function (require, exports) {
    "use strict";
    var ICollectionTests = require('./ICollection');
    var Queue_1 = require('source/System/Collections/Queue');
    function run() {
        ICollectionTests.StringCollection('Queue', new Queue_1.default());
        ICollectionTests.NumberCollection('Queue', new Queue_1.default());
        ICollectionTests.InstanceCollection('Queue', new Queue_1.default());
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});

//# sourceMappingURL=Queue.js.map
