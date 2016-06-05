/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TaskHandlerBase } from "./TaskHandlerBase";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { Lazy } from "../../Lazy";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
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
        return this._result.value;
    }
    getState() {
        var r = this._result;
        return r && {
            status: this.getStatus(),
            result: r.isValueCreated ? r.value : void 0,
            error: r.error
        };
    }
    start(defer) {
        if (this.getStatus() == 0) {
            super.start(defer);
        }
    }
    runSynchronously() {
        if (this.getStatus() == 0) {
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
        var r = this._result;
        if (r) {
            this._result = null;
            r.dispose();
        }
    }
}
export default Task;
//# sourceMappingURL=Task.js.map