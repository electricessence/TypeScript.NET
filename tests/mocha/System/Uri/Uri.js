"use strict";
var assert = require("assert");
require("mocha");
var Uri_1 = require("../../../../dist/commonjs/System/Uri/Uri");
var Scheme = require("../../../../dist/commonjs/System/Uri/Scheme");
var Functions_1 = require("../../../../dist/commonjs/System/Functions");
var pathAfterRoot = 'one/two/three.html';
var path = '/' + pathAfterRoot;
var params = [['four', 'five'], ['six', 'seven']];
var query = '?' + params[0].join('=') + '&' + params[1].join('=');
var u = Uri_1.default.from(path + query);
describe('.scheme', function () {
    it('should equal', function () {
        assert.equal((new Uri_1.default(null, '', '', null, '')).scheme, null);
        assert.equal((new Uri_1.default("http", '', '', null, '')).scheme, "http");
        assert.equal((new Uri_1.default(Scheme.HTTP, '', '', null, '')).scheme, "http");
    });
    it('should throw', function () {
        assert.throws(function () { new Uri_1.default(64, '', '', null, '', null); });
    });
});
describe('.port', function () {
    it('should equal', function () {
        var d = 'x.com', port = 80;
        assert.equal((new Uri_1.default(null, '', d, 0, '')).port, 0);
        assert.equal((new Uri_1.default(null, '', d, null, '')).port, null);
        assert.equal((new Uri_1.default(null, '', d, '', '')).port, null);
        assert.equal((new Uri_1.default(null, '', d, NaN, '')).port, null);
        assert.equal((new Uri_1.default(null, '', d, port, '')).port, port);
        assert.equal((new Uri_1.default(null, '', d, (port + ''), '')).port, port);
    });
    it('should throw', function () {
        assert.throws(function () { new Uri_1.default(null, '', '', 'foo', ''); });
        assert.throws(function () { new Uri_1.default(null, '', '', {}, ''); });
        assert.throws(function () { new Uri_1.default(null, '', '', -1, ''); });
        assert.throws(function () { new Uri_1.default(null, '', '', Infinity, ''); });
    });
});
describe('.path', function () {
    it('should equal ' + path, function () {
        assert.equal(u.path, path);
        assert.equal((new Uri_1.default(null, null, null, null, pathAfterRoot)).path, pathAfterRoot);
        assert.equal(Uri_1.default.toString({
            path: pathAfterRoot,
            fragment: '#x'
        }), pathAfterRoot + "#x");
    });
    it('should allow null', function () {
        assert.equal((new Uri_1.default(null, '', '', null, '')).path, null);
        assert.equal((new Uri_1.default(Scheme.HTTP, '', '', null, '')).path, null);
        assert.equal((new Uri_1.default('http', '', '', null, '')).path, null);
    });
});
describe('.fragment', function () {
    it('should equal', function () {
        assert.equal(u.path, path);
    });
    it('should allow null', function () {
        assert.equal((new Uri_1.default(null, '', '', null, '')).path, null);
        assert.equal((new Uri_1.default(Scheme.HTTP, '', '', null, '')).path, null);
        assert.equal((new Uri_1.default('http', '', '', null, '')).path, null);
    });
});
describe('.from(uri)', function () {
    it('should be equal', function () {
        var c1 = Uri_1.default.from(u);
        assert.ok(u.equals(c1));
        var c2 = Uri_1.default.from({}, u);
        assert.ok(u.equals(c2));
    });
});
describe('.updateQuery(query)', function () {
    it('should be equal', function () {
        var c = u.updateQuery("x=y");
        assert.equal(c.queryParams["x"], "y");
    });
});
describe('.pathSegments', function () {
    it('should be equal', function () {
        assert.equal(u.pathSegments.join(''), u.path);
    });
});
describe('.getAuthority(uri)', function () {
    it('should be equal', function () {
        assert.equal(Uri_1.default.getAuthority({
            host: 'a',
            port: 80,
            userInfo: 'b',
            path: 'xxx'
        }), "//b@a:80");
        assert.equal(Uri_1.default.getAuthority({ host: 'a', port: 80, path: 'xxx' }), "//a:80");
        assert.equal(Uri_1.default.getAuthority({ host: 'a', userInfo: 'b', path: 'xxx' }), "//b@a");
        assert.equal(Uri_1.default.getAuthority({ host: 'a' }), "//a");
    });
    it('should throw', function () {
        assert.throws(function () {
            Uri_1.default.getAuthority({ userInfo: 'b' });
        });
        assert.throws(function () {
            Uri_1.default.getAuthority({ port: 80 });
        });
    });
});
describe('.copyOf(), .copyTo() & .equals()', function () {
    it('should equal the copy', function () {
        assert.ok(u.equals(Uri_1.default.copyOf(u)));
        assert.ok(u.equals(u.copyTo({})));
    });
});
describe('.parse(url)', function () {
    it('should throw', function () {
        assert.throws(function () { return Uri_1.default.parse(null, true); });
    });
});
describe('.toString(uri)', function () {
    it('should throw', function () {
        assert.throws(function () { return Uri_1.default.toString({
            scheme: "http",
            path: pathAfterRoot,
            fragment: '#x'
        }); });
    });
    it('should equal', function () {
        assert.equal(Uri_1.default.toString({
            scheme: "http",
            host: "x.com",
            path: pathAfterRoot,
            fragment: '#x',
        }), "http://x.com" + path + "#x");
    });
});
describe('.tryParse(uri)', function () {
    it('should return false if invalid', function () {
        assert.ok(!Uri_1.default.tryParse(null, Functions_1.default.Blank));
    });
    it('should parse correctly', function () {
        var fragment = "x##?y", full = "http://x.com/y/z#" + fragment;
        assert.ok(Uri_1.default.tryParse(full, function (out) {
            assert.equal(out.fragment, fragment);
            assert.equal(Uri_1.default.toString(out), full);
        }));
        assert.ok(Uri_1.default.tryParse("http://x.com/y/z?#", function (out) {
            assert.equal(out.query, undefined);
            assert.equal(out.fragment, undefined);
        }));
        assert.ok(!Uri_1.default.tryParse("hello//x.com/y/z#" + fragment, Functions_1.default.Blank));
        assert.ok(!Uri_1.default.tryParse("hello://x.com/y/z#" + fragment, Functions_1.default.Blank));
        assert.ok(Uri_1.default.tryParse(" ://x.com/y/z#" + fragment, Functions_1.default.Blank));
        assert.ok(Uri_1.default.tryParse("x.com", function (out) {
            assert.equal(out.path, undefined);
        }));
        assert.ok(Uri_1.default.tryParse("x.com/", function (out) {
            assert.equal(out.path, '/');
        }));
        assert.ok(Uri_1.default.tryParse("me@x.com/" + fragment, function (out) {
            assert.equal(out.userInfo, 'me');
        }));
        assert.ok(Uri_1.default.tryParse("@x.com/" + fragment, function (out) {
            assert.equal(out.userInfo, undefined);
        }));
        assert.ok(Uri_1.default.tryParse("@x.com:80" + fragment, function (out) {
            assert.equal(out.port, 80);
        }));
        assert.ok(!Uri_1.default.tryParse("@x.com:" + fragment, Functions_1.default.Blank));
        assert.ok(!Uri_1.default.tryParse("", function (out) {
            assert.equal(out.scheme, undefined);
            assert.equal(out.host, undefined);
            assert.equal(out.userInfo, undefined);
            assert.equal(out.port, undefined);
            assert.equal(out.path, undefined);
            assert.equal(out.query, undefined);
            assert.equal(out.fragment, undefined);
        }));
    });
});
describe('.baseUri', function () {
    it('should equal ' + path, function () {
        assert.equal(u.baseUri, path);
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
describe('KVP versus Tuple', function () {
    it('should be equal', function () {
        var uTuples = new Uri_1.default(u.scheme, u.userInfo, u.host, u.port, u.path, params);
        var uKvp = new Uri_1.default(u.scheme, u.userInfo, u.host, u.port, u.path, u.queryParams);
        assert.equal(uTuples.toString(), uKvp.toString());
    });
});
// Disabled for code coverage report
// describe('es6 > babel > commonjs', ()=>
// {
// 	const Uri2 = require('../../../../dist/commonjs/System/Uri/Uri').default;
//
// 	var u2 = Uri2.from(path + query);
//
// 	describe('.path', ()=>
// 	{
// 		it('should equal ' + path, ()=>
// 		{
// 			assert.equal(u2.path, path);
// 		});
// 	});
//
// 	describe('.query', ()=>
// 	{
// 		it('should equal ' + query, ()=>
// 		{
// 			assert.equal(u2.query, query);
// 		});
// 	});
// });
//# sourceMappingURL=Uri.js.map