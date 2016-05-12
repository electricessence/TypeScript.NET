/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ArgumentNullException from "../Exceptions/ArgumentNullException";
const EMPTY = "";
const UNDEFINED = "undefined";
const PATTERN = "pattern";
export var RegexOptions;
(function (RegexOptions) {
    RegexOptions.IGNORE_CASE = 'i';
    RegexOptions.GLOBAL = 'g';
    RegexOptions.MULTI_LINE = 'm';
    RegexOptions.UNICODE = 'u';
    RegexOptions.STICKY = 'y';
})(RegexOptions || (RegexOptions = {}));
export class Regex {
    constructor(pattern, options) {
        if (!pattern)
            throw new ArgumentNullException(PATTERN);
        var patternString, flags = options && options.join(EMPTY) || EMPTY;
        if (pattern instanceof RegExp) {
            let p = pattern;
            if (p.ignoreCase && flags.indexOf(RegexOptions.IGNORE_CASE) === -1)
                flags
                    += RegexOptions.IGNORE_CASE;
            if (p.multiline && flags.indexOf(RegexOptions.MULTI_LINE) === -1)
                flags
                    += RegexOptions.MULTI_LINE;
            patternString = p.source;
        }
        else {
            patternString = pattern;
        }
        flags = flags.replace(RegexOptions.GLOBAL, EMPTY);
        var keys = [];
        {
            let k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
            if (k) {
                for (let i = 0, len = k.length; i < len; i++) {
                    keys[i + 1] = k[i];
                }
                this._keys = keys;
                this._re = new RegExp(patternString.replace(/\?<\w+>/g, EMPTY), flags);
            }
            else {
                this._keys = null;
                this._re = new RegExp(patternString, flags);
            }
        }
        Object.freeze(this);
    }
    match(input) {
        var _ = this;
        var r = this._re.exec(input);
        if (!r)
            return Match.Empty;
        var loc = r.index, groups = [], groupMap = {};
        for (let i = 0, len = r.length; i < len; ++i) {
            let text = typeof r[i] !== UNDEFINED && r[i].constructor === String ? r[i] : EMPTY;
            let g = new Group(text, loc);
            g.freeze();
            if (i && _._keys && i < _._keys.length)
                groupMap[_._keys[i]] = g;
            groups.push(g);
            if (i !== 0)
                loc += text.length;
        }
        var m = new Match(r[0], r.index, groups, groupMap);
        m.freeze();
        return m;
    }
    matches(input) {
        var matches = [], m;
        while ((m = this.match(input)) && m.success) {
            matches.push(m);
            input = input.substring(m.index + m.length);
        }
        return matches;
    }
    replace(input, r) {
        return input.replace(this._re, r);
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
export class Match extends Group {
    constructor(value = EMPTY, index = -1, groups = [], namedGroups = {}) {
        super(value, index);
        this.groups = groups;
        this.namedGroups = namedGroups;
    }
    freeze() {
        if (!this.groups)
            throw new ArgumentNullException('groups');
        if (!this.namedGroups)
            throw new ArgumentNullException('groupMap');
        Object.freeze(this.groups.slice());
        Object.freeze(this.namedGroups);
        super.freeze();
    }
    static get Empty() {
        return EmptyMatch;
    }
}
const EmptyMatch = new Match();
export default Regex;
//# sourceMappingURL=RegularExpressions.js.map