/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Promise from "../Promise";
import {Executor} from "../PromiseTypes";

export default function create<T>(e:Executor<T>):Promise<T>
{
	return new Promise(e);
}