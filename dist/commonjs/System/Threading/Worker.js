/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
"use strict";
var Environment_1 = require("../Environment");
exports.Worker = Environment_1.isNodeJS ? require('./NodeJSWorker').default : self.Worker;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.Worker;
//# sourceMappingURL=Worker.js.map