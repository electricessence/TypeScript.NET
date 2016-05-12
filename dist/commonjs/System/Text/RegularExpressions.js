/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EMPTY = "";
var UNDEFINED = "undefined";
var RegexOptions;
(function (RegexOptions) {
    RegexOptions.IGNORE_CASE = 'i';
    RegexOptions.GLOBAL = 'g';
    RegexOptions.MULTI_LINE = 'm';
    RegexOptions.UNICODE = 'u';
    RegexOptions.STICKY = 'y';
})(RegexOptions = exports.RegexOptions || (exports.RegexOptions = {}));

var Regex = function () {
    function Regex(pattern, options) {
        _classCallCheck(this, Regex);

        if (!pattern) throw new Error("'pattern' cannot be null or empty.");
        var patternString,
            flags = options && options.join(EMPTY) || EMPTY;
        if (pattern instanceof RegExp) {
            var p = pattern;
            if (p.ignoreCase && flags.indexOf(RegexOptions.IGNORE_CASE) === -1) flags += RegexOptions.IGNORE_CASE;
            if (p.multiline && flags.indexOf(RegexOptions.MULTI_LINE) === -1) flags += RegexOptions.MULTI_LINE;
            patternString = p.source;
        } else {
            patternString = pattern;
        }
        flags = flags.replace(RegexOptions.GLOBAL, EMPTY);
        var keys = [];
        {
            var k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
            if (k) {
                for (var i = 0, len = k.length; i < len; i++) {
                    keys[i + 1] = k[i];
                }
                this._keys = keys;
                this._re = new RegExp(patternString.replace(/\?<\w+>/g, EMPTY), flags);
            } else {
                this._keys = null;
                this._re = new RegExp(patternString, flags);
            }
        }
        Object.freeze(this);
    }

    _createClass(Regex, [{
        key: "match",
        value: function match(input) {
            var _ = this;
            var r = this._re.exec(input);
            if (!r) return Match.Empty;
            var loc = r.index,
                groups = [],
                groupMap = {};
            for (var i = 0, len = r.length; i < len; ++i) {
                var text = _typeof(r[i]) !== UNDEFINED && r[i].constructor === String ? r[i] : EMPTY;
                var g = new Group(text, loc);
                g.freeze();
                if (i && _._keys && i < _._keys.length) groupMap[_._keys[i]] = g;
                groups.push(g);
                if (i !== 0) loc += text.length;
            }
            var m = new Match(r[0], r.index, groups, groupMap);
            m.freeze();
            return m;
        }
    }, {
        key: "matches",
        value: function matches(input) {
            var matches = [],
                m;
            while ((m = this.match(input)) && m.success) {
                matches.push(m);
                input = input.substring(m.index + m.length);
            }
            return matches;
        }
    }, {
        key: "replace",
        value: function replace(input, r) {
            return input.replace(this._re, r);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Regex;
//# sourceMappingURL=RegularExpressions.js.map
