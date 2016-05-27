/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TaskHandlerBase } from "./TaskHandlerBase";
import { Closure } from "../../FunctionTypes";
export declare class TaskHandler extends TaskHandlerBase {
    private _action;
    constructor(_action: Closure);
    protected _onExecute(): void;
    protected _onDispose(): void;
}
export default TaskHandler;
