/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import escapeRegExp from "./escapeRegExp";
var EMPTY = '';
/**
 * Can trimEntries any character or set of characters from the ends of a string.
 * Uses a Regex escapement to replace them with empty.
 * @param source
 * @param chars A string or array of characters desired to be trimmed.
 * @param ignoreCase
 * @returns {string}
 */
export default function trim(source, chars, ignoreCase) {
    if (chars === EMPTY)
        return source;
    if (chars instanceof Array)
        return trim(source, chars.join(EMPTY), ignoreCase);
    if (!chars)
        return source.replace(/^\s+|\s+$/g, EMPTY);
    var escaped = escapeRegExp(chars);
    return source.replace(new RegExp("^[" + escaped + "]+|[" + escaped + "]+$", "g" + (ignoreCase ? 'i' : EMPTY)), EMPTY);
}
//# sourceMappingURL=trim.js.map