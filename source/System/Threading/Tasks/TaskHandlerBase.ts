/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {DisposableBase} from "../../Disposable/DisposableBase";
import {ICancellable} from "../ICancellable";

/**
 * A simple class for handling potentially repeated executions either deferred or immediate.
 */
export abstract class TaskHandlerBase extends DisposableBase implements ICancellable
{
	constructor()
	{
		super();
		this._timeoutId = null;
	}

	private _timeoutId:any;

	get isScheduled():boolean
	{
		return !!this._timeoutId;
	}

	/**
	 * Schedules/Reschedules triggering the task.
	 * @param defer Optional time to wait until triggering.
	 */
	start(defer?:number):void
	{
		this.cancel();
		if(!(defer>0)) defer = 0;
		if(isFinite(defer))
			this._timeoutId = setTimeout(TaskHandlerBase._handler, defer, this);
	}

	runSynchronously():void
	{
		this.cancel();
		this._onExecute();
	}

	// Use a static function here to avoid recreating a new function every time.
	private static _handler(d:TaskHandlerBase):void
	{
		d.cancel();
		d._onExecute();
	}

	protected abstract _onExecute():void;

	protected _onDispose():void
	{
		this.cancel();
	}

	cancel():boolean
	{
		var id = this._timeoutId;
		if(id)
		{
			clearTimeout(id);
			this._timeoutId = null;
			return true;
		}
		return false;
	}


}

export default TaskHandlerBase;