/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {TaskStatus} from "./TaskStatus";

export interface ITaskState<T>
{
	status:TaskStatus;
	result?:T;
	error?:any;
}