/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {TaskHandlerBase} from "./TaskHandlerBase";
import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {Closure} from "../../FunctionTypes";

export class TaskHandler extends TaskHandlerBase
{

	constructor(private _action:Closure)
	{
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

export default TaskHandler;