/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export default function defer(task:Function, delay?:number):()=>boolean
{
	// Note: NaN will always evaluate false.
	if(!(delay>=0)) delay = 0;

	var timeout:number = 0;

	var cancel = ()=>
	{
		if(timeout)
		{
			clearTimeout(timeout);
			timeout = 0;
			return true;
		}
		return false;
	};

	timeout = setTimeout(()=>
	{
		cancel();
		task();
	}, delay);

	return cancel;

}