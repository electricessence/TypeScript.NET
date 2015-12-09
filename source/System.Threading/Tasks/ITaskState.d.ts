///<reference path="TaskStatus.d.ts"/>
interface ITaskState<T> {
	status:TaskStatus;
	result:T;
	exception:any;
}