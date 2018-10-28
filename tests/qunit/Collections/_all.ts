import LinkedList from "./LinkedList";
import Queue from "./Queue";
import OrderedStringKeyDictionary from "./OrderedStringKeyDictionary";
import {Enumerable} from "../../../dist/amd/System.Linq/Linq";
import Set from "../../../dist/amd/System/Collections/Set";

export default function run()
{
	LinkedList();
	Queue();
	OrderedStringKeyDictionary();
	const s = new Set([1,2,3]);
	Enumerable([1,2,3]);
	if(s.linq.any(v=>v==1))
		console.log(".linq preload working");
}
