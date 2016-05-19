/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(e,i){"use strict";!function(e){e[e.Ticks=0]="Ticks",e[e.Milliseconds=1]="Milliseconds",e[e.Seconds=2]="Seconds",e[e.Minutes=3]="Minutes",e[e.Hours=4]="Hours",e[e.Days=5]="Days"}(i.TimeUnit||(i.TimeUnit={}));var s,s=i.TimeUnit;!function(e){function i(i,s){switch(void 0===s&&(s=e.Milliseconds),s){case e.Days:i*=24;case e.Hours:i*=60;case e.Minutes:i*=60;case e.Seconds:i*=1e3;case e.Milliseconds:return i;case e.Ticks:return i/1e4;default:throw new Error("Invalid TimeUnit.")}}function s(i,s){switch(s){case e.Days:return i/864e5;case e.Hours:return i/36e5;case e.Minutes:return i/6e4;case e.Seconds:return i/1e3;case e.Milliseconds:return i;case e.Ticks:return 1e4*i;default:throw new Error("Invalid TimeUnit.")}}function n(e,i){return e&&s(e.getTotalMilliseconds(),i)}function r(i){if(isNaN(i)||i>e.Days||i<e.Ticks||Math.floor(i)!==i)throw new Error("Invalid TimeUnit.");return!0}e.toMilliseconds=i,e.fromMilliseconds=s,e.from=n,e.assertValid=r}(s=i.TimeUnit||(i.TimeUnit={})),Object.freeze(s),Object.defineProperty(i,"__esModule",{value:!0}),i["default"]=s});
//# sourceMappingURL=TimeUnit.js.map
