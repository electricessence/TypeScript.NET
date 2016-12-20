import ReadOnlyCollectionWrapper from "../ReadOnlyCollectionWrapper";
export default class ReadOnlyArrayWrapper<T> extends ReadOnlyCollectionWrapper<T> {
    constructor(array: ArrayLike<T>);
    protected _onDispose(): void;
    private __getValueAt;
    getValueAt(index: number): T;
}
