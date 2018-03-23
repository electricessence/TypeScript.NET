/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import TSDNPromise from "../Promise";
import { Executor } from "../PromiseTypes";
export default function create<T>(e: Executor<T>): TSDNPromise<T>;
