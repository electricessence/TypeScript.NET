/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import FilterFactory from "./FilterFactory";
import CountFilter from "./CountFilter";

export default function <T>(count:number)
	:FilterFactory<T>
{
	return new FilterFactory<T>(
		()=> new CountFilter<T>(count, false, true)
	);
}