///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import * as ICollectionTests from "./ICollection";
import LinkedList from "../../../../dist/commonjs/System/Collections/LinkedList";
import {areEqual} from "../../../../dist/commonjs/System/Collections/Array/Compare";


const CLASS_NAME = 'LinkedList';
ICollectionTests.StringCollection(CLASS_NAME, new LinkedList<string>());
ICollectionTests.NumberCollection(CLASS_NAME, new LinkedList<number>());
ICollectionTests.InstanceCollection(CLASS_NAME, new LinkedList<Object>());

describe('.addAfter & .addBefore', ()=>
{
	const part1:number[] = [1, 2, 3], part2:number[] = [5, 6, 7];
	const parts = part1.concat(part2), len1 = parts.length;
	const list = new LinkedList<number>(parts);
	const list1 = list.toArray();
	const count1 = list.count;

	const partsSpliced = part1.concat([4]).concat(part2);
	const len2 = partsSpliced.length;
	list.find(5)!.addBefore(4);
	const count2 = list.count;
	const list2 = list.toArray();
	list.find(6)!.addAfter(6.5);
	const count3 = list.count;
	const list3 = list.toArray();


	it('should match expected initial count', ()=>
	{
		assert.equal(len1, count1);
		assert.ok(areEqual(parts, list1));
	});

	it('should match expected count after inserting before', ()=>
	{
		assert.equal(len2, count2);
		assert.ok(areEqual(partsSpliced, list2), partsSpliced.join(',') + " != " + list2.join(','));
	});

	it('should match expected count after inserting after', ()=>
	{
		assert.equal(len2 + 1, count3);
		assert.ok(areEqual(partsSpliced, list2), list3.join(','));
	});


});

describe("Validate external node detachment", ()=>
{

	it("should assert if node detached", ()=>
	{
		const list = new LinkedList<number>();
		list.add(1).add(2);
		assert.equal(list.count, 2);

		assert.equal(list.findLast(1)!.value,1);
		assert.equal(list.firstValue,1);
		assert.equal(list.find(2)!.value,2);
		assert.equal(list.lastValue,2);
		list.last!.value = 3;
		assert.equal(list.find(3)!.value,3);
		assert.equal(list.lastValue,3);

		list.addAfter(list.first!,5)
			.addFirst(0)
			.addLast(10);

		assert.equal(list.first!.value,0);
		assert.equal(list.getNodeAt(0)!.value,0);
		assert.equal(list.getValueAt(0),0);
		assert.equal(list!.getNodeAt(2)!.value,5);
		assert.equal(list.getValueAt(2),5);
		assert.equal(list!.getNodeAt(4)!.value,10);
		assert.equal(list.getValueAt(4),10);
		assert.ok(list.removeLast());
		assert.ok(list.removeFirst());
		const n = list.getNodeAt(1)!;
		assert.ok(list.removeAt(1));
		assert.throws(()=>n.value);

		const last = list.last!;
		assert.equal(last.previous!.value,1);
		assert.equal(last.previous!.next,last);
		last.remove();
		assert.ok(!last.list);
		assert.equal(list.count, 1);

		assert.doesNotThrow(()=>last.remove());
		assert.throws(()=>last.value);
		assert.throws(()=>last.next);
		assert.throws(()=>last.previous);

		const first = list.first!;
		list.dispose();
		assert.ok(!first.list);
		assert.throws(()=>first.value);

	})

});