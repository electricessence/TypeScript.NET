/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { Rejected } from "../Promise";
/**
 * Creates a new rejected promise for the provided reason.
 * @param reason The reason the promise was rejected.
 * @returns A new rejected Promise.
 */
export default function reject(reason) {
    return new Rejected(reason);
}
//# sourceMappingURL=reject.js.map