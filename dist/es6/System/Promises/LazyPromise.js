import { Promise } from "./Promise";
import { defer } from "../Threading/defer";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
const VOID0 = void 0;
export class LazyPromise extends Promise {
    constructor(_resolver) {
        super();
        this._resolver = _resolver;
        if (!_resolver)
            throw new ArgumentNullException("resolver");
        this._resolvedCalled = true;
    }
    _onDispose() {
        super._onDispose();
        this._resolver = VOID0;
    }
    _onThen() {
        const r = this._resolver;
        if (r) {
            this._resolver = VOID0;
            this._resolvedCalled = false;
            this.resolveUsing(r);
        }
    }
    thenSynchronous(onFulfilled, onRejected) {
        this._onThen();
        return super.thenSynchronous(onFulfilled, onRejected);
    }
    thenThis(onFulfilled, onRejected) {
        this._onThen();
        return super.thenThis(onFulfilled, onRejected);
    }
    delayFromNow(milliseconds = 0) {
        this.throwIfDisposed();
        if (!this._resolver || this.isSettled)
            return super.delayFromNow(milliseconds);
        let pass;
        let timedOut = false;
        let timeout = defer(() => {
            timedOut = true;
            if (pass)
                pass();
        }, milliseconds);
        return new LazyPromise((resolve, reject) => {
            pass = () => {
                this.thenThis(v => resolve(v), e => reject(e));
                timeout.dispose();
                timeout = VOID0;
                pass = VOID0;
            };
            if (timedOut)
                pass();
        });
    }
    delayAfterResolve(milliseconds = 0) {
        this.throwIfDisposed();
        if (!this._resolver || this.isSettled)
            return super.delayAfterResolve(milliseconds);
        let pass;
        let timeout;
        let finalize = () => {
            if (timeout) {
                timeout.dispose();
                timeout = VOID0;
            }
            if (pass)
                pass();
            finalize = VOID0;
        };
        {
            let detector = () => {
                if (finalize)
                    timeout = defer(finalize, milliseconds);
            };
            super.thenThis(detector, detector);
            detector = null;
        }
        return new LazyPromise((resolve, reject) => {
            if (this.isPending) {
                this.thenThis(v => defer(() => resolve(v), milliseconds), e => defer(() => reject(e), milliseconds));
                finalize();
            }
            else {
                pass = () => {
                    this.thenThis(v => resolve(v), e => reject(e));
                };
                if (!finalize)
                    pass();
            }
        });
    }
}
export default LazyPromise;
//# sourceMappingURL=LazyPromise.js.map