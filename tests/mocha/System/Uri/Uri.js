///<reference path="../../import.d.ts"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var assert = require('../../../../node_modules/assert/assert');
    describe('es6 > babel > commonjs', function () {
        var Uri = require('../../../../dist/commonjs/System/Uri/Uri');
        var path = '/one/two/three.html';
        var query = '?four=five&' + 'six=seven';
        var u = Uri.from(path + query);
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
    });
});

//# sourceMappingURL=Uri.js.map
