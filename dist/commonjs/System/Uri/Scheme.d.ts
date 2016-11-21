import * as Scheme from "./SchemeValue";
import { SchemeValue } from "./SchemeValue";
/**
 * The resource is a file on the local computer.
 */
export declare const File: Scheme.File;
/**
 * The resource is accessed through FTP.
 */
export declare const FTP: Scheme.FTP;
/**
 * The resource is accessed through the Gopher protocol.
 */
export declare const GOPHER: Scheme.Gopher;
/**
 * The resource is accessed through HTTP.
 */
export declare const HTTP: Scheme.HTTP;
/**
 * The resource is accessed through SSL-encrypted HTTP.
 */
export declare const HTTPS: Scheme.HTTPS;
/**
 * The resource is accessed through the LDAP protocol.
 */
export declare const LDAP: Scheme.LDAP;
/**
 * The resource is an e-mail address and accessed through the SMTP protocol.
 */
export declare const MAILTO: Scheme.MailTo;
/**
 * The resource is accessed through a named pipe.
 */
export declare const PIPE: Scheme.Pipe;
/**
 * The resource is accessed from TCP endpoint.
 */
export declare const TCP: Scheme.TCP;
/**
 * The resource is accessed through the NNTP protocol.
 */
export declare const NEWS: Scheme.NNTP;
/**
 * The resource is accessed through the NNTP protocol.
 */
export declare const NNTP: Scheme.NNTP;
/**
 * The resource is accessed through the TELNET protocol.
 */
export declare const TELNET: Scheme.Telnet;
/**
 * The resource is accessed through a unique UUID endpoint name for communicating with a service.
 */
export declare const UUID: Scheme.UUID;
/**
 * An index of possible values to validate against.
 * @type {Array}
 */
export declare const All: Readonly<Scheme.SchemeValue[]>;
export declare function isValid(scheme: string): scheme is SchemeValue;
