///<reference path="../import.d.ts"/>

import {contains} from "../../../source/System/Collections/Array/Utility";
import Enumerable from "../../../source/System.Linq/Linq";
var assert = require('../../../node_modules/assert/assert');


interface TestItem
{
	a:number;
	b:number;
	c:string;
}


const source:TestItem[] = Object.freeze([
	{
		a: 1,
		b: 2,
		c: "a"
	},
	{
		a: 1,
		b: 1,
		c: "b"
	},
	{
		a: 1,
		b: 3,
		c: "c"
	},
	{
		a: 2,
		b: 2,
		c: "d"
	},
	{
		a: 2,
		b: 1,
		c: "e"
	},
	{
		a: 2,
		b: 3,
		c: "f"
	}
]);

var sourceArrayEnumerable = Enumerable.from(source),
	sourceEnumerable =  new Enumerable(()=>sourceArrayEnumerable.getEnumerator());

describe(".force()",()=>{
	assert.doesNotThrow(()=>{ sourceEnumerable.force() });
});

describe(".memoize()", ()=>
{
	it("should cache the values as it goes for reuse later", ()=>
	{
		var source = sourceArrayEnumerable;
		var A = source.memoize();

		var sum = A.sum(o=>o.a);

		assert.equal(sum, source.sum(o=>o.a), "Values must be equal after memoize pass 1.");

		sum = A.sum(o=>o.b);
		assert.equal(sum, source.sum(o=>o.b), "Values must be equal after memoize pass 2.");

	});
});

describe(".where(predicate).memoize()", ()=>
{
	it("should cache the values as it goes for reuse later", ()=>
	{

		var source = sourceArrayEnumerable.where(i => i.a==1);

		var sum:number, A = source;

		sum = A.sum(o=>o.a);

		assert.equal(sum, source.sum(o=>o.a), "Values must be equal after where pass 1.");

		sum = A.sum(o=>o.b);
		assert.equal(sum, source.sum(o=>o.b), "Values must be equal after where pass 2.");


		A = source.memoize();

		sum = A.sum(o=>o.a);

		assert.equal(sum, source.sum(o=>o.a), "Values must be equal after memoize pass 1.");

		sum = A.sum(o=>o.b);
		assert.equal(sum, source.sum(o=>o.b), "Values must be equal after memoize pass 2.");
	});
});

describe(".orderBy(selector)", ()=>
{
	it("should order ascending based upon the selector", ()=>
	{
		var source = sourceArrayEnumerable.reverse();
		assert.equal(source.first().c,"f");
	});
});


describe(".orderBy(selector)", ()=>
{
	it("should order ascending based upon the selector", ()=>
	{

		var source = sourceArrayEnumerable.reverse();

		var A = source.orderBy(o=>o.a).toArray();
		for(let i = 0; i<3; i++)
		{
			assert.equal(A[i].a, 1, "First three 'a' values should be 1 when ordered by 'a'.");
		}
		for(let i = 3; i<6; i++)
		{
			assert.equal(A[i].a, 2, "Last three 'a' values should be 2 when ordered by 'a'.");
		}

		var B = source.orderBy(o=> o.b).toArray();
		for(let i = 0; i<2; i++)
		{
			assert.equal(B[i].b, 1, "First two 'b' values should be 1 when ordered by 'b'.");
		}
		for(let i = 2; i<4; i++)
		{
			assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
		}
		for(let i = 4; i<6; i++)
		{
			assert.equal(B[i].b, 3, "Last two 'b' values should be 3 when ordered by 'b'.");
		}
	});
});


describe(".orderByDescending(selector)", ()=>
{
	it("should order descending based upon the selector", ()=>
	{


		var source = sourceArrayEnumerable.reverse();

		var A = source.orderByDescending((o:TestItem)=> o.a).toArray();
		for(let i = 0; i<3; i++)
		{
			assert.equal(A[i].a, 2, "First three 'a' values should be 2 when ordered by 'a'.");
		}
		for(let i = 3; i<6; i++)
		{
			assert.equal(A[i].a, 1, "Last three 'a' values should be 1 when ordered by 'a'.");
		}

		var B = source.orderByDescending((o:TestItem)=> o.b).toArray();
		for(let i = 0; i<2; i++)
		{
			assert.equal(B[i].b, 3, "First two 'b' values should be 3 when ordered by 'b'.");
		}
		for(let i = 2; i<4; i++)
		{
			assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
		}
		for(let i = 4; i<6; i++)
		{
			assert.equal(B[i].b, 1, "Last two 'b' values should be 1 when ordered by 'b'.");
		}
	});
});

