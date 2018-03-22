/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.net.security.AuthenticationLevel%28v=vs.110%29.aspx
 */


export declare const enum AuthenticationLevel
{
	/**
	 * No authentication is required for the client and server.
	 */
	None                    = 0,

		/**
		 * The client and server should be authenticated. The request does not fail if the server is not authenticated. To determine whether mutual authentication occurred, check the value of the WebResponse.IsMutuallyAuthenticated property.
		 */
		MutualAuthRequested = 1,

		/**
		 * The client and server should be authenticated. If the server is not authenticated, your application will receive an IOException with a ProtocolViolationException inner exception that indicates that mutual authentication failed
		 */
		MutualAuthRequired  = 2,

}

export default AuthenticationLevel;