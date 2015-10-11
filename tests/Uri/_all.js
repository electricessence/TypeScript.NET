///<reference path="../../typings/qunit/qunit"/>
///<amd-dependency path="QUnit"/>
define(["require", "exports", '../../source/System/Uri/Uri', "QUnit"], function (require, exports, Uri) {
    function run() {
        var validUri = {
            scheme: 'http',
            userInfo: 'username:password',
            host: 'domain.com',
            port: 1234,
            path: '/tree/node/index.html',
            query: '?param=value',
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
        QUnit.test("Valid Uri", function (assert) {
            assert.equal(Uri.toString(validUri), validUrl, "Uri does not match source values.");
            var uri = Uri.from(validUri);
            assert.equal(uri.toString(), validUrl, "Uri does not match source values.");
            assert.equal(uri.absoluteUri, validUrl, "Uri does not match source values.");
            assert.equal(uri.pathAndQuery, uri.path + uri.query, "Uri path and query do not equal expected.");
        });
        QUnit.test("Invalid scheme", function (assert) {
            assert.throws(function () {
                Uri.from({
                    scheme: 'x y z'
                });
            });
            assert.throws(function () {
                Uri.from({
                    scheme: 'https:s'
                });
            });
        });
        QUnit.test("Invalid authority", function (assert) {
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