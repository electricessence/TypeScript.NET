/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export default function applyMixins(derivedConstructor, baseConstructors) {
    baseConstructors
        .forEach(bc => {
        Object.getOwnPropertyNames(bc.prototype).forEach(name => {
            derivedConstructor.prototype[name] = bc.prototype[name];
        });
    });
}
//# sourceMappingURL=applyMixins.js.map