/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { EnumeratorBase } from "./EnumeratorBase";
export declare class IndexEnumerator<T> extends EnumeratorBase<T> {
    constructor(sourceFactory: () => {
        source: {
            [index: number]: T;
        };
        pointer?: number;
        length: number;
        step?: number;
    });
}
export default IndexEnumerator;
