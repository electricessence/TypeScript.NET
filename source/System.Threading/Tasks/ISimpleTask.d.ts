///<reference path="../ICancellable.d.ts"/>
///<reference path="TaskStatus.d.ts"/>
///<reference path="ITaskState.d.ts"/>

interface ISimpleTask<T> extends ITaskState<T>, ICancellable {
	runSynchronous():boolean;
	defer(delay:number):boolean;
}
