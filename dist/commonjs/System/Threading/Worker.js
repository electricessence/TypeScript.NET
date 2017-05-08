"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = require("../Environment");
exports.Worker = Environment_1.isNodeJS ? require('./NodeJSWorker').default : self.Worker;
exports.default = exports.Worker;
//# sourceMappingURL=Worker.js.map