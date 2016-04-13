///<reference path="../../import.d.ts"/>
///<reference path="../../../../source/System/Primitive.d.ts"/>

import * as ICollectionTests from "./ICollection";
import Set from "../../../../source/System/Collections/Set";
var assert = require('../../../../node_modules/assert/assert');

//noinspection SpellCheckingInspection
ICollectionTests.Collection('Set<' + 'string>', new Set<string>(), [
	"",
	"lorem",
	"ipsum",
	"dolem"
]);

ICollectionTests.Collection('Set<' + 'number>', new Set<number>(), [
	0,
	1,
	2,
	3,
	5,
	7,
	11,
	13
]);


ICollectionTests.Collection('Set<' + 'Primitive>', new Set<Primitive>(), [
	0,
	1,
	2,
	3,
	5,
	7,
	11,
	13,
	"",
	"0",
	"1",
	"2",
	"3",
	"5",
	"7",
	"11",
	"13",
	true,
	false

]);