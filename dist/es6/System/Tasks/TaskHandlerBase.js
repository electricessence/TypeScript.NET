import DisposableBase from "../Disposable/DisposableBase";
class TaskHandlerBase extends DisposableBase {
    constructor() {
        super();
        this._id = null;
    }
    get isScheduled() {
        return !!this._id;
    }
    execute(defer) {
        this.cancel();
        if (isNaN(defer) || defer < 0) {
            this._onExecute();
        }
        else if (isFinite(defer)) {
            this._id = setTimeout(TaskHandlerBase._handler, defer, this);
        }
    }
    static _handler(d) {
        d.cancel();
        d._onExecute();
    }
    _onDispose() {
        this.cancel();
    }
    cancel() {
        var id = this._id;
        if (id) {
            clearTimeout(id);
            this._id = null;
            return true;
        }
        return false;
    }
}
export default TaskHandlerBase;
//# sourceMappingURL=TaskHandlerBase.js.map