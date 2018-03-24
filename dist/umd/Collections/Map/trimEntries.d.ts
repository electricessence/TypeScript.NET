/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import IMap from "../../IMap";
/**
 * Removes any keys that don't exist on the keyMap.
 * @param target
 * @param keyMap
 */
export declare function trimEntries<TResult extends IMap<any>>(target: IMap<any>, keyMap: TResult): void;
