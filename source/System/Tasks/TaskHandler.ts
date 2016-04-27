import TaskHandlerBase from "./TaskHandlerBase";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
export default class TaskHandler extends TaskHandlerBase {
	
	constructor(private _action:()=>void) {
		super();
		if(!_action) throw new ArgumentNullException('action');
	}
	
	protected _onExecute():void
	{
		this._action();
	}
	
	protected _onDispose():void
	{
		super._onDispose();
		this._action = null;
	}
}
