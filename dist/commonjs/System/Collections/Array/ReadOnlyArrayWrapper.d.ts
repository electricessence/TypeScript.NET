import { ReadOnlyCollectionBase } from "../ReadOnlyCollectionBase";
export default class ReadOnlyArrayWrapper<T> extends ReadOnlyCollectionBase<T> {
    constructor(array: ArrayLike<T>);
    getValueAt: (index: number) => T;
}
