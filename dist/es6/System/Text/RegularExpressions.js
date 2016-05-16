/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
const EMPTY = "";
const UNDEFINED = "undefined";
const _I = 'i', _G = 'g', _M = 'm', _U = 'u', _W = 'w', _Y = 'y';
export var RegexOptions;
(function (RegexOptions) {
    RegexOptions.IGNORE_CASE = _I;
    RegexOptions.I = _I;
    RegexOptions.GLOBAL = _G;
    RegexOptions.G = _G;
    RegexOptions.MULTI_LINE = _M;
    RegexOptions.M = _M;
    RegexOptions.UNICODE = _U;
    RegexOptions.U = _U;
    RegexOptions.STICKY = _Y;
    RegexOptions.Y = _Y;
    RegexOptions.IGNORE_PATTERN_WHITESPACE = _W;
    RegexOptions.W = _W;
})(RegexOptions || (RegexOptions = {}));
export class Regex {
    constructor(pattern, options, ...extra) {
        if (!pattern)
            throw new Error("'pattern' cannot be null or empty.");
        var patternString, flags = (options && (Array.isArray(options) ? options : [options]).concat(extra) || extra)
            .join(EMPTY).toLowerCase();
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
        var ignoreWhiteSpace = flags.indexOf(_W) != -1;
        flags = flags.replace(/[gw]/g, EMPTY);
        var keys = [];
        {
            let k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
            if (k) {
                for (let i = 0, len = k.length; i < len; i++) {
                    keys[i + 1] = k[i];
                }
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
        var _ = this;
        var r;
        if (!input
            || startIndex >= input.length
            || !(r = this._re.exec(input.substring(startIndex))))
            return Match.Empty;
        if (!(startIndex > 0))
            startIndex = 0;
        var first = startIndex + r.index, loc = first, groups = [], groupMap = {};
        for (let i = 0, len = r.length; i < len; ++i) {
            let text = r[i];
            let g = EmptyGroup;
            if (text !== null || text !== void 0) {
                g = new Group(text, loc);
                g.freeze();
            }
            if (i && _._keys && i < _._keys.length)
                groupMap[_._keys[i]] = g;
            groups.push(g);
            if (i !== 0)
                loc += text.length;
        }
        var m = new Match(r[0], first, groups, groupMap);
        m.freeze();
        return m;
    }
    matches(input) {
        var matches = [], m, p = 0, end = input && input.length || 0;
        while (p < end && (m = this.match(input, p)) && m.success) {
            matches.push(m);
            p = m.index + m.length;
        }
        return Object.freeze(matches);
    }
    replace(input, r, count = Infinity) {
        if (!input || r === null || r === void 0 || !(count > 0))
            return input;
        var result = [];
        var p = 0, end = input.length, isEvaluator = typeof r == "function";
        var m, i = 0;
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
        var r = new Regex(pattern, options);
        return r.isMatch(input);
    }
    static replace(input, pattern, e, options) {
        var r = new Regex(pattern, options);
        return r.replace(input, e);
    }
}
export class Capture {
    constructor(value = EMPTY, index = -1) {
        this.value = value;
        this.index = index;
    }
    get length() {
        var v = this.value;
        return v && v.length || 0;
    }
    freeze() {
        Object.freeze(this);
    }
}
export class Group extends Capture {
    constructor(value = EMPTY, index = -1) {
        super(value, index);
    }
    get success() {
        return this.index != -1;
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
        Object.freeze(this.groups.slice());
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