/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Type from '../Types';
export const EMPTY = '';
export function escapeRegExp(source) {
    return source.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
export function trim(source, chars, ignoreCase) {
    if (chars) {
        if (chars === EMPTY)
            return source;
        var escaped = escapeRegExp(Array.isArray(chars) ? chars.join() : chars);
        return source.replace(new RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'g' + (ignoreCase ? 'i' : '')), EMPTY);
    }
    return source.replace(/^\s+|\s+$/g, EMPTY);
}
export function format(source, ...args) {
    return supplant(source, args);
}
export function supplant(source, params) {
    var oIsArray = Array.isArray(params);
    return source.replace(/\{([^{}]*)\}/g, (a, b) => {
        var n = b;
        if (oIsArray) {
            let i = parseInt(b);
            if (!isNaN(i))
                n = i;
        }
        var r = params[n];
        switch (typeof r) {
            case Type.STRING:
            case Type.NUMBER:
            case Type.BOOLEAN:
                return r;
            default:
                return a;
        }
    });
}
//# sourceMappingURL=Utility.js.map