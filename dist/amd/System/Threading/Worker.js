/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
define(["require","exports","../Environment"],function(e,r,o){"use strict";r.Worker=o.isNodeJS?e("./NodeJSWorker")["default"]:self.Worker,Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=r.Worker});
//# sourceMappingURL=Worker.js.map
