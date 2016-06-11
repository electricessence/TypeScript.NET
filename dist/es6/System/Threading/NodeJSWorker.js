/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/Worker.js
 */
import { ObservableBase } from "../Observable/ObservableBase";
const ps = require("child_process");
export class NodeJSWorker extends ObservableBase {
    constructor(url) {
        super();
        var process = this._process = ps.fork(url);
        process.on('message', (msg) => this._onNext(JSON.parse(msg)));
        process.on('error', (err) => this._onError(err));
    }
    _onNext(data) {
        super._onNext(data);
        if (this.onmessage)
            this.onmessage({ data: data });
    }
    _onError(error) {
        super._onError(error);
        if (this.onerror)
            this.onerror(error);
    }
    _onDispose() {
        super._onDispose();
        this._process.removeAllListeners();
        this._process.kill();
        this._process = null;
    }
    postMessage(obj) {
        this.throwIfDisposed();
        this._process.send(JSON.stringify({ data: obj }));
    }
    terminate() {
        this.dispose();
    }
}
export default NodeJSWorker;
//# sourceMappingURL=NodeJSWorker.js.map