(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ICollection", "../../../../dist/commonjs/System/Collections/Dictionaries/OrderedStringKeyDictionary"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ICollectionTests = require("./ICollection");
    var OrderedStringKeyDictionary_1 = require("../../../../dist/commonjs/System/Collections/Dictionaries/OrderedStringKeyDictionary");
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