describe(".orderBy(selector).thenBy(selector)", ()=>
{
	it("should order by one then the other", ()=>
	{


		var B = sourceArrayEnumerable
			.orderBy(o => o.b)
			.thenBy(o => o.c)
			.toArray();

		for(let i = 0; i<2; i++)
		{
			assert.equal(B[i].b, 1, "First two 'b' values should be 1 when ordered by 'b'.");
		}
		for(let i = 2; i<4; i++)
		{
			assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
		}
		for(let i = 4; i<6; i++)
		{
			assert.equal(B[i].b, 3, "Last two 'b' values should be 3 when ordered by 'b'.");
		}

		assert.equal(B[0].c, "b");
		assert.equal(B[1].c, "e");

		assert.equal(B[2].c, "a");
		assert.equal(B[3].c, "d");

		assert.equal(B[4].c, "c");
		assert.equal(B[5].c, "f");
	});

});


describe(".groupBy(selector)", ()=>
{
	it("should group by key provided by the selector", ()=>
	{


		var A_distinct = sourceArrayEnumerable
			.select(o=>o.a).distinct();
		var A = sourceArrayEnumerable
			.groupBy(o=>o.a);

		assert.equal(A_distinct.count(), A.count(), "Number of groups should match distinct values.");

		var B = sourceArrayEnumerable
			.groupBy(o=>o.b);
		var B_distinct = sourceArrayEnumerable
			.select(o=>o.b).distinct();

		assert.equal(B_distinct.count(), B.count(), "Number of groups should match distinct values.");


		const COMPANY_A = "Microsoft", COMPANY_B = "Hell Corp.";
		var objArray = [
			{Name: "John", Id: 0, Salary: 1300.00, Company: COMPANY_A},
			{Name: "Peter", Id: 1, Salary: 4800.50, Company: COMPANY_A},
			{Name: "Sandra", Id: 2, Salary: 999.99, Company: COMPANY_A},
			{Name: "Me", Id: 3, Salary: 1000000000.00, Company: COMPANY_B}
		];
		var groups = Enumerable.from(objArray).groupBy(x => x.Company);
		var companies = groups.select(x => x.key).toArray();

		assert.equal(companies.length, 2, "2 groups expected.");
		assert.ok(contains(companies, COMPANY_A), "Expect " + COMPANY_A);
		assert.ok(contains(companies, COMPANY_B), "Expect " + COMPANY_B);
		var group_A = groups.where(g=>g.key==COMPANY_A).single();
		var group_B = groups.where(g=>g.key==COMPANY_B).single();
		assert.equal(group_A.count(), 3, "Expected count of 3.");
		assert.equal(group_A.sum(x => x.Salary), 7100.49, "Expected sum to be correct.");
		assert.equal(group_B.count(), 1, "Expected count of 1.");
		assert.equal(group_B.sum(x => x.Salary), 1000000000.00, "Expected sum to be correct.");
	});
});

describe(".take(count)", ()=>
{
	it("count should match number taken", ()=>
	{
		var e = sourceArrayEnumerable.take(2);
		assert.equal(e.count(), 2);
	});
});


describe(".takeWhile(predicate)", ()=>
{
	it("should take while predicate returns true", ()=>
	{
		var e = sourceArrayEnumerable.takeWhile(v=>v.a==1);
		assert.equal(e.count(), 3, "count should match number taken");
	});

});


describe(".takeUntil(predicate,includeUntil)", ()=>
{
	it("should take until predicate returns true", ()=>
	{
		var e = sourceArrayEnumerable.takeUntil(v=>v.a==2);
		assert.equal(e.count(), 3, "count should match number taken");
	});

	it("should take until predicate returns true and include value matched", ()=>
	{
		var e = sourceArrayEnumerable.takeUntil(v=>v.a==2,true);
		assert.equal(e.count(), 4, "count should match number taken");
		assert.equal(e.last().c,"d");
	});
});


