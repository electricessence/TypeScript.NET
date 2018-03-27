/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import stp, {StreamToPromise} from "stream-to-promise-agnostic";
import create from "../source/Promises/Functions/create";

const streamToPromise:StreamToPromise = stp(create);
export default streamToPromise;