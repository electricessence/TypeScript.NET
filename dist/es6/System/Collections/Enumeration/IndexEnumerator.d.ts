import { EnumeratorBase } from "./EnumeratorBase";
export interface IndexEnumeratorSource<T> {
    source: {
        [index: number]: T;
    };
    length: number;
    step?: number;
    pointer?: number;
}
export declare class IndexEnumerator<T> extends EnumeratorBase<T> {
    constructor(sourceFactory: () => IndexEnumeratorSource<T>);
}
export default IndexEnumerator;
