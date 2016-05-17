/// <reference path="../../../../source/System/Tasks/ICancellable.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import DisposableBase from "../Disposable/DisposableBase";
declare abstract class TaskHandlerBase extends DisposableBase implements ICancellable {
    constructor();
    protected _id: any;
    isScheduled: boolean;
    execute(defer?: number): void;
    private static _handler(d);
    protected abstract _onExecute(): void;
    protected _onDispose(): void;
    cancel(): boolean;
}
export default TaskHandlerBase;
