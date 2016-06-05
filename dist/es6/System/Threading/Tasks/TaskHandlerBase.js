/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "../../Disposable/DisposableBase";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
export class TaskHandlerBase extends DisposableBase {
    constructor() {
        super();
        this._timeoutId = null;
        this._status = 0;
    }
    get isScheduled() {
        return !!this._timeoutId;
    }
    start(defer) {
        this.throwIfDisposed();
        this.cancel();
        this._status = 1;
        if (!(defer > 0))
            defer = 0;
        if (isFinite(defer))
            this._timeoutId = setTimeout(TaskHandlerBase._handler, defer, this);
    }
    runSynchronously() {
        this.throwIfDisposed();
        TaskHandlerBase._handler(this);
    }
    getStatus() {
        return this._status;
    }
    get status() {
        return this.getStatus();
    }
    static _handler(d) {
        d.cancel();
        d._status = 2;
        try {
            d._onExecute();
            d._status = 3;
        }
        catch (ex) {
            d._status = 5;
        }
    }
    _onDispose() {
        this.cancel();
        this._status = null;
    }
    cancel() {
        var id = this._timeoutId;
        if (id) {
            clearTimeout(id);
            this._timeoutId = null;
            this._status = 4;
            return true;
        }
        return false;
    }
}
export default TaskHandlerBase;
//# sourceMappingURL=TaskHandlerBase.js.map