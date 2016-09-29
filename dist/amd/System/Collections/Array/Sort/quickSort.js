/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../../Exceptions/ArgumentNullException"],function(t,e,r){"use strict";function i(t,e,n){if(void 0===e&&(e=0),void 0===n&&(n=t&&t.length-1),!t)throw new r.ArgumentNullException("target");if(e<n){var o,u=Math.floor((e+n)/2);o=t[u],t[u]=t[n],t[n]=o;for(var c=e,f=e;f<n;f++)t[f]<t[n]&&(o=t[c],t[c]=t[f],t[f]=o,c++);o=t[c],t[c]=t[n],t[n]=o,i(t,e,c-1),i(t,c+1,n)}return t}e.quickSort=i});
//# sourceMappingURL=quickSort.js.map