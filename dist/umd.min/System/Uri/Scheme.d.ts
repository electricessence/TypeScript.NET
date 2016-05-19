/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://msdn.microsoft.com/en-us/library/system.uri.scheme%28v=vs.110%29.aspx
 */
import * as Scheme from "./SchemeValue";
import { SchemeValue } from "./SchemeValue";
export declare const File: Scheme.File;
export declare const FTP: Scheme.FTP;
export declare const GOPHER: Scheme.Gopher;
export declare const HTTP: Scheme.HTTP;
export declare const HTTPS: Scheme.HTTPS;
export declare const LDAP: Scheme.LDAP;
export declare const MAILTO: Scheme.MailTo;
export declare const PIPE: Scheme.Pipe;
export declare const TCP: Scheme.TCP;
export declare const NEWS: Scheme.NNTP;
export declare const NNTP: Scheme.NNTP;
export declare const TELNET: Scheme.Telnet;
export declare const UUID: Scheme.UUID;
export declare const All: SchemeValue[];
export declare function isValid(scheme: string): scheme is SchemeValue;
