(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../../source/System/Integer'], factory);
    }
})(function (require, exports) {
    var Integer_1 = require('../../../source/System/Integer');
    var assert = require('../../../node_modules/assert/assert');
    var TEST_FLOAT = 10.915, TEST_INT = 10;
    describe('.convert(value)', function () {
        it('should convert float number to integer without rounding', function () {
            assert.equal(Integer_1.default(TEST_FLOAT), TEST_INT);
        });
    });
    describe('.is(value)', function () {
        it('should detect a number that is not an integer', function () {
            assert.equal(Integer_1.default.is(TEST_FLOAT), false);
        });
        it('should detect a number that is an integer', function () {
            assert.equal(Integer_1.default.is(TEST_INT), true);
        });
    });
    describe('.assert(value)', function () {
        it('should detect a number that is not an integer', function () {
            assert.throws(function () {
                Integer_1.default.assert(TEST_FLOAT);
            });
        });
        it('should detect a number that is an integer', function () {
            assert.equal(Integer_1.default.assert(TEST_INT), true);
        });
    });
});

//# sourceMappingURL=Integer.js.map
