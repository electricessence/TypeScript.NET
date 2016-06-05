/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {DisposableBase} from "../../Disposable/DisposableBase";
import {ICancellable} from "../ICancellable";
import {TaskStatus} from "./TaskStatus";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;

/**
 * A simple class for handling potentially repeated executions either deferred or immediate.
 */
export abstract class TaskHandlerBase extends DisposableBase implements ICancellable
{
	private _status:TaskStatus;

	constructor()
	{
		super();
		this._timeoutId = null;
		this._status = TaskStatus.Created
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
		this.throwIfDisposed();

		this.cancel();
		this._status = TaskStatus.WaitingToRun;
		if(!(defer>0)) defer = 0;
		if(isFinite(defer))
			this._timeoutId = setTimeout(TaskHandlerBase._handler, defer, this);
	}

	runSynchronously():void
	{
		this.throwIfDisposed();
		TaskHandlerBase._handler(this);
	}

	protected getStatus():TaskStatus
	{
		return this._status;
	}

	get status():TaskStatus
	{
		return this.getStatus();
	}

	// Use a static function here to avoid recreating a new function every time.
	private static _handler(d:TaskHandlerBase):void
	{
		d.cancel();
		d._status = TaskStatus.Running;
		try
		{
			d._onExecute();
			d._status = TaskStatus.RanToCompletion;
		}
		catch(ex)
		{
			d._status = TaskStatus.Faulted;
		}
	}

	protected abstract _onExecute():void;

	protected _onDispose():void
	{
		this.cancel();
		this._status = null;
	}

	cancel():boolean
	{
		var id = this._timeoutId;
		if(id)
		{
			clearTimeout(id);
			this._timeoutId = null;
			this._status = TaskStatus.Cancelled;
			return true;
		}
		return false;
	}


}

export default TaskHandlerBase;