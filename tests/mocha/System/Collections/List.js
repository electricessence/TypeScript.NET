(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ICollection", "../../../../source/System/Collections/List"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ICollectionTests = require("./ICollection");
    var List_1 = require("../../../../source/System/Collections/List");
    var CLASS_NAME = 'List';
    ICollectionTests.StringCollection(CLASS_NAME, new List_1.default());
    ICollectionTests.NumberCollection(CLASS_NAME, new List_1.default());
    ICollectionTests.InstanceCollection(CLASS_NAME, new List_1.default());
});
//# sourceMappingURL=List.js.map