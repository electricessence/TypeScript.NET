/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../../Disposable/Utility', './Enumerator'], function (require, exports, DU, Enumerator) {
    var Enumerable;
    (function (Enumerable) {
        function forEach(enumerable, action) {
            if (enumerable) {
                DU.using(enumerable.getEnumerator(), function (e) {
                    Enumerator.forEach(e, action);
                });
            }
        }
        Enumerable.forEach = forEach;
    })(Enumerable || (Enumerable = {}));
    return Enumerable;
});
//# sourceMappingURL=Enumerable.js.map