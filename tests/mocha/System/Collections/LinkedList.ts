import * as ICollectionTests from './ICollection';
import LinkedList from '../../../../source/System/Collections/LinkedList';

ICollectionTests.StringCollection('LinkedList',new LinkedList<string>());
ICollectionTests.NumberCollection('LinkedList',new LinkedList<number>());
ICollectionTests.InstanceCollection('LinkedList',new LinkedList<Object>());

