/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(e,s){"use strict";var i;!function(e){e[e.Ticks=0]="Ticks",e[e.Milliseconds=1]="Milliseconds",e[e.Seconds=2]="Seconds",e[e.Minutes=3]="Minutes",e[e.Hours=4]="Hours",e[e.Days=5]="Days"}(i||(i={}));var i;!function(e){function s(s,i){switch(void 0===i&&(i=e.Milliseconds),i){case e.Days:s*=24;case e.Hours:s*=60;case e.Minutes:s*=60;case e.Seconds:s*=1e3;case e.Milliseconds:return s;case e.Ticks:return s/1e4;default:throw new Error("Invalid TimeUnit.")}}function i(s,i){switch(i){case e.Days:return s/864e5;case e.Hours:return s/36e5;case e.Minutes:return s/6e4;case e.Seconds:return s/1e3;case e.Milliseconds:return s;case e.Ticks:return 1e4*s;default:throw new Error("Invalid TimeUnit.")}}function n(e,s){return e&&i(e.getTotalMilliseconds(),s)}function r(s){if(isNaN(s)||s>e.Days||s<e.Ticks||Math.floor(s)!==s)throw new Error("Invalid TimeUnit.");return!0}e.toMilliseconds=s,e.fromMilliseconds=i,e.from=n,e.assertValid=r}(i||(i={})),Object.freeze(i),Object.defineProperty(s,"__esModule",{value:!0}),s["default"]=i});
//# sourceMappingURL=TimeUnit.js.map
