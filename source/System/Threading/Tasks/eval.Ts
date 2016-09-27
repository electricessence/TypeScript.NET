/*!
 * From: https://github.com/adambom/parallel.js/blob/master/lib/eval.js
 */

///<reference path="../../../../typings/node/node"/>

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