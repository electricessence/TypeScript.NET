/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../../Disposable/DisposableBase";
import { ICancellable } from "../ICancellable";
import { TaskStatus } from "./TaskStatus";
export declare abstract class TaskHandlerBase extends DisposableBase implements ICancellable {
    private _status;
    constructor();
    private _timeoutId;
    isScheduled: boolean;
    start(defer?: number): void;
    runSynchronously(): void;
    protected getStatus(): TaskStatus;
    status: TaskStatus;
    private static _handler(d);
    protected abstract _onExecute(): void;
    protected _onDispose(): void;
    cancel(): boolean;
}
export default TaskHandlerBase;
