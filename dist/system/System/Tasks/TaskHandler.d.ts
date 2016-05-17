/// <reference path="../../../../source/System/FunctionTypes.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import TaskHandlerBase from "./TaskHandlerBase";
export default class TaskHandler extends TaskHandlerBase {
    private _action;
    constructor(_action: Closure);
    protected _onExecute(): void;
    protected _onDispose(): void;
}
