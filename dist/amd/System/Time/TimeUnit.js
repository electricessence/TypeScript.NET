/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(e,s){var n;!function(e){e[e.Ticks=0]="Ticks",e[e.Milliseconds=1]="Milliseconds",e[e.Seconds=2]="Seconds",e[e.Minutes=3]="Minutes",e[e.Hours=4]="Hours",e[e.Days=5]="Days"}(n||(n={}));var n;!function(e){function s(s,n){switch(void 0===n&&(n=e.Milliseconds),n){case e.Days:s*=24;case e.Hours:s*=60;case e.Minutes:s*=60;case e.Seconds:s*=1e3;case e.Milliseconds:return s;case e.Ticks:return s/1e4;default:throw new Error("Invalid TimeUnit.")}}function n(s,n){switch(n){case e.Days:return s/864e5;case e.Hours:return s/36e5;case e.Minutes:return s/6e4;case e.Seconds:return s/1e3;case e.Milliseconds:return s;case e.Ticks:return 1e4*s;default:throw new Error("Invalid TimeUnit.")}}function i(e,s){return e&&n(e.getTotalMilliseconds(),s)}function r(s){if(isNaN(s)||s>e.Days||s<e.Ticks||Math.floor(s)!==s)throw new Error("Invalid TimeUnit.");return!0}e.toMilliseconds=s,e.fromMilliseconds=n,e.from=i,e.assertValid=r}(n||(n={})),Object.freeze(n),Object.defineProperty(s,"__esModule",{value:!0}),s["default"]=n});
//# sourceMappingURL=TimeUnit.js.map
