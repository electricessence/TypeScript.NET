import { SimpleEnumerableBase } from "./SimpleEnumerableBase";
export interface InfiniteValueFactory<T> {
    (previous?: T, index?: number): T;
}
export declare class InfiniteEnumerator<T> extends SimpleEnumerableBase<T> {
    private readonly _factory;
    constructor(_factory: InfiniteValueFactory<T>);
    protected _canMoveNext(): boolean;
    moveNext(): boolean;
    dispose(): void;
}
export default InfiniteEnumerator;
