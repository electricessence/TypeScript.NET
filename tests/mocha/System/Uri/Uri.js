///<reference path="../../import.d.ts"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../../../../source/System/Uri/Uri'], function (require, exports) {
    var Uri_1 = require('../../../../source/System/Uri/Uri');
    var assert = require('../../../../node_modules/assert/assert');
    var path = '/one/two/three.html';
    var params = [['four', 'five'], ['six', 'seven']];
    var query = '?' + params[0].join('=') + '&' + params[1].join('=');
    var u = Uri_1.default.from(path + query);
    describe('.path', function () {
        it('should equal ' + path, function () {
            assert.equal(u.path, path);
        });
    });
    describe('.query', function () {
        it('should equal ' + query, function () {
            assert.equal(u.query, query);
        });
    });
    describe('.queryParams', function () {
        it('should equal contain correct values', function () {
            assert.equal(u.queryParams[params[0][0]], params[0][1]);
            assert.equal(u.queryParams[params[1][0]], params[1][1]);
        });
    });
    describe('es6 > babel > commonjs', function () {
        var Uri2 = require('../../../../dist/commonjs/System/Uri/Uri');
        var u2 = Uri2.from(path + query);
        describe('.path', function () {
            it('should equal ' + path, function () {
                assert.equal(u2.path, path);
            });
        });
        describe('.query', function () {
            it('should equal ' + query, function () {
                assert.equal(u2.query, query);
            });
        });
    });
});

//# sourceMappingURL=Uri.js.map
