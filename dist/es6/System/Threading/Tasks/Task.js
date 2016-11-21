/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TaskHandlerBase } from "./TaskHandlerBase";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { Lazy } from "../../Lazy";
// noinspection JSUnusedLocalSymbols
/**
 * A simplified synchronous (but deferrable) version of Task<T>
 * Asynchronous operations should use Promise<T>.
 */
export class Task extends TaskHandlerBase {
    constructor(valueFactory) {
        super();
        if (!valueFactory)
            throw new ArgumentNullException('valueFactory');
        this._result = new Lazy(valueFactory, false);
    }
    _onExecute() {
        this._result.getValue();
    }
    getResult() {
        return this._result.value; // This will detect any potential recursion.
    }
    getState() {
        const r = this._result;
        return r && {
            status: this.getStatus(),
            result: r.isValueCreated ? r.value : void 0,
            error: r.error
        };
    }
    start(defer) {
        if (this.getStatus() == 0 /* Created */) {
            super.start(defer);
        }
    }
    runSynchronously() {
        if (this.getStatus() == 0 /* Created */) {
            super.runSynchronously();
        }
    }
    get state() {
        return this.getState();
    }
    get result() {
        this.throwIfDisposed();
        this.runSynchronously();
        return this.getResult();
    }
    get error() {
        this.throwIfDisposed();
        return this._result.error;
    }
    _onDispose() {
        super._onDispose();
        const r = this._result;
        if (r) {
            this._result = null;
            r.dispose();
        }
    }
}
export default Task;
//# sourceMappingURL=Task.js.map