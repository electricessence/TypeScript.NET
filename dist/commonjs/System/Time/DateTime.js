/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _HowMany = require('./HowMany');

var HowMany = _interopRequireWildcard(_HowMany);

var DateTime = (function () {
    function DateTime() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? new Date() : arguments[0];

        _classCallCheck(this, DateTime);

        var _ = this;
        if (value instanceof DateTime) _._value = value.jsDate;else if (value instanceof Date) _.setJsDate(value);else _._value = value == undefined ? new Date() : new Date(value);
    }

    _createClass(DateTime, [{
        key: 'setJsDate',
        value: function setJsDate(value) {
            this._value = new Date(value.getTime());
        }
    }, {
        key: 'addMilliseconds',
        value: function addMilliseconds(ms) {
            ms = ms || 0;
            return new DateTime(this._value.getTime() + ms);
        }
    }, {
        key: 'addDays',
        value: function addDays(days) {
            days = days || 0;
            return this.addMilliseconds(days * 86400000);
        }
    }, {
        key: 'add',
        value: function add(time) {
            return this.addMilliseconds(time.total.milliseconds);
        }
    }, {
        key: 'jsDate',
        get: function get() {
            return new Date(this._value.getTime());
        }
    }], [{
        key: 'now',
        value: function now() {
            return new DateTime();
        }
    }, {
        key: 'today',
        value: function today() {
            var now = new Date();
            return new DateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
        }
    }, {
        key: 'tomorrow',
        value: function tomorrow() {
            var today = DateTime.today();
            return today.addDays(1);
        }
    }, {
        key: 'daysAgo',
        value: function daysAgo(days) {
            var today = DateTime.today();
            return today.addDays(-days);
        }
    }]);

    return DateTime;
})();

exports['default'] = DateTime;

Object.freeze(DateTime);
module.exports = exports['default'];
//# sourceMappingURL=DateTime.js.map
