/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { TaskHandlerBase } from "./TaskHandlerBase";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
export class TaskHandler extends TaskHandlerBase {
    constructor(_action) {
        super();
        this._action = _action;
        if (!_action)
            throw new ArgumentNullException('action');
    }
    _onExecute() {
        this._action();
    }
    _onDispose() {
        super._onDispose();
        this._action = null;
    }
}
export default TaskHandler;
//# sourceMappingURL=TaskHandler.js.map