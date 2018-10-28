/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {FiniteIEnumerable} from "./IEnumerable";
import {FiniteIEnumerator} from "./IEnumerator";
import EmptyEnumerator from "./EmptyEnumerator";

export default class EmptyEnumerable
	implements FiniteIEnumerable<any>
{

	constructor()
	{
		this.isEndless = false;
	}

	getEnumerator():FiniteIEnumerator<any>
	{
		return EmptyEnumerator;
	}

	/**
	 * Provides a way of flagging endless enumerations that may cause issues.
	 */
	readonly isEndless:false;
}
