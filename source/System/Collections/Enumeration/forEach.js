/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../../Disposable/Utility', './Enumerator'], function (require, exports, DU, Enumerator) {
    var using = DU.using;
    function forEach(enumerable, action) {
        if (enumerable) {
            using(Enumerator.from(enumerable), function (e) {
                Enumerator.forEach(e, action);
            });
        }
    }
    return forEach;
});
//# sourceMappingURL=forEach.js.map