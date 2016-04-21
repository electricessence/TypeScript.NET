///<reference path="../../import.d.ts"/>

import * as ICollectionTests from "./ICollection";
import List from "../../../../source/System/Collections/List";

const CLASS_NAME = 'List';

ICollectionTests.StringCollection(CLASS_NAME, new List<string>());
ICollectionTests.NumberCollection(CLASS_NAME, new List<number>());
ICollectionTests.InstanceCollection(CLASS_NAME, new List<Object>());