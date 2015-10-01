/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","./ArrayEnumerator","./IndexEnumerator"],function(e,r,n,t,o){"use strict";var u;return function(e){function r(e){if(!e)return f;if(e instanceof Array)return new t(e);if(typeof e===n.Object){if("length"in e){var r=e;return new o(function(){return{source:r,length:r.length,pointer:0,step:1}})}if("getEnumerator"in e)return e.getEnumerator()}throw new Error("Unknown enumerable.")}function u(e,r){if(e)for(var n=0;e.moveNext()&&r(e.current,n++)!==!1;);}var i=function(){function e(){}return Object.defineProperty(e.prototype,"current",{get:function(){return void 0},enumerable:!0,configurable:!0}),e.prototype.moveNext=function(){return!1},e.prototype.reset=function(){},e.prototype.dispose=function(){},e}(),f=new i;e.from=r,e.forEach=u}(u||(u={})),u});
//# sourceMappingURL=Enumerator.js.map
