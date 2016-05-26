/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {TaskHandlerBase} from "./TaskHandlerBase";
import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {Func} from "../../FunctionTypes";
import {Lazy} from "../../Lazy";
import {ITaskState} from "./ITaskState";
import {TaskStatus} from "./TaskStatus";

/**
 * A simplified synchronous (but deferrable) version of Task<T>
 * Asynchronous operations should use Promise<T>.
 */
export class Task<T> extends TaskHandlerBase
{
	private _result:Lazy<T>;

	constructor(valueFactory:Func<T>)
	{
		super();
		if(!valueFactory) throw new ArgumentNullException('valueFactory');
		this._result = new Lazy(valueFactory, false);
	}

	protected _onExecute():void
	{
		this._result.getValue();
	}

	protected getResult():T
	{
		return this._result.value; // This will detect any potential recursion.
	}

	protected getState():ITaskState<T>
	{
		var r = this._result;
		return r && {
				status: this.getStatus(),
				result: r.isValueCreated ? r.value : void 0,
				error: r.error
			};
	}


	start(defer?:number):void
	{
		if(this.getStatus()==TaskStatus.Created)
		{
			super.start(defer);
		}
	}

	runSynchronously():void
	{
		if(this.getStatus()==TaskStatus.Created)
		{
			super.runSynchronously();
		}
	}

	get state():ITaskState<T>
	{
		return this.getState();
	}

	get result():T
	{
		this.throwIfDisposed();
		this.runSynchronously();
		return this.getResult();
	}

	get error():any
	{
		this.throwIfDisposed();
		return this._result.error;
	}

	protected _onDispose():void
	{
		super._onDispose();
		var r = this._result;

		if(r)
		{
			this._result = null;
			r.dispose();
		}
	}
}

export default Task;