(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "QUnit", 'source/System/Integer'], factory);
    }
})(function (require, exports) {
    var Integer_1 = require('source/System/Integer');
    function run() {
        var TEST_FLOAT = 10.915, TEST_INT = 10;
        QUnit.test('Integer: convert', function (assert) {
            assert.equal(Integer_1.default(TEST_FLOAT), TEST_INT, 'Should convert float number to integer without rounding.');
        });
        QUnit.test('Integer: is', function (assert) {
            assert.equal(Integer_1.default.is(TEST_FLOAT), false, 'Should detect a number that is not an integer.');
            assert.equal(Integer_1.default.is(TEST_INT), true, 'Should detect a number that is an integer.');
        });
        QUnit.test('Integer: assert', function (assert) {
            assert.equal(Integer_1.default.assert(TEST_INT), true, 'Should detect a number that is an integer.');
            assert.throws(function () {
                Integer_1.default.assert(TEST_FLOAT);
            });
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});

//# sourceMappingURL=Integer.js.map
