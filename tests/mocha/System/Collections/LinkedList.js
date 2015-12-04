(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './ICollection', '../../../../source/System/Collections/LinkedList'], function (require, exports) {
    var ICollectionTests = require('./ICollection');
    var LinkedList_1 = require('../../../../source/System/Collections/LinkedList');
    ICollectionTests.StringCollection('LinkedList', new LinkedList_1.default());
    ICollectionTests.NumberCollection('LinkedList', new LinkedList_1.default());
    ICollectionTests.InstanceCollection('LinkedList', new LinkedList_1.default());
});
//# sourceMappingURL=LinkedList.js.map