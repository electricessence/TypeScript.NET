/*!
 * From: https://github.com/adambom/parallel.js/blob/master/lib/eval.js
 */

declare var module:any;
declare var process:any;

const isNode = typeof module !== 'undefined' && module.exports;

if (isNode) {
	process.once('message', (code:string)=> {
		eval(JSON.parse(code).data);
	});
} else {
	self.onmessage = (code:any)=> {
		eval(code.data);
	};
}