import { DisposableBase } from "../../Disposable/DisposableBase";
import { ICancellable } from "../ICancellable";
import { TaskStatus } from "./TaskStatus";
export declare abstract class TaskHandlerBase extends DisposableBase implements ICancellable {
    private _status;
    constructor();
    private _timeoutId;
    readonly isScheduled: boolean;
    start(defer?: number): void;
    runSynchronously(): void;
    protected getStatus(): TaskStatus;
    readonly status: TaskStatus;
    private static _handler(d);
    protected abstract _onExecute(): void;
    protected _onDispose(): void;
    cancel(): boolean;
}
export default TaskHandlerBase;
