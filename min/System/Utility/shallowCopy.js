/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
function shallowCopy(source, target) {
    if (target === void 0) { target = {}; }
    if (target) {
        for (var k in source) {
            target[k] = source[k];
        }
    }
    return target;
}
module.exports = shallowCopy;
