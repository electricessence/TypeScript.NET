/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Type from '../Types';
export function format(source, ...args) {
    return supplant(source, args);
}
export function supplant(source, params) {
    var oIsArray = params instanceof Array;
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