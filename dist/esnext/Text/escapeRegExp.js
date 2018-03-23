/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
var PATTERN = /[-[\]\/{}()*+?.\\^$|]/g;
var REPLACEMENT = "\\$&";
/**
 * Escapes a RegExp sequence.
 * @param source
 * @returns {string}
 */
export default function escapeRegExp(source) {
    return source.replace(PATTERN, REPLACEMENT);
}
//# sourceMappingURL=escapeRegExp.js.map