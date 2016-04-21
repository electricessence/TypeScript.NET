///<reference path="../../import.d.ts"/>

import * as ICollectionTests from "./ICollection";
import ArrayCollection from "../../../../source/System/Collections/ArrayCollection";

ICollectionTests.StringCollection('ArrayCollection', new ArrayCollection<string>());
ICollectionTests.NumberCollection('ArrayCollection', new ArrayCollection<number>());
ICollectionTests.InstanceCollection('ArrayCollection', new ArrayCollection<Object>());