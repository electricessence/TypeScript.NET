/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ICountResult from "./ICountResult";
export default interface ISumResult extends ICountResult {
    readonly sum: number;
}
