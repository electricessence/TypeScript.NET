/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./HowMany"],function(t,e,i){var o=function(){function t(t,e,i,o,n,r,s,d){void 0===i&&(i=1),void 0===o&&(o=0),void 0===n&&(n=0),void 0===r&&(r=0),void 0===s&&(s=0),void 0===d&&(d=0),this.year=t,this.month=e,this.day=i,this.hour=o,this.minute=n,this.second=r,this.millisecond=s,this.tick=d,Object.freeze(this)}return t.prototype.toJsDate=function(){var t=this;return new Date(t.year,t.month,t.day,t.hour,t.minute,t.second,t.millisecond+t.tick/1e4)},t.from=function(e){if("toJsDate"in e&&(e=e.toJsDate()),e instanceof Date)return new t(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds());throw Error("Invalid date type.")},t}();Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o});
//# sourceMappingURL=TimeStamp.js.map
