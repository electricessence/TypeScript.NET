/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
"use strict";
var ObservableNodeBase_1 = require("../../../../dist/commonjs/System/Observable/ObservableNodeBase");
var assert = require("assert");
it("should receive signals only when subscribed", function () {
    var ERR = "err";
    var o = new ObservableNodeBase_1.default();
    var completed = false;
    var count = 0;
    var s1 = o.subscribe(function (v) {
        assert.equal(completed, false);
        assert.equal(v, 1);
    }, function (err) {
        assert.equal(completed, false);
        assert.equal(err, ERR);
    });
    var s2 = o.subscribe({
        onNext: function (v) {
            assert.equal(completed, false);
            assert.equal(v, count);
        },
        onCompleted: function () {
            completed = true;
        }
    });
    o.onNext(++count);
    o.onError(ERR);
    s1.dispose();
    assert.equal(completed, false);
    o.onCompleted();
    assert.equal(completed, true);
    o.onNext(++count);
    o.onError(ERR);
    o.dispose();
    assert.throws(function () {
        o.subscribe(function () {
            assert.ok(false);
        });
    });
    assert.doesNotThrow(function () {
        o.onNext(0);
    });
});
//# sourceMappingURL=ObservableNodeBase.js.map