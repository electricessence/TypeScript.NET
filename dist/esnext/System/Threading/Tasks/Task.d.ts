/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TaskHandlerBase } from "./TaskHandlerBase";
import { Func } from "../../FunctionTypes";
import { ITaskState } from "./ITaskState";
/**
 * A simplified synchronous (but deferrable) version of Task<T>
 * Asynchronous operations should use Promise<T>.
 */
export declare class Task<T> extends TaskHandlerBase {
    private readonly _result;
    constructor(valueFactory: Func<T>);
    protected _onExecute(): void;
    protected getResult(): T;
    protected getState(): ITaskState<T>;
    start(defer?: number): void;
    runSynchronously(): void;
    readonly state: ITaskState<T>;
    readonly result: T;
    readonly error: any;
    protected _onDispose(): void;
}
export default Task;
