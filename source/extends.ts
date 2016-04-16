/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

export default function (d:any, b:any):void {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	//noinspection CommaExpressionJS
	d.prototype = b === null
		? Object.create(b)
		: (__.prototype = b.prototype, new (<any>__)());
}