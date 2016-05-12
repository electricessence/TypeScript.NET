(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../source/System/Text/RegularExpressions"], factory);
    }
})(function (require, exports) {
    "use strict";
    var assert = require('../../../../node_modules/assert/assert');
    var RegularExpressions_1 = require("../../../../source/System/Text/RegularExpressions");
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var regex = new RegularExpressions_1.default("(?<first>[A-E]+)", ["i"]);
    describe("Regex", function () {
        describe(".match(input)", function () {
            it("should match correctly", function () {
                var m = regex.match(str);
                assert.equal(m.value, "ABCDE");
                assert.equal(m.namedGroups["first"].value, "ABCDE");
            });
        });
        describe(".matches(input)", function () {
            it("should capture all instances", function () {
                var m = regex.matches(str);
                assert.equal(m.length, 2);
                assert.equal(m[0].value, "ABCDE");
                assert.equal(m[0].namedGroups["first"].value, "ABCDE");
                assert.equal(m[1].value, "abcde");
                assert.equal(m[1].namedGroups["first"].value, "abcde");
            });
        });
    });
});

//# sourceMappingURL=RegularExpressions.js.map
