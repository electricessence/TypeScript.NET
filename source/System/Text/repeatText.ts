/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {repeatElement} from "../Collections/Array/repeatElement";
const EMPTY = '';

export default function repeatText(source:string | number, count:number):string
{
	if(isNaN(<any>source) && !source) return EMPTY;
	return repeatElement(source, count).join(EMPTY);
}