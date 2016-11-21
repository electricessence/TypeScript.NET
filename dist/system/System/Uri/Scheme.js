System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isValid(scheme) {
        return All.indexOf(scheme) != -1;
    }
    exports_1("isValid", isValid);
    var File, FTP, GOPHER, HTTP, HTTPS, LDAP, MAILTO, PIPE, TCP, NEWS, NNTP, TELNET, UUID, All;
    return {
        setters: [],
        execute: function () {
            /**
             * The resource is a file on the local computer.
             */
            exports_1("File", File = "file");
            /**
             * The resource is accessed through FTP.
             */
            exports_1("FTP", FTP = "ftp");
            /**
             * The resource is accessed through the Gopher protocol.
             */
            exports_1("GOPHER", GOPHER = "gopher");
            /**
             * The resource is accessed through HTTP.
             */
            exports_1("HTTP", HTTP = "http");
            /**
             * The resource is accessed through SSL-encrypted HTTP.
             */
            exports_1("HTTPS", HTTPS = "https");
            /**
             * The resource is accessed through the LDAP protocol.
             */
            exports_1("LDAP", LDAP = "ldap");
            /**
             * The resource is an e-mail address and accessed through the SMTP protocol.
             */
            exports_1("MAILTO", MAILTO = "mailto");
            /**
             * The resource is accessed through a named pipe.
             */
            exports_1("PIPE", PIPE = "net.pipe");
            /**
             * The resource is accessed from TCP endpoint.
             */
            exports_1("TCP", TCP = "net.tcp");
            /**
             * The resource is accessed through the NNTP protocol.
             */
            exports_1("NEWS", NEWS = "news");
            /**
             * The resource is accessed through the NNTP protocol.
             */
            exports_1("NNTP", NNTP = "nntp");
            /**
             * The resource is accessed through the TELNET protocol.
             */
            exports_1("TELNET", TELNET = "telnet");
            /**
             * The resource is accessed through a unique UUID endpoint name for communicating with a service.
             */
            exports_1("UUID", UUID = "uuid");
            /**
             * An index of possible values to validate against.
             * @type {Array}
             */
            exports_1("All", All = Object.freeze([
                File, FTP, GOPHER, HTTP, HTTPS, LDAP, MAILTO, PIPE, TCP, NEWS, NNTP, TELNET, UUID
            ]));
        }
    };
});
//# sourceMappingURL=Scheme.js.map