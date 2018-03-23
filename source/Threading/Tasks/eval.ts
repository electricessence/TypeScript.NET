/*!
 * From: https://github.com/adambom/parallel.js/blob/master/lib/eval.js
 */

if(typeof module!=='undefined' && module.exports)
{
	process.once('message', (code:string)=>
	{
		eval(JSON.parse(code).data);
	});
}
else
{
	self.onmessage = (code:any)=>
	{
		eval(code.data);
	};
}