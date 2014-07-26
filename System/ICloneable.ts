/**
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: GNU.v3 https://github.com/electricessence/ObjectX/blob/master/LICENSE
 */

module ObjectX.Core {

	export interface ICloneable {
		clone(): any;
	}

	export interface ICloneableTyped<T> extends ICloneable {
		clone(): T;
	}
}