/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export var EMPTY = '';
/**
 * Returns true if the pattern matches the beginning of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export function startsWith(source, pattern, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    return canMatchThen(source, pattern, ignoreCase, startsWithInternal);
}
/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export function endsWith(source, pattern, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    return canMatchThen(source, pattern, ignoreCase, endsWithInternal);
}
/**
 * Returns true if the pattern matches the end of the source.
 * @param source
 * @param pattern
 * @param ignoreCase
 * @returns {boolean}
 */
export function contains(source, pattern, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    return canMatchThen(source, pattern, ignoreCase, containsInternal);
}
function canMatchThen(source, pattern, ignoreCase, test) {
    if (source == null || pattern == null)
        return false; // just in case.
    source = source + EMPTY;
    pattern = pattern + EMPTY;
    if (ignoreCase) {
        source = source.toLowerCase();
        pattern = pattern.toLowerCase();
    }
    if (!source.length || !pattern.length)
        return false;
    if (source === pattern)
        return true;
    return test(source, pattern);
}
function startsWithInternal(source, pattern) {
    // Since we don't care about searching the entire string.
    var len = pattern.length;
    for (var i = 0; i < len; i++)
        if (source[i] != pattern[i])
            return false;
    return true;
}
function endsWithInternal(source, pattern) {
    // Since we don't care about searching the entire string.
    var patternLen = pattern.length;
    var sourceStart = source.length - patternLen;
    for (var i = 0; i < patternLen; i++)
        if (source[sourceStart + i] != pattern[i])
            return false;
    return true;
}
function containsInternal(source, pattern) {
    return source.indexOf(pattern) != -1;
}
//# sourceMappingURL=Text.js.map