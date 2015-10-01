/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(e,t){var n=function(){function e(t){void 0===t&&(t=new Date);var n=this;t instanceof e?n._value=t.jsDate:t instanceof Date?n.setJsDate(t):n._value=void 0==t?new Date:new Date(t)}return Object.defineProperty(e.prototype,"jsDate",{get:function(){return new Date(this._value.getTime())},enumerable:!0,configurable:!0}),e.prototype.setJsDate=function(e){this._value=new Date(e.getTime())},e.prototype.addMilliseconds=function(t){return t=t||0,new e(this._value.getTime()+t)},e.prototype.addDays=function(e){return e=e||0,this.addMilliseconds(864e5*e)},e.prototype.add=function(e){return this.addMilliseconds(e.total.milliseconds)},e.now=function(){return new e},e.today=function(){var t=new Date;return new e(new Date(t.getFullYear(),t.getMonth(),t.getDate()))},e.tomorrow=function(){var t=e.today();return t.addDays(1)},e.daysAgo=function(t){var n=e.today();return n.addDays(-t)},e}();return Object.freeze(n),n});
//# sourceMappingURL=DateTime.js.map
