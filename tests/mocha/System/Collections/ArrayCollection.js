(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ICollection", "../../../../source/System/Collections/ArrayCollection"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ICollectionTests = require("./ICollection");
    var ArrayCollection_1 = require("../../../../source/System/Collections/ArrayCollection");
    ICollectionTests.StringCollection('ArrayCollection', new ArrayCollection_1.default());
    ICollectionTests.NumberCollection('ArrayCollection', new ArrayCollection_1.default());
    ICollectionTests.InstanceCollection('ArrayCollection', new ArrayCollection_1.default());
});
//# sourceMappingURL=ArrayCollection.js.map