describe(".takeExceptLast(count)", ()=>
{
	it("should take the first ones minus the last", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>{
			var e = s.takeExceptLast(2);
			assert.equal(e.count(), 4);
			assert.equal(e.count(), 4, "count should match number taken");
			assert.equal(e.last().c,"d");
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);
	});

});

// Inverse of takeExceptLast
describe(".skipToLast(count)", ()=>
{
	it("should take the last items based on the count", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>{
			var e = s.skipToLast(2);
			assert.equal(e.count(), 2, "count should match number taken");
			assert.equal(e.first().c,"e");
			assert.equal(e.last().c,"f");
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);
	});

});


describe(".skip(count)", ()=>
{
	it("count should match total less skipped", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>{
			var e = s.skip(2);
			assert.equal(e.count(), 4);
			assert.equal(e.first().c,"c");
			assert.equal(e.last().c,"f");
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);
	});
});


describe(".skipWhile(predicate)", ()=>
{
	it("should skip while predicate returns true", ()=>
	{
		var e = sourceArrayEnumerable.skipWhile(v=>v.a==1);
		assert.equal(e.count(), 3, "count should match number taken");
		assert.equal(e.first().c,"d");
		assert.equal(e.last().c,"f");
	});

});



describe(".select(selector)", ()=>{

	it("should use appropriate selection mechanism", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>{
			var e = s.select(e=>e.c);
			assert.equal(e.count(), 6);
			assert.equal(e.first(),"a");
			assert.equal(e.last(),"f");
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);
	});

	it("should use appropriate selection mechanism", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>{
			var e = s.select((e,i)=>i);
			assert.equal(e.count(), 6);
			assert.equal(e.first(),0);
			assert.equal(e.last(),5);
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);
	});
});

describe(".shuffle()", ()=>
{
	it("should randomize the enumerable", ()=>
	{
		var e = sourceArrayEnumerable.shuffle();
		assert.equal(e.count(v=>v.a==1), 3);
	});

});

describe(".every(predicate)", ()=>
{
	it("should determine if every element matches the criteria", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>{
			assert.ok(!s.every(v=>v.a==1));
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);

	});

});

describe(".any(predicate)", ()=>
{
	it("should determine if every element matches the criteria", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>{
			assert.ok(s.some(v=>v.a==1));
			assert.ok(!s.isEmpty());
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);

	});

});

describe(".empty()",()=>{

	var source = Enumerable.empty();


	describe(".singleOrDefault()",()=>{

		it("should be defaulted",()=>{
			assert.equal(source.singleOrDefault(),null);
			assert.equal(source.singleOrDefault(-1),-1);
		});
		
	});

	describe(".single()",()=>{

		it("should throw",()=>{
			assert.throws(()=>{
				source.single();				
			});
		});

	});

	describe(".first()",()=>{

		it("should throw",()=>{
			assert.throws(()=>{
				source.first();
			});
		});

	});

	describe(".firstOrDefault()",()=>{

		it("should be defaulted",()=>{
			assert.equal(source.firstOrDefault(),null);
		});

	});

});

describe(".from([1])",()=>{

	let source = new Enumerable(()=>Enumerable.from([1]).getEnumerator());

	describe(".singleOrDefault()",()=>{

		it("should return single value",()=>{
			assert.equal(source.single(),1);
		});

	});

	describe(".singleOrDefault()",()=>{

		it("should return single value",()=>{
			assert.equal(source.singleOrDefault(),1);
		});

	});

	describe(".elementAt(x)", ()=>
	{

		it("should throw if no more", ()=>
		{
			assert.throws(()=>source.elementAt(2));
		});

	});

	describe(".elementAtOrDefault (x)", ()=>
	{

		it("should be defaulted", ()=>
		{
			assert.equal(source.elementAtOrDefault(2,-1),-1);
			assert.equal(source.elementAtOrDefault(2),null);
		});

		it("should throw", ()=>
		{
			assert.throws(()=>{source.elementAtOrDefault(NaN)});
			assert.throws(()=>{source.elementAtOrDefault(-1)});
			assert.throws(()=>{source.elementAtOrDefault(Infinity)});
		});

	});

});