declare const enum PromiseState {
	Pending = 0,
	Fulfilled = 1,
	Rejected = -1
}

interface IPromiseState<T> {
	state: PromiseState;
	value?: T;
	reason?: any;
}
