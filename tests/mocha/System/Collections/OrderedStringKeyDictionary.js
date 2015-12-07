(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './ICollection', '../../../../source/System/Collections/Dictionaries/OrderedStringKeyDictionary'], function (require, exports) {
    /// <reference path="../../../../source/System/Collections/Dictionaries/IDictionary.d.ts"/>
    var ICollectionTests = require('./ICollection');
    var OrderedStringKeyDictionary_1 = require('../../../../source/System/Collections/Dictionaries/OrderedStringKeyDictionary');
    ICollectionTests.Collection('OrderedStringKeyDictionary<number>', new OrderedStringKeyDictionary_1.default(), [
        { key: 'A', value: 1 },
        { key: 'B', value: 2 },
        { key: 'C', value: 3 },
        { key: 'D', value: 4 },
        { key: 'E', value: 5 },
        { key: 'F', value: 6 }
    ]);
});

//# sourceMappingURL=OrderedStringKeyDictionary.js.map
