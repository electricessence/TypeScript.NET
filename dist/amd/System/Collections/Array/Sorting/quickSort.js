/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../../Exceptions/ArgumentNullException"],function(t,r,e){"use strict";function n(t){if(!t)throw new e.ArgumentNullException("target");var r=t.length;return t.length<2?t:i(t,0,r-1)}function i(t,r,e){if(r<e){var n,o=Math.floor((r+e)/2);n=t[o],t[o]=t[e],t[e]=n;for(var u=r,c=r;c<e;c++)t[c]<t[e]&&(n=t[u],t[u]=t[c],t[c]=n,u++);n=t[u],t[u]=t[e],t[e]=n,i(t,r,u-1),i(t,u+1,e)}return t}r.quickSort=n});
//# sourceMappingURL=quickSort.js.map