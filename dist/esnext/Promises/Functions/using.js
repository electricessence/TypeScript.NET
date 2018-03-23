/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import TSDNPromise from "../Promise";
/**
 * Syntactic shortcut for avoiding 'new'.
 * @param resolver
 * @param forceSynchronous
 * @returns {TSDNPromise}
 */
export default function using(resolver, forceSynchronous) {
    if (forceSynchronous === void 0) { forceSynchronous = false; }
    return new TSDNPromise(resolver, forceSynchronous);
}
//# sourceMappingURL=using.js.map