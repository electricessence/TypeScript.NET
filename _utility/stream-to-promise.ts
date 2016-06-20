/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Promise} from "../source/System/Promises/Promise";
import {streamToPromise as stp} from "stream-to-promise-agnostic";

export const streamToPromise = stp(Promise.factory);
export default streamToPromise;