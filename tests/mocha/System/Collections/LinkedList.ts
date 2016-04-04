///<reference path="../../import.d.ts"/>

import * as ICollectionTests from "./ICollection";
import LinkedList from "../../../../source/System/Collections/LinkedList";
import {areEqual} from "../../../../source/System/Collections/Array/Compare";
var assert = require('../../../../node_modules/assert/assert');

ICollectionTests.StringCollection('LinkedList',new LinkedList<string>());
ICollectionTests.NumberCollection('LinkedList',new LinkedList<number>());
ICollectionTests.InstanceCollection('LinkedList',new LinkedList<Object>());

describe('.addAfter & .addBefore', ()=>
{
	var part1:number[] = [1,2,3], part2:number[] = [5,6,7];
	var parts = part1.concat(part2), len1 = parts.length;
	var list = new LinkedList<number>(parts);
	var list1 = list.toArray();
	var count1 = list.count;

	var partsSpliced = part1.concat([4]).concat(part2);
	var len2 = partsSpliced.length;
	list.find(5).addBefore(4);
	var count2 = list.count;
	var list2 = list.toArray();
	list.find(6).addAfter(6.5);
	var count3 = list.count;
	var list3 = list.toArray();


	
	it('should match expected initial count', ()=>
	{
		assert.equal(len1, count1);
		assert.ok(areEqual(parts,list1));
	});

	it('should match expected count after inserting before', ()=>
	{
		assert.equal(len2, count2);
		assert.ok(areEqual(partsSpliced,list2), partsSpliced.join(',') + " != " + list2.join(',') );
	});

	it('should match expected count after inserting after', ()=>
	{
		assert.equal(len2+1, count3);
		assert.ok(areEqual(partsSpliced,list2), list3.join(',') );
	});


});