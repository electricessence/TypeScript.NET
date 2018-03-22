/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import isPromise from "./isPromise";
import PromiseBase from "../PromiseBase";
import PromiseWrapper from "../PromiseWrapper";
import { Fulfilled } from "../Promise";
/**
 * Takes any Promise-Like object and ensures an extended version of it from this module.
 * @param target The Promise-Like object
 * @returns A new target that simply extends the target.
 */
export default function wrap(target) {
    if (!target)
        throw new ArgumentNullException("target");
    return isPromise(target)
        ? (target instanceof PromiseBase ? target : new PromiseWrapper(target))
        : new Fulfilled(target);
}
//# sourceMappingURL=wrap.js.map