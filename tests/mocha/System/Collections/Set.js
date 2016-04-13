(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ICollection", "../../../../source/System/Collections/Set"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ICollectionTests = require("./ICollection");
    var Set_1 = require("../../../../source/System/Collections/Set");
    var assert = require('../../../../node_modules/assert/assert');
    ICollectionTests.Collection('Set<' + 'string>', new Set_1.default(), [
        "",
        "lorem",
        "ipsum",
        "dolem"
    ]);
    ICollectionTests.Collection('Set<' + 'number>', new Set_1.default(), [
        0,
        1,
        2,
        3,
        5,
        7,
        11,
        13
    ]);
    ICollectionTests.Collection('Set<' + 'Primitive>', new Set_1.default(), [
        0,
        1,
        2,
        3,
        5,
        7,
        11,
        13,
        "",
        "0",
        "1",
        "2",
        "3",
        "5",
        "7",
        "11",
        "13",
        true,
        false
    ]);
});
//# sourceMappingURL=Set.js.map