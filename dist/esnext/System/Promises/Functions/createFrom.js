/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import PromiseWrapper from "../PromiseWrapper";
/**
 * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
 * @param then
 * @returns {PromiseWrapper}
 */
export default function createFrom(then) {
    if (!then)
        throw new ArgumentNullException("then");
    return new PromiseWrapper({ then: then });
}
//# sourceMappingURL=createFrom.js.map