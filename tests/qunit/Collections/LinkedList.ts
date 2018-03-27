import * as ICollectionTests from "./ICollection";
import LinkedList from "../../../dist/amd/Collections/LinkedList";

export default function run() {
	ICollectionTests.StringCollection('LinkedList',new LinkedList<string>());
	ICollectionTests.NumberCollection('LinkedList',new LinkedList<number>());
	ICollectionTests.InstanceCollection('LinkedList',new LinkedList<Object>());
}
