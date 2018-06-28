/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../../Disposable/DisposableBase";
import { ICancellable } from "../ICancellable";
import { TaskStatus } from "./TaskStatus";
/**
 * A simple class for handling potentially repeated executions either deferred or immediate.
 */
export declare abstract class TaskHandlerBase extends DisposableBase implements ICancellable {
    private _status;
    protected constructor();
    private _timeoutId;
    readonly isScheduled: boolean;
    /**
     * Schedules/Reschedules triggering the task.
     * @param defer Optional time to wait until triggering.
     */
    start(defer?: number): void;
    runSynchronously(): void;
    protected getStatus(): TaskStatus;
    readonly status: TaskStatus;
    private static _handler;
    protected abstract _onExecute(): void;
    protected _onDispose(): void;
    cancel(): boolean;
}
export default TaskHandlerBase;
