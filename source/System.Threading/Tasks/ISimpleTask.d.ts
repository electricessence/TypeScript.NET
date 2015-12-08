///<reference path="../ICancellable.d.ts"/>
///<reference path="TaskStatus.d.ts"/>

interface ISimpleTask<T> extends ICancellable {
	status:TaskStatus;
	result:T;
	runSynchronous():boolean;
	defer(delay:number):boolean;
}
