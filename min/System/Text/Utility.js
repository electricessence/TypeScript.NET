/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(r,e,n){var t;return function(r){function e(r){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];for(var t=0;t<e.length;t++)r=r.replace("{"+t+"}",e[t]);return r}function t(r,e){return r.replace(/\{([^{}]*)\}/g,function(r,t){var u=e[t];switch(typeof u){case n.String:return!0;case n.Number:return u;default:return r}})}r.format=e,r.supplant=t}(t||(t={})),t});
//# sourceMappingURL=Utility.js.map
