/*
import ObjectPool from "../../../../dist/commonjs/System/Disposable/ObjectPool";
import Stopwatch from "../../../../dist/commonjs/System/Diagnostics/Stopwatch";

const pool = new ObjectPool(40, ()=>new Array<any>(100));

function fake(o:any) {}
const TRIES:number = 1000;
describe("should be performant", ()=>
{
	var n1:number, n2:number;
	it((n1=Stopwatch.measure(()=>
		{
			var a:any[], b:any[];
			for(let i = 0; i<TRIES; i++)
			{
				a = new Array<any>(100);
				b = new Array<any>(100);
				fake(a);
				fake(b);
			}

		}).milliseconds) + " milliseconds using new only", ()=>
	{
		assert.ok(true);
	});

	it((n2=Stopwatch.measure(()=>
		{
			var a:any[], b:any[];
			for(let i = 0; i<TRIES; i++)
			{
				a = pool.take();
				b = pool.take();
				fake(a);
				fake(b);
				pool.add(a);
				pool.add(b);
			}
		}).milliseconds) + " milliseconds using ObjectPool", ()=>
	{
		assert.ok(true);
	});

	// if(n1<n2)
	// 	console.warn("ObjectPool is not outperforming 'new'.")

});
*/


