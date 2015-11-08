/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.encode = encode;
exports.encodeValue = encodeValue;
exports.parse = parse;
exports.parseToMap = parseToMap;
exports.parseToArray = parseToArray;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var _SerializationUtility = require('../Serialization/Utility');

var Serialization = _interopRequireWildcard(_SerializationUtility);

var ENTRY_SEPARATOR = "&",
    KEY_VALUE_SEPARATOR = "=";

function encode(values, prefixIfNotEmpty) {
    if (!values) return '';
    var entries = [];
    if (Array.isArray(values)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var kvp = _step.value;

                if (kvp) entries.push(kvp.key + KEY_VALUE_SEPARATOR + encodeValue(kvp.value));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    } else {
        var keys = Object.keys(values);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var k = _step2.value;

                entries.push(k + KEY_VALUE_SEPARATOR + encodeValue(values[k]));
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                    _iterator2['return']();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }
    return (entries.length && prefixIfNotEmpty ? '?' : '') + entries.join(ENTRY_SEPARATOR);
}

function encodeValue(value) {
    var v = value;
    if (typeof v == _Types2['default'].OBJECT && "toUriComponent" in v) {
        v = v.toUriComponent();
        if (v && v.indexOf('&') != 1) throw '.toUriComponent() did not encode the value.';
    } else {
        v = encodeURIComponent(Serialization.toString(v));
    }
    return v;
}

function parse(query, entryHandler) {
    var deserialize = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
    var decodeValues = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    if (query && (query = query.replace(/^\s*\?+/, ''))) {
        var entries = query.split(ENTRY_SEPARATOR);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = entries[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var entry = _step3.value;

                var si = entry.indexOf(KEY_VALUE_SEPARATOR);
                if (si != -1) {
                    var key = entry.substring(0, si);
                    var value = entry.substring(si + 1);
                    if (decodeValues) value = decodeURIComponent(value);
                    if (deserialize) value = Serialization.toPrimitive(value);
                    entryHandler(key, value);
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                    _iterator3['return']();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    }
}

function parseToMap(query) {
    var deserialize = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    var decodeValues = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var result = {};
    parse(query, function (key, value) {
        if (key in result) {
            var prev = result[key];
            if (!Array.isArray(prev)) result[key] = prev = [prev];
            prev.push(value);
        } else result[key] = value;
    }, deserialize, decodeValues);
    return result;
}

function parseToArray(query) {
    var deserialize = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    var decodeValues = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var result = [];
    parse(query, function (key, value) {
        result.push({ key: key, value: value });
    }, deserialize, decodeValues);
    return result;
}

var Separator;
exports.Separator = Separator;
(function (Separator) {
    Separator.Entry = ENTRY_SEPARATOR;
    Separator.KeyValue = KEY_VALUE_SEPARATOR;
})(Separator || (exports.Separator = Separator = {}));
Object.freeze(Separator);
//# sourceMappingURL=QueryParams.js.map
