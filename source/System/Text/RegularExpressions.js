/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var EMPTY = "";
    var UNDEFINED = "undefined";
    var _I = 'i', _G = 'g', _M = 'm', _U = 'u', _W = 'w', _Y = 'y';
    var RegexOptions;
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
                .join(EMPTY).toLowerCase();
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
            flags = flags.replace(/[gw]/g, EMPTY);
            var keys = [];
            {
                var k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
                if (k) {
                    for (var i = 0, len = k.length; i < len; i++) {
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
            var first = startIndex + r.index, loc = first, groups = [], groupMap = {};
            for (var i = 0, len = r.length; i < len; ++i) {
                var text = r[i];
                var g = EmptyGroup;
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
        };
        Regex.prototype.matches = function (input) {
            var matches = [], m, p = 0, end = input && input.length || 0;
            while (p < end && (m = this.match(input, p)) && m.success) {
                matches.push(m);
                p = m.index + m.length;
            }
            return Object.freeze(matches);
        };
        Regex.prototype.replace = function (input, r, count) {
            if (count === void 0) { count = Infinity; }
            if (!input || r === null || r === void 0 || !(count > 0))
                return input;
            var result = [];
            var p = 0, end = input.length, isEvaluator = typeof r == "function";
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
            Object.freeze(this.groups.slice());
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
});
//# sourceMappingURL=RegularExpressions.js.map