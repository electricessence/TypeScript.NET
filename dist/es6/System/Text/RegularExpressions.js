// noinspection JSUnusedLocalSymbols
const EMPTY = "";
const _I = 'i', _G = 'g', _M = 'm', _U = 'u', _W = 'w', _Y = 'y';
/**
 * https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regexoptions%28v=vs.110%29.aspx
 */
export var RegexOptions;
(function (RegexOptions) {
    /**
     * Specifies case-insensitive matching. For more information, see the "Case-Insensitive Matching " section in the Regular Expression Options topic.
     */
    RegexOptions.IGNORE_CASE = _I;
    RegexOptions.I = _I;
    /**
     * Specifies global matching instead of single.
     */
    RegexOptions.GLOBAL = _G;
    RegexOptions.G = _G;
    /**
     * treat beginning and end characters (^ and $) as working over multiple lines (i.e., match the beginning or end of each line (delimited by \n or \r), not only the very beginning or end of the whole input string)
     */
    RegexOptions.MULTI_LINE = _M;
    RegexOptions.M = _M;
    /**
     * treat pattern as a sequence of unicode code points
     */
    RegexOptions.UNICODE = _U;
    RegexOptions.U = _U;
    /**
     * matches only from the index indicated by the lastIndex property of this regular expression in the target string (and does not attempt to match from any later indexes).
     */
    RegexOptions.STICKY = _Y;
    RegexOptions.Y = _Y;
    /**
     * Modifies the pattern to ignore standard whitespace characters.
     */
    RegexOptions.IGNORE_PATTERN_WHITESPACE = _W;
    RegexOptions.W = _W;
})(RegexOptions || (RegexOptions = {}));
export class Regex {
    constructor(pattern, options, ...extra) {
        if (!pattern)
            throw new Error("'pattern' cannot be null or empty.");
        let patternString, flags = (options && ((options) instanceof (Array) ? options : [options]).concat(extra) || extra)
            .join(EMPTY)
            .toLowerCase();
        if (pattern instanceof RegExp) {
            let p = pattern;
            if (p.ignoreCase && flags.indexOf(_I) === -1)
                flags += _I;
            if (p.multiline && flags.indexOf(_M) === -1)
                flags += _M;
            patternString = p.source;
        }
        else {
            patternString = pattern;
        }
        const ignoreWhiteSpace = flags.indexOf(_W) != -1;
        // For the majority of expected behavior, we need to eliminate global and whitespace ignore.
        flags = flags.replace(/[gw]/g, EMPTY);
        // find the keys inside the pattern, and place in mapping array {0:'key1', 1:'key2', ...}
        const keys = [];
        {
            let k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
            if (k) {
                for (let i = 0, len = k.length; i < len; i++) {
                    keys[i + 1] = k[i];
                }
                // remove keys from regexp leaving standard regexp
                patternString = patternString.replace(/\?<\w+>/g, EMPTY);
                this._keys = keys;
            }
            if (ignoreWhiteSpace)
                patternString = patternString.replace(/\s+/g, "\\s*");
            this._re = new RegExp(patternString, flags);
        }
        Object.freeze(this);
    }
    match(input, startIndex = 0) {
        const _ = this;
        let r;
        if (!input
            || startIndex >= input.length
            || !(r = this._re.exec(input.substring(startIndex))))
            return Match.Empty;
        if (!(startIndex > 0))
            startIndex = 0;
        const first = startIndex + r.index;
        let loc = first;
        const groups = [], groupMap = {};
        for (let i = 0, len = r.length; i < len; ++i) {
            let text = r[i];
            let g = EmptyGroup;
            if (text != null) {
                // Empty string might mean \b match or similar.
                g = new Group(text, loc);
                g.freeze();
            }
            if (i && _._keys && i < _._keys.length)
                groupMap[_._keys[i]] = g;
            groups.push(g);
            if (i !== 0)
                loc += text.length;
        }
        const m = new Match(r[0], first, groups, groupMap);
        m.freeze();
        return m;
    }
    matches(input) {
        const matches = [];
        let m, p = 0;
        const end = input && input.length || 0;
        while (p < end && (m = this.match(input, p)) && m.success) {
            matches.push(m);
            p = m.index + m.length;
        }
        Object.freeze(matches);
        return matches;
    }
    replace(input, r, count = Infinity) {
        if (!input || r == null || !(count > 0))
            return input;
        const result = [];
        let p = 0;
        const end = input.length, isEvaluator = typeof r == "function";
        let m, i = 0;
        while (i < count && p < end && (m = this.match(input, p)) && m.success) {
            let { index, length } = m;
            if (p !== index)
                result.push(input.substring(p, index));
            result.push(isEvaluator ? r(m, i++) : r);
            p = index + length;
        }
        if (p < end)
            result.push(input.substring(p));
        return result.join(EMPTY);
    }
    isMatch(input) {
        return this._re.test(input);
    }
    static isMatch(input, pattern, options) {
        const r = new Regex(pattern, options);
        return r.isMatch(input);
    }
    static replace(input, pattern, e, options) {
        const r = new Regex(pattern, options);
        return r.replace(input, e);
    }
}
export class Capture {
    constructor(value = EMPTY, index = -1) {
        this.value = value;
        this.index = index;
    }
    get length() {
        const v = this.value;
        return v && v.length || 0;
    }
    freeze() {
        Object.freeze(this);
    }
}
export class Group extends Capture {
    get success() {
        return this.index != -1;
    }
    constructor(value = EMPTY, index = -1) {
        super(value, index);
    }
    static get Empty() {
        return EmptyGroup;
    }
}
const EmptyGroup = new Group();
EmptyGroup.freeze();
export class Match extends Group {
    constructor(value = EMPTY, index = -1, groups = [], namedGroups = {}) {
        super(value, index);
        this.groups = groups;
        this.namedGroups = namedGroups;
    }
    freeze() {
        if (!this.groups)
            throw new Error("'groups' cannot be null.");
        if (!this.namedGroups)
            throw new Error("'groupMap' cannot be null.");
        Object.freeze(this.groups);
        Object.freeze(this.namedGroups);
        super.freeze();
    }
    static get Empty() {
        return EmptyMatch;
    }
}
const EmptyMatch = new Match();
EmptyMatch.freeze();
export default Regex;
//# sourceMappingURL=RegularExpressions.js.map