///<reference path='../../typings/qunit/qunit'/>
///<amd-dependency path='QUnit'/>
define(["require", "exports", '../../source/System/Uri/Uri', "QUnit"], function (require, exports, Uri) {
    function run() {
        var validUri = {
            scheme: 'http',
            userInfo: 'username:password',
            host: 'domain.com',
            port: 1234,
            path: '/tree/node/index.html',
            query: '?param=hello%20there&flag=false&blah',
            fragment: '#home'
        };
        var validUrl = ''
            + validUri.scheme + '://'
            + validUri.userInfo + '@'
            + validUri.host
            + ':' + validUri.port
            + validUri.path
            + validUri.query
            + validUri.fragment;
        QUnit.test('Uri: parse valid', function (assert) {
            assert.equal(Uri.from(validUrl).absoluteUri, validUrl, 'Uri.from(string) should parse correctly.');
        });
        QUnit.test('Uri: parse equality', function (assert) {
            assert.equal(Uri.from(validUrl).equals(validUri), true, 'Uri.from(string) should equal derived values.');
        });
        QUnit.test('Uri: valid', function (assert) {
            assert.equal(Uri.toString(validUri), validUrl, 'Uri.toString(uri) must match source values.');
            var uri = Uri.from(validUri);
            assert.equal(uri.toString(), validUrl, 'Uri.toString() must match source values.');
            assert.equal(uri.absoluteUri, validUrl, 'Uri.absoluteUri must match source values.');
            assert.equal(uri.pathAndQuery, uri.path + uri.query, 'Uri path and query must equal expected.');
            assert.equal(uri.queryParams['param'], 'hello there', 'Uri must decode the query params correctly.');
            assert.equal(uri.queryParams['flag'], false, 'Uri must parse and deserialize the query params correctly.');
            assert.equal(uri.queryParams['blah'], undefined, 'Uri must ignore invalid query params.');
        });
        QUnit.test('Uri: invalid scheme', function (assert) {
            assert.throws(function () {
                Uri.from({
                    scheme: 'x y z'
                });
            });
            assert.throws(function () {
                Uri.from('http//');
            });
            assert.throws(function () {
                Uri.from({
                    scheme: 'https:s'
                });
            });
        });
        QUnit.test('Uri: invalid authority', function (assert) {
            assert.throws(function () {
                Uri.from({
                    userInfo: validUri.userInfo
                });
            });
            assert.throws(function () {
                Uri.from({
                    port: validUri.port
                });
            });
        });
    }
    return run;
});
//# sourceMappingURL=_all.js.map