/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import Promise from "../Promise";
/**
 * Syntactic shortcut for avoiding 'new'.
 * @param resolver
 * @param forceSynchronous
 * @returns {Promise}
 */
export default function using(resolver, forceSynchronous) {
    if (forceSynchronous === void 0) { forceSynchronous = false; }
    return new Promise(resolver, forceSynchronous);
}
//# sourceMappingURL=using.js.map