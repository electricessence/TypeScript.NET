/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { isNodeJS } from "../Environment";
export const Worker = isNodeJS ? require('./NodeJSWorker').default : self.Worker;
export default Worker;
//# sourceMappingURL=Worker.js.map