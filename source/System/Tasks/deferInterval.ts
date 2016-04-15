/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export default function deferInterval(task:Function, interval:number, count:number = Infinity):ICancellableDefer
{
	// Note: NaN will always evaluate false.
	if(!(interval>=0)) interval = 0;

	var id:number = 0;

	var cancel:any = ()=>
	{
		if(id)
		{
			clearInterval(id);
			id = 0;
			return true;
		}
		return false;
	};
	cancel.dispose = cancel.cancel = cancel;

	id = setInterval(()=>
	{
		if(!(--count)) cancel();
		task();
	}, interval);

	return cancel;

}