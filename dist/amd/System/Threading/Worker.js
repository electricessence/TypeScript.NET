/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
define(["require","exports","../Environment"],function(e,r,o){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.Worker=o.isNodeJS?e("./NodeJSWorker")["default"]:self.Worker,r["default"]=r.Worker});
//# sourceMappingURL=Worker.js.map