/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Then} from "../PromiseTypes";
import PromiseWrapper from "../PromiseWrapper";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";

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