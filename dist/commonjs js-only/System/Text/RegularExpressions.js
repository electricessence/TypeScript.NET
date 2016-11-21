"use strict";
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var EMPTY = "";
var _I = 'i', _G = 'g', _M = 'm', _U = 'u', _W = 'w', _Y = 'y';
/**
 * https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regexoptions%28v=vs.110%29.aspx
 */
var RegexOptions;
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
})(RegexOptions = exports.RegexOptions || (exports.RegexOptions = {}));
var Regex = (function () {
    function Regex(pattern, options) {
        var extra = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            extra[_i - 2] = arguments[_i];
        }
        if (!pattern)
            throw new Error("'pattern' cannot be null or empty.");
        var patternString, flags = (options && (Array.isArray(options) ? options : [options]).concat(extra) || extra)
            .join(EMPTY)
            .toLowerCase();
        if (pattern instanceof RegExp) {
            var p = pattern;
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
        // For the majority of expected behavior, we need to eliminate global and whitespace ignore.
        flags = flags.replace(/[gw]/g, EMPTY);
        // find the keys inside the pattern, and place in mapping array {0:'key1', 1:'key2', ...}
        var keys = [];
        {
            var k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
            if (k) {
                for (var i = 0, len = k.length; i < len; i++) {
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
    Regex.prototype.match = function (input, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        var _ = this;
        var r;
        if (!input
            || startIndex >= input.length
            || !(r = this._re.exec(input.substring(startIndex))))
            return Match.Empty;
        if (!(startIndex > 0))
            startIndex = 0;
        var first = startIndex + r.index;
        var loc = first;
        var groups = [], groupMap = {};
        for (var i = 0, len = r.length; i < len; ++i) {
            var text = r[i];
            var g = EmptyGroup;
            if (text !== null || text !== void 0) {
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
        var m = new Match(r[0], first, groups, groupMap);
        m.freeze();
        return m;
    };
    Regex.prototype.matches = function (input) {
        var matches = [];
        var m, p = 0;
        var end = input && input.length || 0;
        while (p < end && (m = this.match(input, p)) && m.success) {
            matches.push(m);
            p = m.index + m.length;
        }
        Object.freeze(matches);
        return matches;
    };
    Regex.prototype.replace = function (input, r, count) {
        if (count === void 0) { count = Infinity; }
        if (!input || r === null || r === void 0 || !(count > 0))
            return input;
        var result = [];
        var p = 0;
        var end = input.length, isEvaluator = typeof r == "function";
        var m, i = 0;
        while (i < count && p < end && (m = this.match(input, p)) && m.success) {
            var index = m.index, length_1 = m.length;
            if (p !== index)
                result.push(input.substring(p, index));
            result.push(isEvaluator ? r(m, i++) : r);
            p = index + length_1;
        }
        if (p < end)
            result.push(input.substring(p));
        return result.join(EMPTY);
    };
    Regex.prototype.isMatch = function (input) {
        return this._re.test(input);
    };
    Regex.isMatch = function (input, pattern, options) {
        var r = new Regex(pattern, options);
        return r.isMatch(input);
    };
    Regex.replace = function (input, pattern, e, options) {
        var r = new Regex(pattern, options);
        return r.replace(input, e);
    };
    return Regex;
}());
exports.Regex = Regex;
var Capture = (function () {
    function Capture(value, index) {
        if (value === void 0) { value = EMPTY; }
        if (index === void 0) { index = -1; }
        this.value = value;
        this.index = index;
    }
    Object.defineProperty(Capture.prototype, "length", {
        get: function () {
            var v = this.value;
            return v && v.length || 0;
        },
        enumerable: true,
        configurable: true
    });
    Capture.prototype.freeze = function () {
        Object.freeze(this);
    };
    return Capture;
}());
exports.Capture = Capture;
var Group = (function (_super) {
    __extends(Group, _super);
    function Group(value, index) {
        if (value === void 0) { value = EMPTY; }
        if (index === void 0) { index = -1; }
        _super.call(this, value, index);
    }
    Object.defineProperty(Group.prototype, "success", {
        get: function () {
            return this.index != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Group, "Empty", {
        get: function () {
            return EmptyGroup;
        },
        enumerable: true,
        configurable: true
    });
    return Group;
}(Capture));
exports.Group = Group;
var EmptyGroup = new Group();
EmptyGroup.freeze();
var Match = (function (_super) {
    __extends(Match, _super);
    function Match(value, index, groups, namedGroups) {
        if (value === void 0) { value = EMPTY; }
        if (index === void 0) { index = -1; }
        if (groups === void 0) { groups = []; }
        if (namedGroups === void 0) { namedGroups = {}; }
        _super.call(this, value, index);
        this.groups = groups;
        this.namedGroups = namedGroups;
    }
    Match.prototype.freeze = function () {
        if (!this.groups)
            throw new Error("'groups' cannot be null.");
        if (!this.namedGroups)
            throw new Error("'groupMap' cannot be null.");
        Object.freeze(this.groups);
        Object.freeze(this.namedGroups);
        _super.prototype.freeze.call(this);
    };
    Object.defineProperty(Match, "Empty", {
        get: function () {
            return EmptyMatch;
        },
        enumerable: true,
        configurable: true
    });
    return Match;
}(Group));
exports.Match = Match;
var EmptyMatch = new Match();
EmptyMatch.freeze();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Regex;