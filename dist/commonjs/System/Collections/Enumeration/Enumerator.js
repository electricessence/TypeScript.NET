/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.from = from;
exports.isEnumerable = isEnumerable;
exports.forEach = forEach;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Types = require('../../Types');

var _Types2 = _interopRequireDefault(_Types);

var _ArrayEnumerator = require('./ArrayEnumerator');

var _ArrayEnumerator2 = _interopRequireDefault(_ArrayEnumerator);

var _IndexEnumerator = require('./IndexEnumerator');

var _IndexEnumerator2 = _interopRequireDefault(_IndexEnumerator);

var EmptyEnumerator = (function () {
    function EmptyEnumerator() {
        _classCallCheck(this, EmptyEnumerator);
    }

    _createClass(EmptyEnumerator, [{
        key: 'moveNext',
        value: function moveNext() {
            return false;
        }
    }, {
        key: 'reset',
        value: function reset() {}
    }, {
        key: 'dispose',
        value: function dispose() {}
    }, {
        key: 'current',
        get: function get() {
            return undefined;
        }
    }]);

    return EmptyEnumerator;
})();

var Empty = new EmptyEnumerator();

function from(source) {
    if (!source) return Empty;
    if (Array.isArray(source)) return new _ArrayEnumerator2['default'](source);
    if (!_Types2['default'].isPrimitive(source)) {
        if (_Types2['default'].isArrayLike(source)) {
            return new _IndexEnumerator2['default'](function () {
                return {
                    source: source,
                    length: source.length,
                    pointer: 0,
                    step: 1
                };
            });
        }
        if (isEnumerable(source)) return source.getEnumerator();
    }
    throw new Error("Unknown enumerable.");
}

function isEnumerable(instance) {
    return _Types2['default'].hasMemberOfType(instance, "getEnumerator", _Types2['default'].FUNCTION);
}

function forEach(e, action) {
    if (e) {
        var index = 0;
        while (e.moveNext()) {
            if (action(e.current, index++) === false) break;
        }
    }
}
//# sourceMappingURL=Enumerator.js.map
