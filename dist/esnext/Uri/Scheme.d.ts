declare enum Scheme {
    File = "file",
    Gopher = "gopher",
    FTP = "ftp",
    HTTP = "http",
    HTTPS = "https",
    LDAP = "ldap",
    MailTo = "mailto",
    Pipe = "net.pipe",
    TCP = "net.tcp",
    NNTP = "nntp",
    News = "news",
    Telnet = "telnet",
    UUID = "uuid",
}
export declare function isValidScheme(scheme: string): scheme is Scheme;
export default Scheme;
