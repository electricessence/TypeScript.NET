/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
import { SchemeValue } from "./SchemeValue";
export declare module Scheme {
    /**
     * The resource is a file on the local computer.
     */
    const File: SchemeValue.File;
    /**
     * The resource is accessed through FTP.
     */
    const FTP: SchemeValue.FTP;
    /**
     * The resource is accessed through the Gopher protocol.
     */
    const GOPHER: SchemeValue.Gopher;
    /**
     * The resource is accessed through HTTP.
     */
    const HTTP: SchemeValue.HTTP;
    /**
     * The resource is accessed through SSL-encrypted HTTP.
     */
    const HTTPS: SchemeValue.HTTPS;
    /**
     * The resource is accessed through the LDAP protocol.
     */
    const LDAP: SchemeValue.LDAP;
    /**
     * The resource is an e-mail address and accessed through the SMTP protocol.
     */
    const MAILTO: SchemeValue.MailTo;
    /**
     * The resource is accessed through a named pipe.
     */
    const PIPE: SchemeValue.Pipe;
    /**
     * The resource is accessed from TCP endpoint.
     */
    const TCP: SchemeValue.TCP;
    /**
     * The resource is accessed through the NNTP protocol.
     */
    const NEWS: SchemeValue.NNTP;
    /**
     * The resource is accessed through the NNTP protocol.
     */
    const NNTP: SchemeValue.NNTP;
    /**
     * The resource is accessed through the TELNET protocol.
     */
    const TELNET: SchemeValue.Telnet;
    /**
     * The resource is accessed through a unique UUID endpoint name for communicating with a service.
     */
    const UUID: SchemeValue.UUID;
    /**
     * An index of possible values to validate against.
     * @type {Array}
     */
    const All: ReadonlyArray<SchemeValue.Any>;
    function isValid(scheme: string): scheme is SchemeValue.Any;
}
export default Scheme;
