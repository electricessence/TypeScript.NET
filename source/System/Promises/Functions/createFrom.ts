/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {ArgumentNullException} from "../../Exceptions/ArgumentNullException";
import {Then} from "../PromiseTypes";
import PromiseBase from "../PromiseBase";
import PromiseWrapper from "../PromiseWrapper";

/**
 * A function that acts like a 'then' method (aka then-able) can be extended by providing a function that takes an onFulfill and onReject.
 * @param then
 * @returns {PromiseWrapper}
 */
export default function createFrom<T>(then:Then<T, any>):PromiseWrapper<T>
{
	if(!then) throw new ArgumentNullException("then");
	return new PromiseWrapper<T>({then: then});
}