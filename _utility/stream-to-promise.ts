/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {streamToPromise as stp} from "stream-to-promise-agnostic";
import create from "../source/Promises/Functions/create";

export const streamToPromise = stp(create);
export default streamToPromise;