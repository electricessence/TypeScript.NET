/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.UriHostNameType%28v=vs.110%29.aspx
 */
export declare enum UriHostNameType {
    /**
     * The host is set, but the type cannot be determined.
     */
    Basic = 0,
    /**
     * The host name is a domain name system (DNS) style host name.
     */
    DNS = 1,
    /**
     * The host name is an Internet Protocol (IP) version 4 host address.
     */
    IPv4 = 2,
    /**
     * The host name is an Internet Protocol (IP) version 6 host address.
     */
    IPv6 = 3,
    /**
     * The type of the host name is not supplied.
     */
    Unknown = 4
}
export default UriHostNameType;
