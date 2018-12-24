/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

export default function<T>(defaultValue:T) : (e:T)=>T
{
	return function(e:T):T {
		return e==null ? defaultValue : e;
	}
}