///<reference path="../import.d.ts"/>

import {contains, repeat} from "../../../dist/commonjs/System/Collections/Array/Utility";
import * as Procedure from "../../../dist/commonjs/System/Collections/Array/Procedure";
import Enumerable from "../../../dist/commonjs/System.Linq/Linq";
import Functions from "../../../dist/commonjs/System/Functions";
import {EmptyEnumerator} from "../../../dist/commonjs/System/Collections/Enumeration/EmptyEnumerator";
import {List} from "../../../dist/commonjs/System/Collections/List";
import {ILinqEnumerable} from "../../../dist/commonjs/System.Linq/Enumerable";
import * as assert from "assert";


interface TestItem
{
	a:number;
	b:number;
	c:string;
	children?:TestItem[];
}


const source:TestItem[] = Object.freeze([
	{
		a: 1,
		b: 2,
		c: "a",
		children: [
			{
				a: 1,
				b: 2,
				c: "a",
				children: [
					{
						a: 1,
						b: 2,
						c: "a",
						children: []
					},
					{
						a: 1,
						b: 1,
						c: "b",
					},
					{
						a: 1,
						b: 3,
						c: "c"
					}
				]
			},
			{
				a: 1,
				b: 1,
				c: "b",
			},
			{
				a: 1,
				b: 3,
				c: "c"
			}
		]
	},
	{
		a: 1,
		b: 1,
		c: "b",
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

// Compile test:
function compileTest():ILinqEnumerable<TestItem>
{
	var list = new List(source);
	return list.linq.orderBy(v=>v.a)
		.takeWhile((g, i)=>i<5);
}


const sourceMany:Enumerable<string> = Enumerable.from(Object.freeze([
	"a,b,c,d,e",
	null,
	"f,g,h,i,j",
	"k,l,m,n,o",
	"p,q,r,s,t",
	"u,v,w,x,y",
]));
const sourceManyFlat = "abcdefghijklmnopqrstuvwxy";

var sourceArrayEnumerable = Enumerable.from(source),
    sourceEnumerable      = new Enumerable(()=>sourceArrayEnumerable.getEnumerator());

describe(".force()", ()=>
{
	it("should not throw", ()=>
	{
		assert.doesNotThrow(()=> { sourceEnumerable.force() });
	});
});

describe(".count()", ()=>
{
	it("should match count to length", ()=>
	{
		assert.equal(sourceArrayEnumerable.count(), source.length);
		assert.equal(sourceEnumerable.count(), source.length);
		assert.equal(Enumerable.from([]).count(), 0);
		assert.equal(Enumerable.empty().count(), 0);
		assert.equal(sourceArrayEnumerable.count(e=>e.a===1), 3);
	});
});

describe(".source", ()=>
{
	it("should equal the original", ()=>
	{
		assert.equal(source, (<any>(sourceArrayEnumerable)).source);
	});
});

describe(".memoize()", ()=>
{
	it("should cache the values as it goes for reuse later", ()=>
	{
		var source = sourceEnumerable;
		var A = source.memoize();

		source.memoize().dispose(); // Covers else condition.

		var sum = A.sum(o=>o.a);

		assert.equal(sum, source.sum(o=>o.a), "Values must be equal after memoize pass 1.");

		sum = A.sum(o=>o.b);
		assert.equal(sum, source.sum(o=>o.b), "Values must be equal after memoize pass 2.");
		A.dispose(); // Disposing this memoized source should not affect other tests.

		assert.throws(()=>
		{
			// Should throw after disposal.
			A.force();
		});

		A = sourceArrayEnumerable.memoize();
		A.dispose();
		assert.throws(()=>
		{
			// Should throw after disposal.
			A.force();
		});

	});
});


describe(".choose(predicate)", ()=>
{
	it("should filter out null and undefined values.", ()=>
	{
		var other = <TestItem[]>[null, void(0)];
		assert.equal(sourceArrayEnumerable
			.concat(other)
			.choose()
			.select(s=>s.a)
			.where(s=>s===1)
			.count(), 3);

		assert.equal(sourceArrayEnumerable
			.concat(other)
			.choose((e:TestItem, i:number)=>
			{
				return <TestItem>(i%2 ? e : null);
			})
			.count(), 3);

		sourceArrayEnumerable
			.concat(other)
			.choose()
			.dispose();

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

		source.dispose();
	});
});

describe(".orderBy(selector)", ()=>
{
	it("should order ascending based upon the selector", ()=>
	{
		var source = sourceArrayEnumerable.reverse();
		assert.equal(source.first().c, "f");
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

describe(".select(b)", ()=>
{

	var b = sourceArrayEnumerable.select(e=>e.b);
	describe(".distinct()", ()=>
	{
		var d = b.distinct();
		describe(".orderBy()", ()=>
		{
			it("should be 1,2,3", ()=>
			{
				var s = d.orderBy();
				assert.equal(s.count(), 3);
				assert.equal(s.sum(), 6);
				assert.equal(s.elementAt(0), 1);
				assert.equal(s.elementAt(1), 2);
				assert.equal(s.elementAt(2), 3);
			});
		});

		describe(".orderByDescending()", ()=>
		{
			it("should be 1,2,3", ()=>
			{
				var s = d.orderByDescending();
				assert.equal(s.count(), 3);
				assert.equal(s.sum(), 6);
				assert.equal(s.elementAt(0), 3);
				assert.equal(s.elementAt(1), 2);
				assert.equal(s.elementAt(2), 1);
			});
		});
	});

	describe(".distinctUntilChanged()", ()=>
	{
		it("should be as expected", ()=>
		{
			assert.equal(b.distinctUntilChanged().toJoinedString(), "213213");
			assert.equal(b.distinctUntilChanged(v=>Math.max(v, 2)).toJoinedString(), "2323");
			assert.equal(b.distinctUntilChanged(v=>Math.min(v, 2)).toJoinedString(), "21313");
			assert.equal(b.orderBy().distinctUntilChanged().toJoinedString(), "123");
		});
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

		var C = sourceArrayEnumerable
			.groupBy(o=>o.b, null, Functions.Identity);

		var D = sourceArrayEnumerable
			.groupBy(o=>o.b, Functions.Identity, Functions.Identity);


		assert.ok(B.first().sequenceEqual(C.first()));
		assert.ok(C.first().sequenceEqual(D.first()));

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
		var e = sourceArrayEnumerable.takeUntil(v=>v.a==2, true);
		assert.equal(e.count(), 4, "count should match number taken");
		assert.equal(e.last().c, "d");
	});
});


describe(".takeExceptLast(count)", ()=>
{
	it("should take the first ones minus the last", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>
		{
			var e = s.takeExceptLast(2);
			assert.equal(e.count(), 4);
			assert.equal(e.count(), 4, "count should match number taken");
			assert.equal(e.last().c, "d");
			var e = s.takeExceptLast();
			assert.equal(e.count(), 5);
			assert.equal(e.count(), 5, "count should match number taken");
			assert.equal(e.last().c, "e");
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
		var test = (s:Enumerable<TestItem>)=>
		{
			var e = s.skipToLast(2);
			assert.equal(e.count(), 2, "count should match number taken");
			assert.equal(e.first().c, "e");
			assert.equal(e.last().c, "f");

			e = s.skipToLast(0);
			assert.equal(e.count(), 0);
			e = s.skipToLast(Infinity);
			assert.equal(e.count(), 6);
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);
	});

});


describe(".skip(count)", ()=>
{
	it("count should match total less skipped", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>
		{
			var e = s.skip(2);
			assert.equal(e.count(), 4);
			assert.equal(e.first().c, "c");
			assert.equal(e.last().c, "f");
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);

		assert.equal(sourceArrayEnumerable.skip(0), sourceArrayEnumerable)
	});

});


describe(".skipWhile(predicate)", ()=>
{
	it("should skip while predicate returns true", ()=>
	{
		var e = sourceArrayEnumerable.skipWhile(v=>v.a==1);
		assert.equal(e.count(), 3, "count should match number taken");
		assert.equal(e.first().c, "d");
		assert.equal(e.last().c, "f");
	});

});


describe(".select(selector)", ()=>
{

	it("should use appropriate selection mechanism", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>
		{
			var e = s.select(e=>e.c);
			assert.equal(e.count(), 6);
			assert.equal(e.first(), "a");
			assert.equal(e.last(), "f");
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);
	});

	it("should use appropriate selection mechanism", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>
		{
			var e = s.select((e, i)=>i);
			assert.equal(e.count(), 6);
			assert.equal(e.first(), 0);
			assert.equal(e.last(), 5);
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
		e.dispose();
		assert.throws(()=>e.count());
	});

});

describe(".every(predicate)", ()=>
{
	it("should determine if every element matches the criteria", ()=>
	{
		var test = (s:Enumerable<TestItem>)=>
		{
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
		var test = (s:Enumerable<TestItem>)=>
		{
			assert.ok(s.some(v=>v.a==1));
			assert.ok(!s.isEmpty());
		};
		test(sourceArrayEnumerable);
		test(sourceEnumerable);

	});

});

describe(".empty()", ()=>
{

	var source = Enumerable.empty();


	describe(".singleOrDefault()", ()=>
	{

		it("should be defaulted", ()=>
		{
			assert.equal(source.singleOrDefault(), null);
			assert.equal(source.singleOrDefault(-1), -1);
		});

	});

	describe(".single()", ()=>
	{

		it("should throw", ()=>
		{
			assert.throws(()=>
			{
				source.single();
			});
		});

	});

	describe(".first()", ()=>
	{

		it("should throw", ()=>
		{
			assert.throws(()=>
			{
				source.first();
			});
		});

	});

	describe(".firstOrDefault()", ()=>
	{

		it("should be defaulted", ()=>
		{
			assert.equal(source.firstOrDefault(), null);
		});

	});

	describe(".last()", ()=>
	{

		it("should throw", ()=>
		{
			assert.throws(()=>
			{
				source.last();
			});
		});

	});

	describe(".lastOrDefault()", ()=>
	{

		it("should be defaulted", ()=>
		{
			assert.equal(source.lastOrDefault(), null);
			var d = 1;
			assert.equal(source.lastOrDefault(d), d);
		});

	});

});


describe(".last()", ()=>
{

	it("should match last", ()=>
	{
		assert.equal(sourceArrayEnumerable.last().c, "f");
	});

	it("should throw", ()=>
	{
		assert.throws(()=>Enumerable.from([]).last());
	});

});

describe(".lastOrDefault()", ()=>
{

	it("should match last", ()=>
	{
		assert.equal(sourceArrayEnumerable.lastOrDefault().c, "f");
	});

	it("should be defaulted", ()=>
	{
		assert.equal(Enumerable.from([]).lastOrDefault("f"), "f");
	});

});

describe(".from(x)", ()=>
{
	it("should throw if not enumerable", ()=>
	{
		assert.throws(()=>Enumerable.from(<any>1));
	});
});

describe(".fromAny(x,default)", ()=>
{
	it("should return the default if not enumerable", ()=>
	{
		assert.equal(Enumerable.fromAny(1), null);
	});
});

describe(".fromAny(x,default)", ()=>
{
	it("should return an enumerable from an enumerable", ()=>
	{
		assert.ok(Enumerable.fromAny(sourceArrayEnumerable) instanceof Enumerable);
	});
	it("should return an enumerable from an array", ()=>
	{
		assert.ok(Enumerable.fromAny(source) instanceof Enumerable);
	});
	it("should return an enumerable from an IEnumerable", ()=>
	{
		var e = Enumerable.fromAny({getEnumerator: ()=> { return EmptyEnumerator; }});
		e.getEnumerator();
		assert.ok(e instanceof Enumerable);
	});
});

describe(".from([1])", ()=>
{

	let source = new Enumerable(()=>Enumerable.from([1]).getEnumerator());

	describe(".singleOrDefault()", ()=>
	{

		it("should return single value", ()=>
		{
			assert.equal(source.single(), 1);
		});

	});

	describe(".singleOrDefault()", ()=>
	{

		it("should return single value", ()=>
		{
			assert.equal(source.singleOrDefault(), 1);
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
			assert.equal(source.elementAtOrDefault(2, -1), -1);
			assert.equal(source.elementAtOrDefault(2), null);
		});

		it("should throw", ()=>
		{
			assert.throws(()=> {source.elementAtOrDefault(NaN)});
			assert.throws(()=> {source.elementAtOrDefault(-1)});
			assert.throws(()=> {source.elementAtOrDefault(Infinity)});
		});

	});

});


describe(".elementAt(x)", ()=>
{
	it("should return the indexed element", ()=>
	{
		assert.equal(sourceEnumerable.elementAt(2), source[2]);
		assert.equal(sourceArrayEnumerable.elementAt(2), source[2]);
	});

	it("should throw", ()=>
	{
		assert.throws(()=>sourceArrayEnumerable.elementAt(-1));
	});

});

describe(".elementAtOrDefault (x)", ()=>
{
	it("should return the indexed element", ()=>
	{
		assert.equal(sourceEnumerable.elementAtOrDefault(2), source[2]);
		assert.equal(sourceArrayEnumerable.elementAtOrDefault(2), source[2]);
		var d = {};
		assert.equal(sourceArrayEnumerable.elementAtOrDefault(10, <any>d), d);
	});

	it("should throw", ()=>
	{
		assert.throws(()=>sourceArrayEnumerable.elementAtOrDefault(-1));
	});

});


describe(".min()", ()=>
{
	it("should return the minimum of the selected", ()=>
	{
		assert.equal(sourceArrayEnumerable.select(e=>e.b).min(), 1);
		assert.equal(sourceArrayEnumerable.select(e=>e.c).min(), "a");
	});
});

describe(".max()", ()=>
{
	it("should return the maximum of the selected", ()=>
	{
		assert.equal(sourceArrayEnumerable.select(e=>e.b).max(), 3);
		assert.equal(sourceArrayEnumerable.select(e=>e.c).max(), "f");


	});
});

describe(".minBy(selector)", ()=>
{
	it("should return the minimum of the selected", ()=>
	{
		assert.equal(sourceArrayEnumerable.minBy(e=>e.b).b, 1);
		assert.equal(sourceArrayEnumerable.minBy(e=>e.c).c, "a");

		assert.equal(sourceArrayEnumerable.select(e=>e.b).minBy(), 1);
		assert.equal(sourceArrayEnumerable.select(e=>e.c).minBy(), "a");
	});
});


describe(".maxBy(selector)", ()=>
{
	it("should return the maximum of the selected", ()=>
	{
		assert.equal(sourceArrayEnumerable.maxBy(e=>e.b).b, 3);
		assert.equal(sourceArrayEnumerable.maxBy(e=>e.c).c, "f");

		assert.equal(sourceArrayEnumerable.select(e=>e.b).maxBy(), 3);
		assert.equal(sourceArrayEnumerable.select(e=>e.c).maxBy(), "f");

	});
});

describe(".concat(...)", ()=>
{
	it("should remain the same", ()=>
	{
		assert.equal(sourceArrayEnumerable.merge(null).count(), 6);
		assert.equal(sourceArrayEnumerable.merge([]).count(), 6);
	});
	it("should combine two into one", ()=>
	{
		assert.equal(sourceArrayEnumerable.concat(sourceArrayEnumerable).count(), 12);
	});
});

describe(".selectMany(...)", ()=>
{
	it("should select the sub values", ()=>
	{
		function test(values:Enumerable<string>)
		{
			assert.equal(values.count(), 25);
			assert.equal(values.toJoinedString(), sourceManyFlat);
		}

		var split:(s:string)=>string[] = (s)=>s && s.split(",");
		var sm:(s:string,e:string)=>string = (c, e)=>e;

		var a = sourceMany.selectMany(split);
		test(a);
		var b = sourceMany.selectMany(split, sm);
		test(b);

		assert.equal(Enumerable.from(<string[]>[]).selectMany(split).count(), 0);

		var iSource = Enumerable.toInfinity().selectMany(s=>repeat("" + s, s));
		assert.equal(iSource.take(10).toJoinedString(), "1223334444");

		var s = sourceMany.select(s=>s.length);
		s.dispose();
		assert.throws(()=>s.toArray());
	});
});

describe(".traverseBreadthFirst()", ()=>
{
	it("walk the tree in proper order", ()=>
	{
		var tree = sourceEnumerable
			.traverseBreadthFirst(e=>e.children),
		    c    = tree.select(e=>e.c);

		assert.equal(c.elementAt(2), "c");
		assert.equal(c.elementAt(6), "a");
		assert.equal(c.count(), 12);

		assert.equal(Enumerable.empty<TestItem>().traverseBreadthFirst(
			e=>e.children, Functions.Identity).count(), 0);
	});
});

describe(".traverseDepthFirst()", ()=>
{
	it("walk the tree in proper order", ()=>
	{
		var tree = sourceEnumerable
			.traverseDepthFirst(e=>e.children),
		    c    = tree.select(e=>e.c);

		assert.equal(c.elementAt(2), "a");
		assert.equal(c.elementAt(6), "c");
		assert.equal(c.count(), 12);

		assert.equal(Enumerable.empty<TestItem>().traverseDepthFirst(
			e=>e.children, Functions.Identity).count(), 0);
	});
});

describe(".flatten()", ()=>
{
	it("should convert deep enumerable to flat one", ()=>
	{
		assert.equal(
			sourceMany
				.choose()
				.select(s=>s.split(','))
				.concat([["z"]])
				.flatten()
				.toJoinedString(),
			sourceManyFlat + "z");
	});
});

describe(".ofType(type)", ()=>
{

	var source = Enumerable.from(<any[]>[
		1,
		"a",
		true,
		[],
		[],
		2,
		"b",
		[],
		false,
		function() {},
		3,
		"c",
		[],
		"d",
		"e",
		null,
		undefined
	]);

	it("should select only the type requested", ()=>
	{
		assert.equal(source.ofType(Number).count(), 3);
		assert.equal(source.ofType(String).count(), 5);
		assert.equal(source.ofType(Boolean).count(), 2);
		assert.equal(source.ofType(Function).count(), 1);
		assert.equal(source.ofType(Array).count(), 4);
	});
});

describe(".buffer(size)", ()=>
{
	it("should return arrays at the size provided", ()=>
	{
		var s2 = sourceEnumerable.buffer(2);
		assert.equal(s2.first().length, 2);
		assert.equal(s2.count(), 3);

	});

	it("should throw for invalid sizes", ()=>
	{
		assert.throws(()=>sourceEnumerable.buffer(-1));
		assert.throws(()=>sourceEnumerable.buffer(Infinity));
	});
});

describe(".share()", ()=>
{

	it("should share an enumerator", ()=>
	{
		var s = sourceEnumerable.select(e=>e.c).share();
		var e1 = s.getEnumerator();
		var e2 = s.getEnumerator();

		e1.moveNext();
		assert.equal(e1.current, "a");
		assert.equal(e2.current, "a");
		e2.moveNext();
		assert.equal(e1.current, "b");
		assert.equal(e2.current, "b");

	});

});

var mathTree      = sourceEnumerable.traverseDepthFirst(e=>e.children),
    mathTreeArray = mathTree.select(e=>e.b).toArray();

describe(".sum()", ()=>
{
	it("should render the sum value", ()=>
	{
		var v = Procedure.sum(mathTreeArray);

		assert.equal(Enumerable.empty().sum(), 0);
		assert.equal(mathTree.select(e=>e.b).sum(), v);
		assert.equal(mathTree.select(e=>e.b).concat([Infinity, -Infinity]).sum(), v);
		assert.equal(mathTree.select(e=>e.b).concat([
			Infinity,
			Infinity,
			-Infinity
		]).sum(), Infinity);
		assert.equal(mathTree.select(e=>e.b).concat([
			Infinity,
			-Infinity,
			-Infinity
		]).sum(), -Infinity);
		assert.ok(isNaN(mathTree.select(e=>e.b).concat([NaN]).sum()));
		assert.equal(mathTree.sum(e=>e.b), v);

	});

});


describe(".product()", ()=>
{
	it("should render the product value", ()=>
	{
		var v = Procedure.product(mathTreeArray);

		assert.equal(mathTree.select(e=>e.b).product(), v);
		assert.ok(isNaN(mathTree.select(e=>e.b).concat([NaN]).product()));
		assert.equal(mathTree.select(e=>e.b).concat([0]).product(), 0);
		assert.equal(mathTree.product(e=>e.b), v);

	});

});

describe(".quotient()", ()=>
{
	it("should render the quotient value", ()=>
	{
		var v = Procedure.quotient(mathTreeArray);

		assert.equal(mathTree.select(e=>e.b).quotient(), v);
		assert.ok(isNaN(mathTree.select(e=>e.b).concat([NaN]).quotient()));
		assert.ok(isNaN(mathTree.select(e=>e.b).take(1).quotient()));
		assert.equal(mathTree.quotient(e=>e.b), v);

	});

});

describe(".average()", ()=>
{
	it("should render the average value", ()=>
	{
		var tree = sourceEnumerable
			.traverseDepthFirst(e=>e.children);
		var v = Procedure.average(mathTreeArray);

		assert.equal(mathTree.select(e=>e.b).average(), v);
		assert.ok(isNaN(mathTree.select(e=>e.b).concat([NaN]).average()));
		assert.equal(mathTree.average(e=>e.b), v);

	});

});

describe(".weave(enumerables)", ()=>
{

	it("should weave in order", ()=>
	{
		let w = Enumerable.weave([
			["a", "d"],
			["b", "e", "g", "i"],
			["c", "f", "h"]
		]);

		assert.equal(w.count(),9);
		assert.equal(w.toJoinedString(),"abcdefghi");

		assert.equal(
			Enumerable.weave([
				[1, 2, 3, 4, 5, 6, 7]
			]).count(), 7);

	});

	it("should throw",()=>{
		assert.throws(()=>Enumerable.weave(null));
	});

});