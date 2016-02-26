///<reference path="Adapters.d.ts"/>

abstract class SimpleNetAdapterBase implements IAdaptHttpRequest {

	abstract request<TResult>(params:IHttpRequestParams):IPromise<TResult>;
}

export default SimpleNetAdapterBase;