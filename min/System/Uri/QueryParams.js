///<reference path="IUriComponentFormattable.d.ts"/>
///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Types","../Serialization/Utility"],function(e,n,o,r){function t(e,n){for(var o=[],r=Object.keys(e),t=0;t<r.length;t++){var a=r[t];o.push(a+p+i(e[a]))}return(o.length&&n?"?":"")+o.join(v)}function i(e){var n=e;if(typeof n==o.OBJECT&&"toUriComponent"in n){if(n=n.toUriComponent(),n&&1!=n.indexOf("&"))throw".toUriComponent() did not encode the value."}else n=encodeURIComponent(r.toString(n));return n}function a(e,n,o,t){if(void 0===o&&(o=!0),void 0===t&&(t=!0),e&&(e=e.replace(/^\s*\?+/,"")))for(var i=e.split(v),a=0;a<i.length;a++){var u=i[a],f=u.indexOf(p);if(-1!=f){var c=u.substring(0,f),d=u.substring(f+1);t&&(d=decodeURIComponent(d)),o&&(d=r.toPrimitive(d)),n(c,d)}}}function u(e,n,o){void 0===n&&(n=!0),void 0===o&&(o=!0);var r={};return a(e,function(e,n){r[e]=n},n,o),r}function f(e,n,o){void 0===n&&(n=!0),void 0===o&&(o=!0);var r=[];return a(e,function(e,n){r.push({key:e,value:n})},n,o),r}var v="&",p="=";n.encode=t,n.encodeValue=i,n.parse=a,n.parseToMap=u,n.parseToArray=f;var c;!function(e){e.Entry=v,e.KeyValue=p}(c=n.Separator||(n.Separator={})),Object.freeze(c)});
//# sourceMappingURL=QueryParams.js.map
