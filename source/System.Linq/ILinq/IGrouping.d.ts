/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Keyed from "./Keyed";
import {FiniteIEnumerable} from "../../System/Collections/Enumeration/IEnumerable";

export interface IGrouping<TKey,TElement> extends Keyed<TKey>, FiniteIEnumerable<TElement>
{

}

export interface GroupingConstructor<TKey,TElement>
{
	new (key:TKey, elements:TElement[]):IGrouping<TKey,TElement>
}

export default IGrouping;