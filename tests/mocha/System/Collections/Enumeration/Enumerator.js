(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../../../../source/System/Types', '../../../../../source/System/Collections/Queue', '../../../../../source/System/Collections/Enumeration/Enumerator'], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require('../../../../../source/System/Types');
    var Queue_1 = require('../../../../../source/System/Collections/Queue');
    var Enumerator = require('../../../../../source/System/Collections/Enumeration/Enumerator');
    var assert = require('../../../../../node_modules/assert/assert');
    it(".from(IEnumerable)", function () {
        var a = [0, 1, 2, 3, 4];
        var len = a.length, count = 0;
        var q = new Queue_1.default(a);
        var type = new Types_1.TypeInfo(q);
        type.member("getEnumerator");
        var test = Enumerator.from(q);
        while (test.moveNext()) {
            count++;
        }
        assert.equal(count, len);
    });
    it(".from(Array)", function () {
        var a = [0, 1, 2, 3, 4];
        var type = new Types_1.TypeInfo(a);
        type.member("length");
        var len = a.length, count = 0;
        var test = Enumerator.from({ getEnumerator: function () { return Enumerator.from(a); } });
        while (test.moveNext()) {
            count++;
        }
        assert.equal(count, len);
    });
    it(".from(IArray)", function () {
        var a = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, length: 5 };
        var type = new Types_1.TypeInfo(a);
        type.member("length");
        var len = a.length, count = 0;
        var test = Enumerator.from(a);
        while (test.moveNext()) {
            count++;
        }
        assert.equal(count, len);
    });
});

//# sourceMappingURL=Enumerator.js.map
