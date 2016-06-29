/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";
var r = eval('require');
exports.isCommonJS = !!(r && r.resolve);
exports.isRequireJS = !!(r && r.toUrl && r.defined);
exports.isNodeJS = typeof process == "object"
    && process.toString() === "[object process]"
    && process.nextTick != void 0;
Object.freeze(exports);
//# sourceMappingURL=Environment.js.map