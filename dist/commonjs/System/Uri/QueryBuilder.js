/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var _QueryParams = require('./QueryParams');

var QueryParams = _interopRequireWildcard(_QueryParams);

var _CollectionsDictionariesOrderedStringKeyDictionary = require('../Collections/Dictionaries/OrderedStringKeyDictionary');

var _CollectionsDictionariesOrderedStringKeyDictionary2 = _interopRequireDefault(_CollectionsDictionariesOrderedStringKeyDictionary);

var ENTRY_SEPARATOR = "&",
    KEY_VALUE_SEPARATOR = "=";

var QueryBuilder = (function (_OrderedStringKeyDictionary) {
    _inherits(QueryBuilder, _OrderedStringKeyDictionary);

    function QueryBuilder(query) {
        var decodeValues = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        _classCallCheck(this, QueryBuilder);

        _get(Object.getPrototypeOf(QueryBuilder.prototype), 'constructor', this).call(this);
        if (_Types2['default'].isString(query)) {
            this.importFromString(query, decodeValues);
        } else {
            this.importMap(query);
        }
    }

    _createClass(QueryBuilder, [{
        key: 'importFromString',
        value: function importFromString(values) {
            var deserialize = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
            var decodeValues = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            var _ = this;
            QueryParams.parse(values, function (key, value) {
                if (_.containsKey(key)) {
                    var prev = _.getValue(key);
                    if (prev instanceof Array) prev.push(value);else _.setValue(key, [prev, value]);
                } else _.setValue(key, value);
            }, deserialize, decodeValues);
            return this;
        }
    }, {
        key: 'encode',
        value: function encode(prefixIfNotEmpty) {
            var entries = [];
            var keys = this.keys;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k = _step.value;

                    var value = this.getValue(k);
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = (value instanceof Array ? value : [value])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var v = _step2.value;

                            entries.push(k + KEY_VALUE_SEPARATOR + QueryParams.encodeValue(v));
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

            return (entries.length && prefixIfNotEmpty ? '?' : '') + entries.join(ENTRY_SEPARATOR);
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.encode();
        }
    }], [{
        key: 'init',
        value: function init(query) {
            var decodeValues = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            return new QueryBuilder(query, decodeValues);
        }
    }]);

    return QueryBuilder;
})(_CollectionsDictionariesOrderedStringKeyDictionary2['default']);

exports['default'] = QueryBuilder;
module.exports = exports['default'];
//# sourceMappingURL=QueryBuilder.js.map
