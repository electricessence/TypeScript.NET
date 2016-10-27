import * as ICollectionTests from "./ICollection";
import Queue from "../../../dist/amd/System/Collections/Queue";

export default function run()
{
	ICollectionTests.StringCollection('Queue', new Queue<string>());
	ICollectionTests.NumberCollection('Queue', new Queue<number>());
	ICollectionTests.InstanceCollection('Queue', new Queue<Object>());
}
