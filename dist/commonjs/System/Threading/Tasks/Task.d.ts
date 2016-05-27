/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TaskHandlerBase } from "./TaskHandlerBase";
import { Func } from "../../FunctionTypes";
import { ITaskState } from "./ITaskState";
export declare class Task<T> extends TaskHandlerBase {
    private _result;
    constructor(valueFactory: Func<T>);
    protected _onExecute(): void;
    protected getResult(): T;
    protected getState(): ITaskState<T>;
    start(defer?: number): void;
    runSynchronously(): void;
    state: ITaskState<T>;
    result: T;
    error: any;
    protected _onDispose(): void;
}
export default Task;
