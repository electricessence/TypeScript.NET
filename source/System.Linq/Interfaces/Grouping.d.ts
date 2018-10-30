/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Keyed from "./Keyed";
import {FiniteIEnumerable} from "../../System/Collections/Enumeration/IEnumerable";

export interface Grouping<TKey,TElement> extends Keyed<TKey>, FiniteIEnumerable<TElement>
{

}

export interface GroupingConstructor<TKey,TElement>
{
	new (key:TKey, elements:TElement[]):Grouping<TKey,TElement>
}