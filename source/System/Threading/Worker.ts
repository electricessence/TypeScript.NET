/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {isNodeJS} from "../Environment";
import {WorkerConstructor} from "./WorkerType";

export const Worker:WorkerConstructor = isNodeJS ? (<any>require)('./NodeJSWorker').default : (<any>self).Worker;
export default Worker;