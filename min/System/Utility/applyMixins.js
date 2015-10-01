/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
function applyMixins(derivedConstructor, baseConstructors) {
    baseConstructors
        .forEach(function (bc) {
        Object.getOwnPropertyNames(bc.prototype).forEach(function (name) {
            derivedConstructor.prototype[name] = bc.prototype[name];
        });
    });
}
module.exports = applyMixins;
