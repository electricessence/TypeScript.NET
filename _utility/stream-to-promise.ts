/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {TSDNPromise} from "../source/System/Promises/Promise";
import {streamToPromise as stp} from "stream-to-promise-agnostic";

export const streamToPromise = stp(TSDNPromise.factory);
export default streamToPromise;