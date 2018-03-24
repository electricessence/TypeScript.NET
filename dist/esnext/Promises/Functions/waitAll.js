/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import Set from "../../Collections/Set";
import ArrayPromise from "../ArrayPromise";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
export default function waitAll(first) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (!first && !rest.length)
        throw new ArgumentNullException("promises");
    var promises = ((first) instanceof (Array) ? first : [first]).concat(rest); // yay a copyArray!
    if (!promises.length || promises.every(function (v) { return !v; }))
        return new ArrayPromise(function (r) { return r(promises); }, true); // it's a new empty, reuse it. :|
    // Eliminate deferred and take the parent since all .then calls happen on next cycle anyway.
    return new ArrayPromise(function (resolve, reject) {
        var len = promises.length;
        // Using a set instead of -- a number is more reliable if just in case one of the provided promises resolves twice.
        var remaining = new Set(promises.map(function (v, i) { return i; })); // get all the indexes...
        var cleanup = function () {
            reject = null;
            resolve = null;
            remaining.dispose();
            remaining = null;
        };
        var checkIfShouldResolve = function () {
            var r = resolve;
            if (r && !remaining.count) {
                cleanup();
                r(promises);
            }
        };
        var onResolved = function (i) {
            if (remaining) {
                remaining.remove(i);
                checkIfShouldResolve();
            }
        };
        var _loop_1 = function (i) {
            var p = promises[i];
            if (p)
                p.then(function (v) { return onResolved(i); }, function (e) { return onResolved(i); });
            else
                onResolved(i);
        };
        for (var i = 0; remaining && i < len; i++) {
            _loop_1(i);
        }
    });
}
//# sourceMappingURL=waitAll.js.map