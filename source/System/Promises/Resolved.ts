///<reference path="IPromise.d.ts"/>
class ResolvedMinimial<T> implements IPromiseMinimal<T> {


	constructor(protected _result:T)
	{
	}


}
