import DisposableBase from "../Disposable/DisposableBase";

/**
 * A simple class for handling potentially repeated executions either deferred or immediate.
 */
abstract class TaskHandlerBase
extends DisposableBase implements ICancellable
{
	constructor()
	{
		super();
		this._id = null;
	}

	protected _id:number;

	get isScheduled():boolean {
		return !!this._id;
	}

	/**
	 * Schedules/Reschedules triggering the task.
	 * If defer is omitted it is called synchronously.
	 * @param defer Optional time to wait until triggering.
	 */
	execute(defer?:number):void
	{
		this.cancel();
		if(isNaN(defer) || defer<0)
		{
			this._onExecute();
		}
		else if(isFinite(defer))
		{
			this._id = setTimeout(TaskHandlerBase._handler, defer, this);
		}
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
		var id = this._id;
		if(id)
		{
			clearTimeout(id);
			this._id = null;
			return true;
		}
		return false;
	}


}

export default TaskHandlerBase;