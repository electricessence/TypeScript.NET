/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extends_1 = require("../../extends");
var __extends = extends_1.default;
var EMPTY = "";
var UNDEFINED = "undefined";
var _I = 'i',
    _G = 'g',
    _M = 'm',
    _U = 'u',
    _W = 'w',
    _Y = 'y';
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

var Regex = function () {
    function Regex(pattern, options) {
        _classCallCheck(this, Regex);

        if (!pattern) throw new Error("'pattern' cannot be null or empty.");

        for (var _len = arguments.length, extra = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            extra[_key - 2] = arguments[_key];
        }

        var patternString,
            flags = (options && (Array.isArray(options) ? options : [options]).concat(extra) || extra).join(EMPTY).toLowerCase();
        if (pattern instanceof RegExp) {
            var p = pattern;
            if (p.ignoreCase && flags.indexOf(_I) === -1) flags += _I;
            if (p.multiline && flags.indexOf(_M) === -1) flags += _M;
            patternString = p.source;
        } else {
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
            if (ignoreWhiteSpace) patternString = patternString.replace(/\s+/g, "\\s*");
            this._re = new RegExp(patternString, flags);
        }
        Object.freeze(this);
    }

    _createClass(Regex, [{
        key: "match",
        value: function match(input) {
            var startIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            var _ = this;
            var r;
            if (!input || startIndex >= input.length || !(r = this._re.exec(input.substring(startIndex)))) return Match.Empty;
            if (!(startIndex > 0)) startIndex = 0;
            var first = startIndex + r.index,
                loc = first,
                groups = [],
                groupMap = {};
            for (var i = 0, len = r.length; i < len; ++i) {
                var text = r[i];
                var g = EmptyGroup;
                if (text !== null || text !== void 0) {
                    g = new Group(text, loc);
                    g.freeze();
                }
                if (i && _._keys && i < _._keys.length) groupMap[_._keys[i]] = g;
                groups.push(g);
                if (i !== 0) loc += text.length;
            }
            var m = new Match(r[0], first, groups, groupMap);
            m.freeze();
            return m;
        }
    }, {
        key: "matches",
        value: function matches(input) {
            var matches = [],
                m,
                p = 0,
                end = input && input.length || 0;
            while (p < end && (m = this.match(input, p)) && m.success) {
                matches.push(m);
                p = m.index + m.length;
            }
            return Object.freeze(matches);
        }
    }, {
        key: "replace",
        value: function replace(input, r) {
            var count = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

            if (!input || r === null || r === void 0 || !(count > 0)) return input;
            var result = [];
            var p = 0,
                end = input.length,
                isEvaluator = typeof r == "function";
            var m,
                i = 0;
            while (i < count && p < end && (m = this.match(input, p)) && m.success) {
                var _m = m;
                var index = _m.index;
                var length = _m.length;

                if (p !== index) result.push(input.substring(p, index));
                result.push(isEvaluator ? r(m, i++) : r);
                p = index + length;
            }
            if (p < end) result.push(input.substring(p));
            return result.join(EMPTY);
        }
    }, {
        key: "isMatch",
        value: function isMatch(input) {
            return this._re.test(input);
        }
    }], [{
        key: "isMatch",
        value: function isMatch(input, pattern, options) {
            var r = new Regex(pattern, options);
            return r.isMatch(input);
        }
    }, {
        key: "replace",
        value: function replace(input, pattern, e, options) {
            var r = new Regex(pattern, options);
            return r.replace(input, e);
        }
    }]);

    return Regex;
}();

exports.Regex = Regex;

var Capture = function () {
    function Capture() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? EMPTY : arguments[0];
        var index = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

        _classCallCheck(this, Capture);

        this.value = value;
        this.index = index;
    }

    _createClass(Capture, [{
        key: "freeze",
        value: function freeze() {
            Object.freeze(this);
        }
    }, {
        key: "length",
        get: function get() {
            var v = this.value;
            return v && v.length || 0;
        }
    }]);

    return Capture;
}();

exports.Capture = Capture;

var Group = function (_Capture) {
    _inherits(Group, _Capture);

    function Group() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? EMPTY : arguments[0];
        var index = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

        _classCallCheck(this, Group);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this, value, index));
    }

    _createClass(Group, [{
        key: "success",
        get: function get() {
            return this.index != -1;
        }
    }], [{
        key: "Empty",
        get: function get() {
            return EmptyGroup;
        }
    }]);

    return Group;
}(Capture);

exports.Group = Group;
var EmptyGroup = new Group();
EmptyGroup.freeze();

var Match = function (_Group) {
    _inherits(Match, _Group);

    function Match() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? EMPTY : arguments[0];
        var index = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];
        var groups = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
        var namedGroups = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

        _classCallCheck(this, Match);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Match).call(this, value, index));

        _this2.groups = groups;
        _this2.namedGroups = namedGroups;
        return _this2;
    }

    _createClass(Match, [{
        key: "freeze",
        value: function freeze() {
            if (!this.groups) throw new Error("'groups' cannot be null.");
            if (!this.namedGroups) throw new Error("'groupMap' cannot be null.");
            Object.freeze(this.groups.slice());
            Object.freeze(this.namedGroups);
            _get(Object.getPrototypeOf(Match.prototype), "freeze", this).call(this);
        }
    }], [{
        key: "Empty",
        get: function get() {
            return EmptyMatch;
        }
    }]);

    return Match;
}(Group);

exports.Match = Match;
var EmptyMatch = new Match();
EmptyMatch.freeze();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Regex;
//# sourceMappingURL=RegularExpressions.js.map
