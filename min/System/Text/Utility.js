/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types"],function(e,r,n){function t(e){for(var r=[],n=1;n<arguments.length;n++)r[n-1]=arguments[n];for(var t=0;t<r.length;t++)e=e.replace("{"+t+"}",r[t]);return e}function u(e,r){return e.replace(/\{([^{}]*)\}/g,function(e,t){var u=r[t];switch(typeof u){case n.STRING:return!0;case n.NUMBER:return u;default:return e}})}r.format=t,r.supplant=u});
//# sourceMappingURL=Utility.js.map
