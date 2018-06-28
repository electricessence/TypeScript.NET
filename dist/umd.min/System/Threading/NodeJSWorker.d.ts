/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/Worker.js
 */
import { WorkerLike } from "./WorkerType";
import { ObservableBase } from "../Observable/ObservableBase";
import { Action } from "../FunctionTypes";
/**
 * This class takes the place of a WebWorker
 */
export declare class NodeJSWorker extends ObservableBase<any> implements WorkerLike {
    private _process;
    onmessage: Action<{
        data: any;
    }> | null | undefined;
    onerror: Action<any> | null | undefined;
    constructor(url: string);
    protected _onNext(data: any): void;
    protected _onError(error: any): void;
    protected _onDispose(): void;
    postMessage(obj: any): void;
    terminate(): void;
}
export default NodeJSWorker;
