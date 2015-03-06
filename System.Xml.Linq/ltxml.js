/*********************** API ***********************/
/*

***** Ltxml *****
* Ltxml.clearCache()

****************************************************
*===== XName =====
* new XName(namespace, name)      // namespace is an XNamespace object, name is string
* new XName(name)                 // name is string, is in no namespace
* new XName(name)                 // name = '{namespaceURI}name'
* XName.get(expandedName)
* XName.get(namespace, localName)
* XName.toString()

***** props implemented as fields *****
* XName.localName
* XName.namespace
* XName.namespaceName

****************************************************
*===== XNamespace =====
* new XNamespace(uri)
* XNamespace.get(uri)
* XNamespace.getName(localName)
* XNamespace.toString()

***** props implemented as fields *****
* XNamespace.namespaceName

***** static props *****
* XNamespace.getNone()               // returns namespace for 'no namespace'
* XNamespace.none

* XNamespace.getXml()                // http://www.w3.org/XML/1998/namespace
* XNamespace.xml

* XNamespace.getXmlns()              // http://www.w3.org/2000/xmlns/
* XNamespace.xmlns

****************************************************
*===== XObject (abstract) =====
* XObject.addAnnotation(type, object)  // type is string
* XObject.annotation(type)
* XObject.annotations(type)
* XObject.removeAnnotations
* XObject.removeAnnotations(type)

***** props implemented as fields *****
* XObject.nodeType
* XObject.parent

***** props *****
* XObject.getDocument()
* XObject.document

****************************************************
*===== XNode: XObject (abstract) =====
* XNode.addAfterSelf(varargs)
* XNode.addBeforeSelf(varargs)
* XNode.ancestors()
* XNode.ancestors(xname)
* XNode.deepEquals
* XNode.elementsAfterSelf()
* XNode.elementsAfterSelf(xname)
* XNode.elementsBeforeSelf()
* XNode.elementsBeforeSelf(xname)
* XNode.nodesAfterSelf()
* XNode.nodesBeforeSelf()
* XNode.remove()
* XNode.replaceWith(content)

***** props implemented as field *****
* XNode.nodeType
* XNode.parent

***** props *****
* XNode.getNextNode()
* XNode.nextNode

* XNode.getPreviousNode()
* XNode.previousNode

****************************************************
*===== XAttribute: XObject =====
* new XAttribute(name, value)
* new XAttribute(XAttribute)
* XAttribute.remove()
* XAttribute.setValue(value)
* XAttribute.toString()

***** props implemented as fields *****
* XAttribute.isNamespaceDeclaration
* XAttribute.name
* XAttribute.nodeType
* XAttribute.parent
* XAttribute.value

***** props *****
* XAttribute.getNextAttribute()
* XAttribute.nextAttribute

* XAttribute.getPreviousAttribute()
* XAttribute.previousAttribute

****************************************************
*===== XComment: XNode =====
* new XComment(value)
* new XComment(xcomment)
* XComment.toString()
* XComment.toString(indent)

***** props implemented as fields *****
* XComment.nodeType
* XComment.parent
* XComment.value

****************************************************
*===== XContainer: XNode =====
* XContainer.add(content)
* XContainer.addFirst(content)
* XContainer.descendantNodes
* XContainer.descendants()
* XContainer.descendants(xname)
* XContainer.element(xname)
* XContainer.elements()
* XContainer.elements(xname)
* XContainer.nodes()
* XContainer.removeNodes()
* XContainer.replaceNodes(content)

***** props implemented as fields *****
* XContainer.nodeType
* XContainer.parent

***** props *****
* XContainer.getFirstNode()
* XContainer.firstNode

* XContainer.getLastNode()
* XContainer.lastNode

****************************************************
*===== XDeclaration =====
* new XDeclaration(version, encoding, standalone)
* new XDeclaration(xdeclaration)
* XDeclaration.toString(indent)

***** props implemented as fields *****
* XDeclaration.encoding
* XDeclaration.standalone
* XDeclaration.version

****************************************************
*===== XDocument: XContainer =====
* new XDocument()
* new XDocument(content)
* new XDocument(xdocument)
* new XDocument(xdeclaration, content)
* XDocument.descendants()
* XDocument.descendants(xname)
* XDocument.parse(xml)
* XDocument.load(XMLDocument)
* XDocument.toString()
* XDocument.toString(indent)

***** props implemented as fields *****
* XDocument.nodeType
* XDocument.parent
* XDocument.declaration

***** props *****
* XDocument.getRoot()
* XDocument.root

****************************************************
*===== XElement: XContainer =====
* new XElement(xelement)          copy constructor
* new XElement(xname)
* new XElement(xname, varargs)
* XElement.ancestorsAndSelf()
* XElement.ancestorsAndSelf(xname)
* XElement.attribute(xname)
* XElement.attributes()
* XElement.attributes(xname)
* XElement.descendantNodesAndSelf()
* XElement.descendantsAndSelf()
* XElement.descendantsAndSelf(xname)
* XElement.getDefaultNamespace()
* XElement.getNamespaceOfPrefix()
* XElement.getPrefixOfNamespace()
* XElement.load(XMLDocument)
* XElement.parse()
* XElement.removeAll()
* XElement.removeAttributes()
* XElement.replaceAll(content)
* XElement.replaceAttributes(content)
* XElement.setAttributeValue(xname, value)
* XElement.setElementValue(xname, value)
* XElement.toString()
* XElement.toString(indent)

***** props implemented as fields *****
* XElement.name
* XElement.nodeType
* XElement.parent

***** props *****
* XElement.getFirstAttribute()
* XElement.firstAttribute

* XElement.getHasAttributes()
* XElement.hasAttributes

* XElement.getHasElements()
* XElement.hasElements

* XElement.getIsEmpty()
* XElement.isEmpty

* XElement.getLastAttribute()
* XElement.lastAttribute

* XElement.getValue
* XElement.setValue()
* XElement.value

****************************************************
*===== XProcessingInstruction: XNode =====
* new XProcessingInstruction(xprocessingInstruction)
* new XProcessingInstruction(target, data)
* XProcessingInstruction.toString()
* XProcessingInstruction.toString(indent)

***** props implemented as fields *****
* XProcessingInstruction.data
* XProcessingInstruction.nodeType
* XProcessingInstruction.parent
* XProcessingInstruction.target

****************************************************
*===== XText: XNode =====
* new XText(value)
* new XText(XText)
* XText.toString()

***** props implemented as fields *****
* XText.nodeType
* XText.parent
* XText.value

****************************************************
*===== XEntity: XNode =====
* new XEntity(value)
* new XEntity(XEntity)
* XEntity.toString()

***** props implemented as fields *****
* XEntity.nodeType
* XEntity.parent
* XEntity.value

****************************************************
*===== XCData: XText =====
* new XCData(value)
* new XCData(XCData)
* XCData.toString()

***** props implemented as fields *****
* XCData.nodeType
* XCData.parent
* XCData.value

****************************************************
*===== Extension methods =====
* ancestors()
* ancestors(xname)
* ancestorsAndSelf()
* ancestorsAndSelf(xname)
* attributes()
* attributes(xname)
* descendantNodes()
* descendantNodesAndSelf()
* descendants()
* descendants(xname)
* descendantsAndSelf()
* descendantsAndSelf(xname)
* elements()
* elements(xname)
* nodes()
* remove(xname)

*/

/*global window */
/*global Enumerable */
/*global Types*/
/*global root*/

(function (root) {  // root = global
    "use strict";

    var parseXml, Functions, Ltxml, addContentThatCanContainEntities,
        serializeAttributeContent, annotateRootForNamespaces,
        prefixCounter, entityCodePoints, entities;

    /********************** utility **********************/

    // if using JQuery
    // Enumerable = $.Enumerable;

    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) == '[object Array]'; //ignore jslint
        };
    }

    Functions = {
        Identity: function (x) { return x; },
        True: function () { return true; },
        Blank: function () { }
    };

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (item) {
            var i;

            for (i = 0; i < this.length; i += 1) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    /*ignore jslint start*/
    parseXml = function (xmlStr) {
        var domParser;

        if (typeof Ltxml.DOMParser !== "undefined") {
            domParser = (new Ltxml.DOMParser()).parseFromString(xmlStr, "application/xml");
            return domParser;
        }
        else if (typeof window.DOMParser !== "undefined") {
            //domParser = (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
            domParser = (new window.DOMParser()).parseFromString(xmlStr, "application/xml");
            return domParser;
        } else if (typeof window.ActiveXObject !== "undefined" &&
				new window.ActiveXObject("Microsoft.XMLDOM")) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        } else {
            throw new Error("No XML parser found");
        }
    };
    /*ignore jslint end*/

    /********************** global **********************/

    Ltxml = {};  // container(namespace)

    Ltxml.namespaceCache = {};
    Ltxml.nameCache = {};
    Ltxml.spaces = '                                             ' +
        '                                             ';
    function getStringBuilder() {
        var data, counter;

        data = [];
        counter = 0;
        return {
            a: function (s) { data[counter += 1] = s; return this; },  //ignore jslint
            toString: function (s) { return data.join(s || ""); }
        };
    }

    Ltxml.clearCache = function () {
        this.namespaceCache = {};
        this.nameCache = {};
    };

    Ltxml.cast = function (elementOrAttribute) {
        if (!elementOrAttribute) {
            return null;
        }
        return elementOrAttribute.value;
    };

    Ltxml.castInt = function (elementOrAttribute) {
        if (!elementOrAttribute) {
            return null;
        }
        return parseInt(elementOrAttribute.value, 10);
    };

    function addContent(xobj, putContentFunc, putAttributeFunc) {
        var t, ta, newEl, newTx, newCo, newCd, newAt, newPi, i, j, k;

        for (i = 3; i < arguments.length; i += 1) {
            t = arguments[i];
            if (t !== null && t !== undefined) {
                if (Array.isArray(t)) {
                    for (j = 0; j < t.length; j += 1) {
                        addContent(xobj, putContentFunc, putAttributeFunc, t[j]);
                    }
                } else if (t.select) {
                    ta = t.toArray();
                    for (k = 0; k < ta.length; k += 1) {
                        addContent(xobj, putContentFunc, putAttributeFunc, ta[k]);
                    }
                } else if (t.isXEnumerable) {
                    ta = t.asEnumerable().toArray();
                    for (k = 0; k < ta.length; k += 1) {
                        addContent(xobj, putContentFunc, putAttributeFunc, ta[k]);
                    }
                } else if (typeof t === 'object' && t.nodeType) {
                    if (t.nodeType === 'Element' ||
                            t.nodeType === 'Text' ||
                            t.nodeType === 'Comment' ||
                            t.nodeType === 'CDATA' ||
                            t.nodeType === 'ProcessingInstruction' ||
                            t.nodeType === 'Entity') {
                        if (t.parent && t.parent !== null) {
                            // then need to clone
                            if (t.nodeType === 'Element') {
                                newEl = new Ltxml.XElement(t);
                                newEl.parent = xobj;
                                putContentFunc(newEl);
                                return;
                            }
                            if (t.nodeType === 'Entity') {
                                newTx = new Ltxml.XEntity(t);
                                newTx.parent = xobj;
                                putContentFunc(newTx);
                                return;
                            }
                            if (t.nodeType === 'Text') {
                                newTx = new Ltxml.XText(t);
                                newTx.parent = xobj;
                                putContentFunc(newTx);
                                return;
                            }
                            if (t.nodeType === 'Comment') {
                                newCo = new Ltxml.XComment(t);
                                newCo.parent = xobj;
                                putContentFunc(newCo);
                                return;
                            }
                            if (t.nodeType === 'CDATA') {
                                newCd = new Ltxml.XCData(t);
                                newCd.parent = xobj;
                                putContentFunc(newCd);
                                return;
                            }
                            if (t.nodeType === 'ProcessingInstruction') {
                                newPi = new Ltxml.XProcessingInstruction(t);
                                newPi.parent = xobj;
                                putContentFunc(newPi);
                                return;
                            }
                        }
                        t.parent = xobj;
                        putContentFunc(t);
                        return;
                    }
                    if (t.nodeType === 'Attribute') {
                        if (t.parent && t.parent !== null) {
                            // then need to clone
                            newAt = new Ltxml.XAttribute(t);
                            newAt.parent = xobj;
                            putAttributeFunc(newAt);
                            return;
                        }
                        t.parent = xobj;
                        putAttributeFunc(t);
                        return;
                    }
                } else {
                    if (typeof t === 'string' && t === '') {
                        newTx = new Ltxml.XText('');
                        newTx.parent = xobj;
                        putContentFunc(newTx);
                        return;
                    }
                    addContentThatCanContainEntities(t.toString(), xobj, true, putContentFunc);
                }
            }
        }
    }

    entityCodePoints = [
        60,
        62,
        39,
        34,
        38
    /*,
    160,
    161,
    162,
    163,
    164,
    165,
    166,
    167,
    168,
    169,
    170,
    171,
    172,
    173,
    174,
    175,
    176,
    177,
    178,
    179,
    180,
    181,
    182,
    183,
    184,
    185,
    186,
    187,
    188,
    189,
    190,
    191,
    192,
    193,
    194,
    195,
    196,
    197,
    198,
    199,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    209,
    210,
    211,
    212,
    213,
    214,
    215,
    216,
    217,
    218,
    219,
    220,
    221,
    222,
    223,
    224,
    225,
    226,
    227,
    228,
    229,
    230,
    231,
    232,
    233,
    234,
    235,
    236,
    237,
    238,
    239,
    240,
    241,
    242,
    243,
    244,
    245,
    246,
    247,
    248,
    249,
    250,
    251,
    252,
    253,
    254,
    255,
    338,
    339,
    352,
    353,
    376,
    402,
    710,
    732,
    913,
    914,
    915,
    916,
    917,
    918,
    919,
    920,
    921,
    922,
    923,
    924,
    925,
    926,
    927,
    928,
    929,
    931,
    932,
    933,
    934,
    935,
    936,
    937,
    945,
    946,
    947,
    948,
    949,
    950,
    951,
    952,
    953,
    954,
    955,
    956,
    957,
    958,
    959,
    960,
    961,
    962,
    963,
    964,
    965,
    966,
    967,
    968,
    969,
    977,
    978,
    982,
    8194,
    8195,
    8201,
    8204,
    8205,
    8206,
    8207,
    8211,
    8212,
    8216,
    8217,
    8218,
    8220,
    8221,
    8222,
    8224,
    8225,
    8226,
    8230,
    8240,
    8242,
    8243,
    8249,
    8250,
    8254,
    8260,
    8364,
    8465,
    8472,
    8476,
    8482,
    8501,
    8592,
    8593,
    8594,
    8595,
    8596,
    8629,
    8656,
    8657,
    8658,
    8659,
    8660,
    8704,
    8706,
    8707,
    8709,
    8711,
    8712,
    8713,
    8715,
    8719,
    8721,
    8722,
    8727,
    8730,
    8733,
    8734,
    8736,
    8743,
    8744,
    8745,
    8746,
    8747,
    8756,
    8764,
    8773,
    8776,
    8800,
    8801,
    8804,
    8805,
    8834,
    8835,
    8836,
    8838,
    8839,
    8853,
    8855,
    8869,
    8901,
    8968,
    8969,
    8970,
    8971,
    9001,
    9002,
    9674,
    9824,
    9827,
    9829,
    9830 */
    ];

    entities = [
        "lt",
        "gt",
        "apos",
        "quot",
        "amp"
    /*,
    "nbsp",
    "iexcl",
    "cent",
    "pound",
    "curren",
    "yen",
    "brvbar",
    "sect",
    "uml",
    "copy",
    "ordf",
    "laquo",
    "not",
    "shy",
    "reg",
    "macr",
    "deg",
    "plusmn",
    "sup2",
    "sup3",
    "acute",
    "micro",
    "para",
    "middot",
    "cedil",
    "sup1",
    "ordm",
    "raquo",
    "frac14",
    "frac12",
    "frac34",
    "iquest",
    "Agrave",
    "Aacute",
    "Acirc",
    "Atilde",
    "Auml",
    "Aring",
    "AElig",
    "Ccedil",
    "Egrave",
    "Eacute",
    "Ecirc",
    "Euml",
    "Igrave",
    "Iacute",
    "Icirc",
    "Iuml",
    "ETH",
    "Ntilde",
    "Ograve",
    "Oacute",
    "Ocirc",
    "Otilde",
    "Ouml",
    "times",
    "Oslash",
    "Ugrave",
    "Uacute",
    "Ucirc",
    "Uuml",
    "Yacute",
    "THORN",
    "szlig",
    "agrave",
    "aacute",
    "acirc",
    "atilde",
    "auml",
    "aring",
    "aelig",
    "ccedil",
    "egrave",
    "eacute",
    "ecirc",
    "euml",
    "igrave",
    "iacute",
    "icirc",
    "iuml",
    "eth",
    "ntilde",
    "ograve",
    "oacute",
    "ocirc",
    "otilde",
    "ouml",
    "divide",
    "oslash",
    "ugrave",
    "uacute",
    "ucirc",
    "uuml",
    "yacute",
    "thorn",
    "yuml",
    "OElig",
    "oelig",
    "Scaron",
    "scaron",
    "Yuml",
    "fnof",
    "circ",
    "tilde",
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
    "Lambda",
    "Mu",
    "Nu",
    "Xi",
    "Omicron",
    "Pi",
    "Rho",
    "Sigma",
    "Tau",
    "Upsilon",
    "Phi",
    "Chi",
    "Psi",
    "Omega",
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "iota",
    "kappa",
    "lambda",
    "mu",
    "nu",
    "xi",
    "omicron",
    "pi",
    "rho",
    "sigmaf",
    "sigma",
    "tau",
    "upsilon",
    "phi",
    "chi",
    "psi",
    "omega",
    "thetasym",
    "upsih",
    "piv",
    "ensp",
    "emsp",
    "thinsp",
    "zwnj",
    "zwj",
    "lrm",
    "rlm",
    "ndash",
    "mdash",
    "lsquo",
    "rsquo",
    "sbquo",
    "ldquo",
    "rdquo",
    "bdquo",
    "dagger",
    "Dagger",
    "bull",
    "hellip",
    "permil",
    "prime",
    "Prime",
    "lsaquo",
    "rsaquo",
    "oline",
    "frasl",
    "euro",
    "image",
    "weierp",
    "real",
    "trade",
    "alefsym",
    "larr",
    "uarr",
    "rarr",
    "darr",
    "harr",
    "crarr",
    "lArr",
    "uArr",
    "rArr",
    "dArr",
    "hArr",
    "forall",
    "part",
    "exist",
    "empty",
    "nabla",
    "isin",
    "notin",
    "ni",
    "prod",
    "sum",
    "minus",
    "lowast",
    "radic",
    "prop",
    "infin",
    "ang",
    "and",
    "or",
    "cap",
    "cup",
    "int",
    "there4",
    "sim",
    "cong",
    "asymp",
    "ne",
    "equiv",
    "le",
    "ge",
    "sub",
    "sup",
    "nsub",
    "sube",
    "supe",
    "oplus",
    "otimes",
    "perp",
    "sdot",
    "lceil",
    "rceil",
    "lfloor",
    "rfloor",
    "lang",
    "rang",
    "loz",
    "spades",
    "clubs",
    "hearts",
    "diams"
    */
    ];

    addContentThatCanContainEntities = function (textToAdd, xobj, isElement, putContentFunc) {
        var xt, xe, ts, tc, length, char, ind;

        if (typeof textToAdd === 'string') {
            ts = 0;
            tc = 0;
            length = textToAdd.length;
            while (true) {
                if (tc === length) {
                    break;
                }
                char = textToAdd.charCodeAt(tc);
                if ((char >= 40 && char <= 59) ||
                    (char >= 63 && char <= 126)) {
                    tc++;
                    continue;
                }
                if (char >= 32 && char <= 126 &&
                    char !== 34 && char !== 38 && char !== 39 && char !== 60 && char !== 62) {
                    tc++;
                    continue;
                }
                if (char === 9 || char === 10 || char === 13) {
                    if (isElement) {
                        tc++;
                        continue;
                    }
                }
                if (char === 9 && !isElement) {
                    tc++;
                    continue;
                }
                if (char < 32) {
                    if (ts !== tc) {
                        if (isElement) {
                            xt = new Ltxml.XText(textToAdd.substring(ts, tc));
                            xt.parent = xobj;
                        }
                        else {
                            xt = textToAdd.substring(ts, tc);
                        }
                        putContentFunc(xt);
                    }
                    xe = new Ltxml.XEntity("#x" + char.toString(16));
                    xe.parent = xobj;
                    putContentFunc(xe);
                    tc++;
                    ts = tc;
                    continue;
                }
                ind = entityCodePoints.indexOf(char);
                if (ind === -1) {
                    tc++;
                    continue;
                }
                if (ts !== tc) {
                    if (isElement) {
                        xt = new Ltxml.XText(textToAdd.substring(ts, tc));
                        xt.parent = xobj;
                    }
                    else {
                        xt = textToAdd.substring(ts, tc);
                    }
                    putContentFunc(xt);
                }
                xe = new Ltxml.XEntity(entities[ind]);
                xe.parent = xobj;
                putContentFunc(xe);
                tc++;
                ts = tc;
            }
            if (ts !== tc) {
                if (isElement) {
                    xt = new Ltxml.XText(textToAdd.substring(ts, tc));
                    xt.parent = xobj;
                }
                else {
                    xt = textToAdd.substring(ts, tc);
                }
                putContentFunc(xt);
            }
            return;
        }
        if (isElement) {
            xt = new Ltxml.XText(textToAdd);
            xt.parent = xobj;
            putContentFunc(xt);
        }
        else {
            putContentFunc(textToAdd);
        }
        return;
    };

    /********************** XNamespace **********************/

    // takes a string, returns an atomized object
    Ltxml.XNamespace = function (namespace, prefix) {
        var namespaceCache, nso, ns;

        namespaceCache = Ltxml.namespaceCache;

        if (prefix === null) {
            prefix = undefined;
        }
        if (namespaceCache[namespace] === undefined) {
            nso = {
                namespaceName: namespace,
                preferredPrefix: prefix,
                getName: Ltxml.XNamespace.getName,
                toString: Ltxml.XNamespace.toString
            };
            namespaceCache[namespace] = nso;
            return nso;
        }
        ns = namespaceCache[namespace];
        if (!ns.preferredPrefix && prefix !== null) {
            ns.preferredPrefix = prefix;
        }
        return ns;
    };

    Ltxml.XNamespace.getName = function (name) {
        return new Ltxml.XName(this.namespaceName, name);
    };

    Ltxml.XNamespace.toString = function () {
        if (this === Ltxml.XNamespace.getNone()) {
            return "";
        }
        return "{" + this.namespaceName + "}";
    };

    Ltxml.XNamespace.getNone = function () {
        var namespaceCache, namespace, nso;

        namespaceCache = Ltxml.namespaceCache;
        namespace = '__none';
        if (namespaceCache[namespace] === undefined) {
            nso = {
                namespaceName: namespace,
                preferredPrefix: '',
                getName: Ltxml.XNamespace.getName,
                toString: Ltxml.XNamespace.toString
            };
            namespaceCache[namespace] = nso;
            return nso;
        }
        return namespaceCache[namespace];
    };

    Ltxml.XNamespace.get = function (uri) {
        return new Ltxml.XNamespace(uri);
    };

    Ltxml.XNamespace.getXml = function () {
        return new Ltxml.XNamespace("http://www.w3.org/XML/1998/namespace", "xml");
    };

    Ltxml.XNamespace.getXmlns = function () {
        return new Ltxml.XNamespace("http://www.w3.org/2000/xmlns/", "xmlns");
    };

    if (Object.defineProperties) {

        Object.defineProperty(Ltxml.XNamespace, "none", {
            get: function () {
                return Ltxml.XNamespace.getNone();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XNamespace, "xml", {
            get: function () {
                return Ltxml.XNamespace.getXml();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XNamespace, "xmlns", {
            get: function () {
                return Ltxml.XNamespace.getXmlns();
            },
            enumerable: true,
            configurable: true
        });

    }

    /********************** XName **********************/

    // for namespace, takes either a string or an atomized XNamespace object.
    // for name, takes a string
    Ltxml.XName = function (arg1, arg2) {
        var nameCache, expandedNamespaceObject, expandedNamespaceQName,
            namespaceOfExpandedName, noNamespaceObject, noNamespaceQName,
            noNamespaceNameObject, namespaceObject, namespaceQName,
            namespaceNameObject, indexOfClosingBrace;

        nameCache = Ltxml.nameCache;

        if (typeof arg1 === 'string' && arg2 === undefined && arg1.charAt(0) === '{') {
            indexOfClosingBrace = arg1.indexOf('}');
            namespaceOfExpandedName = arg1.substring(1, indexOfClosingBrace);
            expandedNamespaceObject = new Ltxml.XNamespace(namespaceOfExpandedName);
            arg2 = arg1.substring(indexOfClosingBrace + 1);
            expandedNamespaceQName = "{" + namespaceOfExpandedName + "}" + arg2;
            if (nameCache[expandedNamespaceQName] === undefined) {
                nameCache[expandedNamespaceQName] = {
                    namespace: expandedNamespaceObject,
                    namespaceName: namespaceOfExpandedName,
                    localName: arg2,
                    toString: Ltxml.XName.toString
                };
                return nameCache[expandedNamespaceQName];
            }
            return nameCache[expandedNamespaceQName];
        }

        if (typeof arg1 === 'string' && arg2 === undefined) {
            noNamespaceObject = Ltxml.XNamespace.getNone();
            noNamespaceQName = "{" + noNamespaceObject.namespaceName + "}" + arg1;
            if (nameCache[noNamespaceQName] === undefined) {
                noNamespaceNameObject = {
                    namespace: noNamespaceObject,
                    namespaceName: '',
                    localName: arg1,
                    toString: Ltxml.XName.toString
                };
                nameCache[noNamespaceQName] = noNamespaceNameObject;
                return noNamespaceNameObject;
            }
            return nameCache[noNamespaceQName];
        }

        namespaceObject = arg1;
        if (typeof arg1 !== 'object') {
            namespaceObject = Ltxml.XNamespace(arg1);
        }
        namespaceQName = "{" + namespaceObject.namespaceName + "}" + arg2;
        if (nameCache[namespaceQName] === undefined) {
            namespaceNameObject = {
                namespace: namespaceObject,
                namespaceName: namespaceObject.namespaceName,
                localName: arg2,
                toString: Ltxml.XName.toString
            };
            nameCache[namespaceQName] = namespaceNameObject;
            return namespaceNameObject;
        }
        return nameCache[namespaceQName];
    };

    Ltxml.XName.toString = function () {
        return this.namespace + this.localName;
    };

    Ltxml.XName.qualify = function (xname, element, isAttribute) {
        if (xname.namespace === Ltxml.XNamespace.getNone()) {
            return xname.localName;
        }
        var prefix = element.getPrefixOfNamespace(xname.namespace, isAttribute);
        if (prefix === '') {
            return xname.localName;
        }
        return prefix + ":" + xname.localName;
    };

    Ltxml.XName.get = function (arg1, arg2) {
        var xn;

        if (typeof arg1 === 'string' && arg2 === undefined) {
            xn = new Ltxml.XName(arg1);
            return xn;
        }
        if ((typeof arg1 === 'string' || arg1.namespaceName) &&
                typeof arg2 === 'string') {
            xn = new Ltxml.XName(arg1, arg2);
            return xn;
        }
        throw 'XName.get: invalid arguments';
    };

    /********************** XObject **********************/

    Ltxml.XObject = function () { };

    Ltxml.XObject.prototype.addAnnotation = function (type, object) {
        if (!object) {
            object = {};
        }
        this.annotationsArray.push({
            Type: type,
            Object: object
        });
    };

    Ltxml.XObject.prototype.annotation = function (type) {
        var i;

        for (i = 0; i < this.annotationsArray.length; i += 1) {
            if (this.annotationsArray[i].Type === type) {
                return this.annotationsArray[i].Object;
            }
        }
        return null;
    };

    Ltxml.XObject.prototype.annotations = function (type) {
        var retVal, i;

        retVal = [];
        for (i = 0; i < this.annotationsArray.length; i += 1) {
            if (type === undefined || this.annotationsArray[i].Type === type) {
                retVal.push(this.annotationsArray[i].Object);
            }
        }
        return Enumerable.from(retVal);
    };

    Ltxml.XObject.prototype.removeAnnotations = function (type) {
        var j;

        if (type === undefined) {
            this.annotationsArray = [];
        } else {
            while (true) {
                for (j = 0; j < this.annotationsArray.length; j += 1) {
                    if (this.annotationsArray[j].Type === type) {
                        break;
                    }
                }
                if (j === this.annotationsArray.length) {
                    break;
                }
                this.annotationsArray.splice(j, 1);
            }
        }
    };

    Ltxml.XObject.prototype.getDocument = function () {
        var current = this;

        while (true) {
            if (current.nodeType === 'Document') {
                return current;
            }
            current = current.parent;
            if (current === null) {
                return null;
            }
        }
    };

    if (Object.defineProperties) {

        Object.defineProperty(Ltxml.XObject.prototype, "document", {
            get: function () {
                return this.getDocument();
            },
            enumerable: true,
            configurable: true
        });

    }

    /********************** XNode: XObject **********************/

    Ltxml.XNode = function () { };

    Ltxml.XNode.prototype = new Ltxml.XObject();

    Ltxml.XNode.prototype.addAfterSelf = function () {
        var indexOfSelf, args, contentToInsert, newContent, i, z;

        args = [];
        newContent = [];

        if (this.parent === null) {
            throw "addAfterSelf: no parent element";
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        args = [];
        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        contentToInsert = [];
        addContent(this,
            function (c) { contentToInsert.push(c); },
            function () { throw "addAfterSelf: invalid content"; },
            args);
        newContent = this.parent.nodesArray.slice(0, indexOfSelf + 1)
            .concat(contentToInsert)
            .concat(this.parent.nodesArray.slice(indexOfSelf + 1));
        for (z = 0; z < newContent.length; z += 1) {
            newContent[z].parent = this.parent;
        }
        this.parent.nodesArray = newContent;
    };

    Ltxml.XNode.prototype.addBeforeSelf = function () {
        var indexOfSelf, args, contentToInsert, newContent, i, z;

        args = [];
        contentToInsert = [];
        newContent = [];

        if (this.parent === null) {
            throw "addBeforeSelf: no parent element";
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        args = [];
        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        contentToInsert = [];
        addContent(this,
            function (c) { contentToInsert.push(c); },
            function () { throw "addBeforeSelf: invalid content"; },
            args);
        newContent = this.parent.nodesArray.slice(0, indexOfSelf)
            .concat(contentToInsert)
            .concat(this.parent.nodesArray.slice(indexOfSelf));
        for (z = 0; z < newContent.length; z += 1) {
            newContent[z].parent = this.parent;
        }
        this.parent.nodesArray = newContent;
    };

    Ltxml.XNode.prototype.CompareDocumentOrder = function () {
        throw "Not implemented";
    };

    Ltxml.XNode.prototype.deepEquals = function (other) {
        var atts1, atts2, nodes1, nodes2;

        if (this.nodeType !== other.nodeType) {
            return false;
        }
        if (this.nodeType === 'Element' && this.name !== other.name) {
            return false;
        }
        if (this.nodeType === 'Comment' ||
                this.nodeType === 'Text' ||
                this.nodeType === 'CData' ||
                this.nodeType === 'ProcessingInstruction' ||
                this.nodeType === 'Entity') {
            return this.value === other.value;
        }
        if (this.attributesArray.length !== other.attributesArray.length) {
            return false;
        }

        if (this.attributesArray.length !== 0) {
            atts1 = Enumerable
                .from(this.attributesArray)
                .where(function (a) {
                    return !a.isNamespaceDeclaration;
                })
                .orderBy("k=>k.name");
            atts2 = Enumerable
                .from(other.attributesArray)
                .where(function (a) {
                    return !a.isNamespaceDeclaration;
                })
                .orderBy("k=>k.name");
            // in following lambda, return true if any do NOT match
            if (atts1.zip(atts2, function (a, b) {
                return {
                    att1: a,
                    att2: b
                };
            })
                .any(function (p) {
                    if (p.att1.name !== p.att2.name) {
                        return true;
                    }
                    if (p.att1.value !== p.att2.value) {
                        return true;
                    }
                    return false;
                })) {
                return false;
            }
        }
        if (this.nodesArray.length !== other.nodesArray.length) {
            return false;
        }
        if (this.nodesArray.length === 0 && other.nodesArray.length === 0) {
            return true;
        }
        nodes1 = Enumerable.from(this.nodesArray);
        nodes2 = Enumerable.from(other.nodesArray);
        if (nodes1
            .zip(nodes2, function (a, b) {
                return {
                    node1: a,
                    node2: b
                };
            })
            .any(function (z) { return !z.node1.deepEquals(z.node2); })) {
            return false;
        }
        return true;
    };

    Ltxml.XNode.prototype.isAfter = function () {
        throw "Not implemented";
    };

    Ltxml.XNode.prototype.isBefore = function () {
        throw "Not implemented";
    };

    Ltxml.XNode.prototype.getNextNode = function () {
        var indexOfSelf;

        if (this.parent === null) {
            throw "getNextNode: no parent element";
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        if (indexOfSelf < this.parent.nodesArray.length - 2) {
            return this.parent.nodesArray[indexOfSelf + 1];
        }
        return null;
    };

    Ltxml.XNode.prototype.remove = function () {
        var indexOfSelf, newContent;

        if (this.parent === null) {
            throw "remove: no parent element";
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        newContent = this.parent
            .nodesArray
            .slice(0, indexOfSelf)
            .concat(this.parent.nodesArray.slice(indexOfSelf + 1));
        this.parent.nodesArray = newContent;
    };

    Ltxml.XNode.prototype.replaceWith = function () {
        var indexOfSelf, newContent, args, contentToInsert, i, z;

        args = [];
        contentToInsert = [];
        if (this.parent === null) {
            throw "replaceWith: no parent element";
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        args = [];
        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        contentToInsert = [];
        addContent(this,
            function (c) { contentToInsert.push(c); },
            function () { throw "replaceWith: invalid content"; },
            args);
        newContent = this.parent
            .nodesArray
            .slice(0, indexOfSelf)
            .concat(contentToInsert)
            .concat(this.parent.nodesArray.slice(indexOfSelf + 1));
        for (z = 0; z < newContent.length; z += 1) {
            newContent[z].parent = this.parent;
        }
        this.parent.nodesArray = newContent;
    };

    Ltxml.XNode.prototype.getPreviousNode = function () {
        var indexOfSelf;

        if (this.parent === null) {
            throw "previousNode: no parent element";
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        if (indexOfSelf > 0) {
            return this.parent.nodesArray[indexOfSelf - 1];
        }
        return null;
    };

    // xname optional
    Ltxml.XNode.prototype.ancestors = function (xname) {
        var self, result, current;

        self = this;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }

        if (this.lazy) {
            return Enumerable.Utils.createEnumerable(function () {
                var current;

                return Enumerable.Utils.createEnumerator(
                    function () {
                        current = self.parent;
                    },  // initialize
                    function () { // tryGetNext
                        while (current !== null) {
                            if (xname && current.name !== xname) {
                                current = current.parent;
                            } else {
                                var thisOne = current;
                                current = current.parent;
                                return this.yieldReturn(thisOne);
                            }
                        }
                        return this.yieldBreak();
                    },
                    Functions.Blank
                );
            });
        }
        result = [];
        current = this.parent;
        if (xname === undefined) {
            while (current !== null) {
                result.push(current);
                current = current.parent;
            }
            return Enumerable.from(result);
        }
        while (current !== null) {
            if (current.name === xname) {
                result.push(current);
            }
            current = current.parent;
        }
        return Enumerable.from(result);
    };

    Ltxml.XNode.prototype.nodesAfterSelf = function () {
        var indexOfSelf, returnValue, self;

        self = this;
        if (this.parent === null) {
            throw "nodesAfterSelf: no parent element";
        }

        if (this.lazy) {
            return Enumerable.Utils.createEnumerable(function () {
                var i, length, parent;

                return Enumerable.Utils.createEnumerator(
                    function () {
                        parent = self.parent;
                        i = parent.nodesArray.indexOf(self) + 1;
                        length = parent.nodesArray.length;
                    },  // initialize
                    function () { // tryGetNext
                        var n;

                        while (i < length) {
                            n = parent.nodesArray[i];
                            i += 1;
                            return this.yieldReturn(n);  //ignore jslint
                        }
                        return this.yieldBreak();
                    },
                    Functions.Blank
                );
            });
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        returnValue = Enumerable
            .from(this.parent.nodesArray.slice(indexOfSelf + 1));
        return returnValue;
    };

    Ltxml.XNode.prototype.nodesBeforeSelf = function () {
        var indexOfSelf, returnValue, self;

        self = this;
        if (this.parent === null) {
            throw "nodesBeforeSelf: no parent element";
        }

        if (this.lazy) {
            return Enumerable.Utils.createEnumerable(function () {
                var parent, i, selfIndex;

                return Enumerable.Utils.createEnumerator(
                    function () {
                        parent = self.parent;
                        i = 0;
                        selfIndex = parent.nodesArray.indexOf(self);
                    },  // initialize
                    function () { // tryGetNext
                        var n;

                        while (i < selfIndex) {
                            n = parent.nodesArray[i];
                            i += 1;
                            return this.yieldReturn(n);  //ignore jslint
                        }
                        return this.yieldBreak();
                    },
                    Functions.Blank
                );
            });
        }
        if (this.parent === null) {
            throw "nodesBeforeSelf: no parent element";
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        returnValue = Enumerable
            .from(this.parent.nodesArray.slice(0, indexOfSelf));
        return returnValue;
    };

    // xname optional
    Ltxml.XNode.prototype.elementsAfterSelf = function (xname) {
        var indexOfSelf, returnValue, self;

        self = this;
        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        if (this.parent === null) {
            throw "elementsAfterSelf: no parent element";
        }

        if (this.lazy) {
            return Enumerable.Utils.createEnumerable(function () {
                var i, length, parent;

                return Enumerable.Utils.createEnumerator(
                    function () {
                        parent = self.parent;
                        i = parent.nodesArray.indexOf(self) + 1;
                        length = parent.nodesArray.length;
                    },  // initialize
                    function () { // tryGetNext
                        while (i < length) {
                            var n = parent.nodesArray[i];
                            if (n.nodeType !== 'Element' || (xname && n.name !== xname)) {
                                i += 1;
                            }
                            else {
                                i += 1;
                                return this.yieldReturn(n);
                            }
                        }
                        return this.yieldBreak();
                    },
                    Functions.Blank
                );
            });
        }

        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        returnValue = Enumerable
            .from(this.parent.nodesArray.slice(indexOfSelf + 1))
            .where(function (e) { return e.nodeType === 'Element'; });
        if (xname) {
            returnValue = returnValue.where(function (e) { return e.name === xname; });
        }
        return returnValue;
    };

    // xname is optional
    Ltxml.XNode.prototype.elementsBeforeSelf = function (xname) {
        var indexOfSelf, returnValue, self;

        self = this;
        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        if (this.parent === null) {
            throw "elementsBeforeSelf: no parent element";
        }

        if (this.lazy) {
            return Enumerable.Utils.createEnumerable(function () {
                var parent, i, selfIndex;

                return Enumerable.Utils.createEnumerator(
                    function () {
                        parent = self.parent;
                        i = 0;
                        selfIndex = parent.nodesArray.indexOf(self);
                    },  // initialize
                    function () { // tryGetNext
                        var n;

                        while (i < selfIndex) {
                            n = parent.nodesArray[i];
                            if (n.nodeType !== 'Element' || (xname && n.name !== xname)) {
                                i += 1;
                            }
                            else {
                                i += 1;
                                return this.yieldReturn(n);
                            }
                        }
                        return this.yieldBreak();
                    },
                    Functions.Blank
                );
            });
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        returnValue = Enumerable
            .from(this.parent.nodesArray.slice(0, indexOfSelf))
            .where(function (e) { return e.nodeType === 'Element'; });
        if (xname) {
            returnValue = returnValue.where(function (e) { return e.name === xname; });
        }
        return returnValue;
    };

    // xname is optional
    Ltxml.XNode.prototype.elementsBeforeSelfReverseDocumentOrder = function (xname) {
        var indexOfSelf, returnValue, self;

        self = this;
        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        if (this.parent === null) {
            throw "elementsBeforeSelfReverseDocumentOrder: no parent element";
        }

        if (this.lazy) {
            return Enumerable.Utils.createEnumerable(function () {
                var parent, i;

                return Enumerable.Utils.createEnumerator(
                    function () {
                        parent = self.parent;
                        i = parent.nodesArray.indexOf(self) - 1;
                    },  // initialize
                    function () { // tryGetNext
                        while (i >= 0) {
                            var n = parent.nodesArray[i];
                            if (n.nodeType !== 'Element' || (xname && n.name !== xname)) {
                                i -= 1;
                            }
                            else {
                                i -= 1;
                                return this.yieldReturn(n);
                            }
                        }
                        return this.yieldBreak();
                    },
                    Functions.Blank
                );
            });
        }
        indexOfSelf = this.parent.nodesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        returnValue = Enumerable
            .from(this.parent.nodesArray.slice(0, indexOfSelf))
            .where(function (e) { return e.nodeType === 'Element'; })
            .reverse();
        if (xname) {
            returnValue = returnValue.where(function (e) { return e.name === xname; });
        }
        return returnValue;
    };

    if (Object.defineProperties) {

        Object.defineProperty(Ltxml.XNode.prototype, "previousNode", {
            get: function () {
                return this.getPreviousNode();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XNode.prototype, "nextNode", {
            get: function () {
                return this.getNextNode();
            },
            enumerable: true,
            configurable: true
        });

    }

    /********************** XAttribute: XObject **********************/

    Ltxml.XAttribute = function (arg1, arg2) {
        var xnameObj, attContent, i, xmlns;

        this.nodeType = 'Attribute';
        this.simpleValue = null;
        this.attributeNodesArray = null;
        this.isNamespaceDeclaration = false;
        this.name = null;

        if (Object.defineProperties) {

            Object.defineProperty(this, "value", {
                get: Ltxml.XAttribute.prototype.getValue,
                set: Ltxml.XAttribute.prototype.setValue,
                enumerable: true,
                configurable: true
            });

        }

        if (arg1.nodeType && arg1.nodeType === 'Attribute') {
            if (arg2 !== undefined) {
                throw "XAttribute constructor: invalid arguments";
            }
            this.isNamespaceDeclaration = arg1.isNamespaceDeclaration;
            if (arg1.simpleValue !== null && arg1.simpleValue !== undefined) {
                this.simpleValue = arg1.simpleValue;
            }
            else {
                attContent = [];
                for (i = 0; i < arg1.attributeNodesArray.length; i += 1) {
                    attContent.push(arg1.attributeNodesArray[i]);
                }
                this.attributeNodesArray = attContent;
            }
            this.name = arg1.name;
            return;
        }

        if (arg2 === undefined) {
            throw "XAttribute constructor: invalid arguments";
        }

        // external properties
        if (arg2.namespaceName) {
            this.attributeNodesArray = [arg2.namespaceName];
        }
        else {
            attContent = [];
            addContentThatCanContainEntities(arg2.toString(), this, false, function (c) {
                attContent.push(c);
            });
            if (attContent.length === 1) {
                this.simpleValue = attContent[0];
            }
            else {
                this.attributeNodesArray = attContent;
            }
        }

        // constructor
        xnameObj = arg1;
        xmlns = Ltxml.XNamespace.getXmlns();
        if (typeof arg1 === 'string') {
            if (arg1 === "xmlns") {
                xnameObj = new Ltxml.XName(xmlns + "xmlns");
            }
            else {
                xnameObj = new Ltxml.XName(arg1);
            }
        }
        this.isNamespaceDeclaration = xnameObj.namespace === xmlns;
        this.name = xnameObj;
    };

    Ltxml.XAttribute.prototype = new Ltxml.XObject();

    serializeAttributeContent = function (a, o) {
        var na, i;

        if (a.simpleValue !== null && a.simpleValue !== undefined) {
            o.a(a.simpleValue);
        }
        else {
            na = a.attributeNodesArray;
            for (i = 0; i < na.length; i += 1) {
                if (na[i].nodeType) {
                    na[i].serialize(o);
                }
                else {
                    o.a(na[i]);
                }
            }
        }
    };

    Ltxml.XAttribute.prototype.serialize = function (o) {
        if (this.name.namespace === Ltxml.XNamespace.getXmlns()) {
            if (this.name.localName === 'xmlns') {
                o.a("xmlns='");
                serializeAttributeContent(this, o);
                o.a("'");
                return;
            }
            o.a("xmlns:").a(this.name.localName).a("='");
            serializeAttributeContent(this, o);
            o.a("'");
            return;
        }
        if (this.name.namespace === Ltxml.XNamespace.getNone()) {
            o.a(this.name.localName).a("='");
            serializeAttributeContent(this, o);
            o.a("'");
            return;
        }
        if (this.name.namespace === Ltxml.XNamespace.getXml()) {
            if (typeof this.value === "string") {
                o.a("xml:")
                    .a(this.name.localName)
                    .a("='");
                serializeAttributeContent(this, o);
                o.a("'");
            }
            else {
                o.a("xml:")
                    .a(this.name.localName)
                    .a("='");
                serializeAttributeContent(this, o);
                o.a("'");
            }
            return;
        }
        o.a(Ltxml.XName.qualify(this.name, this.parent, true)).a("='");
        serializeAttributeContent(this, o);
        o.a("'");
        return;
    };

    Ltxml.XAttribute.prototype.toString = function () {
        var o = getStringBuilder();
        this.serialize(o);
        return o.toString();
    };

    Ltxml.XAttribute.prototype.remove = function () {
        var indexOfSelf, newAtts;

        newAtts = [];
        if (this.parent === null) {
            throw "XAttribute.remove: no parent element";
        }
        indexOfSelf = this.parent.attributesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        newAtts = this.parent
            .attributesArray
            .slice(0, indexOfSelf)
            .concat(this.parent.attributesArray.slice(indexOfSelf + 1));
        this.parent.attributesArray = newAtts;
    };

    Ltxml.XAttribute.prototype.setValue = function (value) {
        var newContent = [];
        addContentThatCanContainEntities(value.toString(), this, false, function (a) {
            newContent.push(a);
        });
        if (newContent.length === 1) {
            this.simpleValue = newContent[0];
        }
        else {
            this.attributeNodesArray = newContent;
        }
    };

    Ltxml.XAttribute.prototype.getValue = function () {
        var o, s;

        o = getStringBuilder();
        serializeAttributeContent(this, o);
        s = o.toString();
        return s;
    };

    Ltxml.XAttribute.prototype.getNextAttribute = function () {
        var indexOfSelf;

        if (this.parent === null) {
            throw "getNextAttribute: no parent element";
        }
        indexOfSelf = this.parent.attributesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        if (indexOfSelf < this.parent.attributesArray.length - 2) {
            return this.parent.attributesArray[indexOfSelf + 1];
        }
        return null;
    };

    Ltxml.XAttribute.prototype.getPreviousAttribute = function () {
        var indexOfSelf;

        if (!this.parent) {
            throw "getPreviousAttribute: no parent element";
        }
        indexOfSelf = this.parent.attributesArray.indexOf(this);
        if (indexOfSelf === -1) {
            throw "Internal Error";
        }
        if (indexOfSelf > 0) {
            return this.parent.attributesArray[indexOfSelf - 1];
        }
        return null;
    };

    if (Object.defineProperties) {

        Object.defineProperty(Ltxml.XAttribute.prototype, "previousAttribute", {
            get: function () {
                return this.getPreviousAttribute();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XAttribute.prototype, "nextAttribute", {
            get: function () {
                return this.getNextAttribute();
            },
            enumerable: true,
            configurable: true
        });

    }

    /********************** XComment: XNode **********************/

    Ltxml.XComment = function (arg1) {
        this.nodeType = 'Comment';
        this.parent = null;

        if (arg1.nodeType && arg1.nodeType === 'Comment') {
            // copy constructor
            this.value = arg1.value.toString();
        }
        else {
            this.value = arg1.toString();
        }
    };

    Ltxml.XComment.prototype = new Ltxml.XNode();

    Ltxml.XComment.prototype.serialize = function (o, indent, depth) {
        var indent_spaces;

        if (!depth) {
            depth = 0;
        }
        if (indent) {
            indent_spaces = Ltxml.spaces.substring(0, depth);
            o.a(indent_spaces).a("<!--").a(this.value).a("-->\n");
            return;
        }
        o.a('<!--').a(this.value).a('-->');
        return;
    };

    Ltxml.XComment.prototype.toString = function (indent) {
        var o = getStringBuilder();
        this.serialize(o, indent);
        return o.toString();
    };

    /********************** XContainer: XNode **********************/

    Ltxml.XContainer = function () { };

    Ltxml.XContainer.prototype = new Ltxml.XNode();

    Ltxml.XContainer.prototype.add = function () {
        var nodesToInsert, attributesToInsert, args, i, newNodes, newAttributes;

        nodesToInsert = [];
        attributesToInsert = [];
        args = [];

        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        nodesToInsert = [];
        addContent(this,
            function (c) { nodesToInsert.push(c); },
            function (a) { attributesToInsert.push(a); },
            args);
        newNodes = this.nodesArray.concat(nodesToInsert);
        newAttributes = this.attributesArray.concat(attributesToInsert);
        this.nodesArray = newNodes;
        this.attributesArray = newAttributes;
    };

    Ltxml.XContainer.prototype.addFirst = function () {
        var nodesToInsert, attributesToInsert, args, i, newNodes, newAttributes;

        nodesToInsert = [];
        attributesToInsert = [];
        args = [];
        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        nodesToInsert = [];
        addContent(this,
            function (c) { nodesToInsert.push(c); },
            function (a) { attributesToInsert.push(a); },
            args);
        newNodes = nodesToInsert.concat(this.nodesArray);
        newAttributes = this.attributesArray.concat(attributesToInsert);
        this.nodesArray = newNodes;
        this.attributesArray = newAttributes;
    };

    Ltxml.XContainer.prototype.element = function (name) {
        var i, length;

        if (typeof name === 'string') {
            name = new Ltxml.XName(name);
        }
        length = this.nodesArray.length;
        for (i = 0; i < length; i += 1) {
            if (this.nodesArray[i].name === name) {
                return this.nodesArray[i];
            }
        }
        return null;
    };

    Ltxml.XContainer.prototype.nodes = function () {
        return Enumerable.from(this.nodesArray);
    };

    Ltxml.XContainer.prototype.removeNodes = function () {
        this.nodesArray = [];
    };

    Ltxml.XContainer.prototype.replaceNodes = function () {
        var nodesToInsert, attributesToInsert, args, i, newAttributes;

        nodesToInsert = [];
        attributesToInsert = [];
        args = [];
        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        addContent(this,
            function (c) { nodesToInsert.push(c); },
            function (a) { attributesToInsert.push(a); },
            args);
        newAttributes = this.attributesArray.concat(attributesToInsert);
        this.nodesArray = nodesToInsert;
        this.attributesArray = newAttributes;
    };

    Ltxml.XContainer.prototype.getFirstNode = function () {
        if (this.nodesArray.length >= 1) {
            return this.nodesArray[0];
        }
        return null;
    };

    Ltxml.XContainer.prototype.getLastNode = function () {
        if (this.nodesArray.length >= 1) {
            return this.nodesArray[this.nodesArray.length - 1];
        }
        return null;
    };

    function descendantNodesHelper(element, pushFunc) {
        var i;

        for (i = 0; i < element.nodesArray.length; i += 1) {
            pushFunc(element.nodesArray[i]);
            if (element.nodesArray[i].nodeType === 'Element') {
                descendantNodesHelper(element.nodesArray[i], pushFunc);
            }
        }
    }

    Ltxml.XContainer.prototype.descendantNodes = function () {
        var result, returnValue;

        if (this.lazy) {
            returnValue = Enumerable
                .from(this.nodesArray)
                .traverseDepthFirst(function (node) {
                    return Enumerable.from(node.nodesArray);
                });
            return returnValue;
        }
        result = [];
        descendantNodesHelper(this, function (e) { result.push(e); });
        return Enumerable.from(result);
    };

    function lazyDescendantHelper(container, xname) {
        var returnValue = Enumerable
            .from(container.nodesArray)
            .traverseDepthFirst(function (node) {
                return Enumerable.from(node.nodesArray).where(function (node) {
                    return node.nodeType === 'Element';
                });
            })
            .where(function (node) { return node.nodeType === 'Element'; });
        if (xname) {
            returnValue = returnValue.where(function (e) { return e.name === xname; });
        }
        return returnValue;
    }

    function eagarDescendantHelper(container, xname, pushFunc) {
        var i;

        for (i = 0; i < container.nodesArray.length; i += 1) {
            if (container.nodesArray[i].nodeType === 'Element') {
                if (xname === undefined) {
                    pushFunc(container.nodesArray[i]);
                    eagarDescendantHelper(container.nodesArray[i], xname, pushFunc);
                }
                else {
                    if (container.nodesArray[i].name === xname) {
                        pushFunc(container.nodesArray[i]);
                    }
                    eagarDescendantHelper(container.nodesArray[i], xname, pushFunc);
                }
            }
        }
    }

    // xname optional
    Ltxml.XContainer.prototype.descendants = function (xname) {
        var result;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        if (this.lazy) {
            return lazyDescendantHelper(this, xname);
        }
        result = [];
        eagarDescendantHelper(this, xname, function (e) { result.push(e); });
        return Enumerable.from(result);
    };

    // xname optional
    Ltxml.XContainer.prototype.elements = function (xname) {
        var returnValue, self;

        self = this;
        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }

        if (this.lazy) {
            return Enumerable.Utils.createEnumerable(function () {
                var i, length;

                return Enumerable.Utils.createEnumerator(
                    function () {
                        i = 0;
                        length = self.nodesArray.length;
                    },  // initialize
                    function () { // tryGetNext
                        while (i < length) {
                            var n = self.nodesArray[i];
                            if (n.nodeType !== 'Element' || (xname && n.name !== xname)) {
                                i += 1;
                            }
                            else {
                                i += 1;
                                return this.yieldReturn(n);
                            }
                        }
                        return this.yieldBreak();
                    },
                    Functions.Blank
                );
            });
        }
        returnValue = Enumerable
            .from(this.nodesArray)
            .where(function (e) { return e.nodeType === 'Element'; });
        if (xname) {
            returnValue = returnValue.where(function (e) {
                return e.name === xname;
            });
        }
        return returnValue;
    };

    if (Object.defineProperties) {

        Object.defineProperty(Ltxml.XContainer.prototype, "firstNode", {
            get: function () {
                return this.getFirstNode();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XContainer.prototype, "lastNode", {
            get: function () {
                return this.getLastNode();
            },
            enumerable: true,
            configurable: true
        });

    }

    /*********************** XDeclaration ***********************/

    //new XDeclaration(version, encoding, standalone)
    //new XDeclaration(xdeclaration)
    Ltxml.XDeclaration = function (arg1, arg2, arg3) {
        if (arg1 && typeof arg1 === 'object' && arguments.length === 1) {
            this.type = 'XDeclaration';
            this.encoding = arg1.encoding ? arg1.encoding : ''; //ignore jslint
            this.standalone = arg1.standalone ? arg1.standalone : ''; //ignore jslint
            this.version = arg1.version ? arg1.version : ''; //ignore jslint
            return;
        }
        if (arguments.length === 3) {
            this.type = 'XDeclaration';
            this.version = arg1;
            this.encoding = arg2;
            this.standalone = arg3;
            return;
        }
        this.type = 'XDeclaration';
        this.version = '';
        this.encoding = '';
        this.standalone = '';
    };

    Ltxml.XDeclaration.prototype.serialize = function (o, indent) {
        if (this.version || this.encoding || this.standalone) {
            if (indent) {
                o.a("<?xml");
                if (this.version) {
                    o.a(" version=\"").a(this.version).a("\"");
                }
                if (this.encoding) {
                    o.a(" encoding=\"").a(this.encoding).a("\"");
                }
                if (this.standalone) {
                    o.a(" standalone=\"").a(this.standalone).a("\"");
                }
                o.a("?>\n");
                return;
            }
            o.a("<?xml");
            if (this.version) {
                o.a(" version=\"").a(this.version).a("\"");
            }
            if (this.encoding) {
                o.a(" encoding=\"").a(this.encoding).a("\"");
            }
            if (this.standalone) {
                o.a(" standalone=\"").a(this.standalone).a("\"");
            }
            o.a("?>");
            return;
        }
        return;
    };

    Ltxml.XDeclaration.prototype.toString = function (indent) {
        var o = getStringBuilder();
        this.serialize(o, indent);
        return o.toString();
    };

    /********************** XDocument: XContainer **********************/

    //new XDocument()
    //new XDocument(content)
    //new XDocument(xdocument)
    //new XDocument(xdeclaration, content)
    Ltxml.XDocument = function (arg1) {
        var tempNodes, tempNodes2, start, args, i;

        this.annotationsArray = [];
        this.parent = null;
        this.nodeType = 'Document';
        this.nodesArray = [];
        this.declaration = new Ltxml.XDeclaration();

        if (typeof arg1 === 'object' && arg1.nodeType && arg1.nodeType === 'Document') {
            if (arguments.length > 1) {
                throw "XDocument constructor: invalid arguments";
            }
            tempNodes = [];
            if (arg1.declaration !== null) {
                this.declaration = new Ltxml.XDeclaration(arg1.declaration);
            }
            addContent(this,
                        function (z) { tempNodes.push(z); },
                        function () { throw "Internal Error"; },
                        arg1.nodesArray);
            this.nodesArray = tempNodes;
            return;
        }

        if (arguments.length > 0) {
            if (typeof arg1 === 'object' && arg1.type && arg1.type === 'XDeclaration') {
                start = 1;
                this.declaration = arg1;
            }
            else {
                start = 0;
            }
            args = [];
            for (i = start; i < arguments.length; i += 1) {
                args.push(arguments[i]);
            }
            tempNodes2 = [];
            addContent(this,
                            function (z) { tempNodes2.push(z); },
                            function () { throw "Internal Error"; },
                            args);
            this.nodesArray = tempNodes2;
        }
    };

    Ltxml.XDocument.prototype = new Ltxml.XContainer();

    Ltxml.XDocument.prototype.serialize = function (o, indent) {
        var i;

        if (indent) {
            this.declaration.serialize(o, true);
            for (i = 0; i < this.nodesArray.length; i += 1) {
                this.nodesArray[i].serialize(o, true);
            }
            return;
        }
        this.declaration.serialize(o, false);
        for (i = 0; i < this.nodesArray.length; i += 1) {
            this.nodesArray[i].serialize(o, false);
        }
        return;
    };

    Ltxml.XDocument.prototype.toString = function (indent) {
        var clone, o, newRoot;

        o = getStringBuilder();
        clone = new Ltxml.XDocument(this.declaration,
            this.nodes().select(function (n) {
                if (n.nodeType === 'Element') {
                    newRoot = new Ltxml.XElement(n);
                    annotateRootForNamespaces(newRoot);
                    return newRoot;
                }
                return n;
            }));

        clone.serialize(o, indent);
        return o.toString();
    };

    Ltxml.XDocument.parse = function (xml) {
        var xmlDoc, e;

        xmlDoc = parseXml(xml);
        e = Ltxml.XDocument.load(xmlDoc);
        return e;
    };

    Ltxml.XDocument.prototype.DocumentType = function () {
        throw "Not implemented";
    };

    function xmlNodeLoad(node, depth) {
        var ns, xn, aa, aa2, cn, cn2, el, at, doc,
            xcd, xcm, pi, xdec, cnt1, cnt2, cnt3, tn, newAtt,
            cn_doc, cnt4, nc, version, encoding, standalone;

        if (node.nodeType) {
            if (node.nodeType === 1) {
                if (node.namespaceURI === null ||
                    node.namespaceURI === undefined ||
                    (node.namespaceURI === "" && node.nodeName !== "xmlns")) {
                    ns = Ltxml.XNamespace.getNone();
                }
                else {
                    ns = new Ltxml.XNamespace(
                        node.namespaceURI,
                        node.prefix && node.prefix !== "" ?
                            node.prefix.toString() :
                            null);
                }
                if (node.localName) {
                    xn = new Ltxml.XName(ns, node.localName);
                }
                else {
                    xn = new Ltxml.XName(ns, node.baseName);
                }

                aa = node.attributes;
                cn = node.childNodes;

                if (aa !== null && aa !== undefined && aa.length > 0) {
                    cn2 = [];
                    for (cnt1 = 0; cnt1 < cn.length; cnt1 += 1) {
                        tn = xmlNodeLoad(cn[cnt1], depth + 1);
                        cn2.push(tn);
                    }
                    aa2 = [];
                    for (cnt2 = 0; cnt2 < aa.length; cnt2 += 1) {
                        newAtt = xmlNodeLoad(aa[cnt2], depth + 1);
                        aa2.push(newAtt);
                    }
                    el = new Ltxml.XElement(xn, aa2, cn2);
                }
                else {
                    cn2 = [];
                    for (cnt3 = 0; cnt3 < cn.length; cnt3 += 1) {
                        cn2.push(xmlNodeLoad(cn[cnt3], depth + 1));
                    }
                    el = new Ltxml.XElement(xn, cn2);
                }
                return el;
            }

            if (node.nodeType === 2) {
                if (node.namespaceURI === null || node.namespaceURI === undefined ||
                        (node.namespaceURI === "" && node.prefix !== "xmlns")) {
                    if (node.prefix === "xml") {
                        ns = Ltxml.XNamespace.getXml();
                    }
                    else {
                        ns = Ltxml.XNamespace.getNone();
                    }
                }
                else {
                    if (node.namespaceURI === "http://www.w3.org/2000/xmlns/" ||
                            node.prefix === "xmlns") {
                        ns = Ltxml.XNamespace.getXmlns();
                    }
                    else if (node.namespaceURI ===
                            "http://www.w3.org/XML/1998/namespace") {
                        ns = Ltxml.XNamespace.getXml();
                    }
                    else {
                        ns = new Ltxml.XNamespace(
                            node.namespaceURI,
                                node.prefix ?
                                node.prefix.toString() :
                                null);
                    }
                }
                if (node.localName) {
                    xn = new Ltxml.XName(ns, node.localName);
                }
                else {
                    if (node.nodeName === "xmlns") {
                        xn = new Ltxml.XName(ns, "xmlns");
                    }
                    else {
                        xn = new Ltxml.XName(ns, node.baseName);
                    }
                }
                at = new Ltxml.XAttribute(xn, node.nodeValue);
                return at;
            }

            if (node.nodeType === 3) {
                nc = [];
                addContentThatCanContainEntities(node.nodeValue, null, true, function (c) {
                    nc.push(c);
                });
                return nc;
            }

            if (node.nodeType === 4) {
                xcd = new Ltxml.XCData(node.nodeValue);
                return xcd;
            }

            if (node.nodeType === 7) {
                if (node.target === 'xml') {
                    return null;
                }
                pi = new Ltxml.XProcessingInstruction(node.target, node.data);
                return pi;
            }

            if (node.nodeType === 8) {
                xcm = new Ltxml.XComment(node.nodeValue);
                return xcm;
            }

            if (node.nodeType === 9) {
                version = node.xmlVersion;
                encoding = node.xmlEncoding;
                standalone = node.xmlStandalone;
                if (!version) { version = "1.0"; }
                if (!encoding) { encoding = "UTF-8"; }
                if (!standalone) { standalone = "yes"; }
                xdec = new Ltxml.XDeclaration(
                    version,
                    encoding,
                    standalone ? "yes" : "no");
                cn = node.childNodes;
                cn_doc = [];
                for (cnt4 = 0; cnt4 < cn.length; cnt4 += 1) {
                    cn_doc.push(xmlNodeLoad(cn[cnt4], depth + 1));
                }
                doc = new Ltxml.XDocument(xdec, cn_doc);
                return doc;
            }
        }
		
        throw ("Internal Error");
    }

    Ltxml.XDocument.load = function (document) {
        var d = xmlNodeLoad(document);
        return d;
    };

    Ltxml.XDocument.prototype.getRoot = function () {
        return Enumerable
            .from(this.nodesArray)
            .firstOrDefault(function (f) {
                return f.nodeType === 'Element';
            });
    };

    // xname is optional
    Ltxml.XDocument.prototype.descendants = function (xname) {
        var result;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }

        if (this.lazy) {
            return lazyDescendantHelper(this, xname);
        }
        // not lazy
        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        result = [];
        eagarDescendantHelper(this, xname, function (e) { result.push(e); });
        return Enumerable.from(result);
    };

    if (Object.defineProperties) {

        Object.defineProperty(Ltxml.XDocument.prototype, "root", {
            get: function () {
                return this.getRoot();
            },
            enumerable: true,
            configurable: true
        });

    }

    /********************** XElement: XContainer **********************/

    // new XElement(xelement)         // copy constructor
    // new XElement(xname)
    // new XElement(xname, content)
    Ltxml.XElement = function (arg1) {
        var tempNodes, tempAtts, tempNodes2, tempAtts2, xnameObj, args, i;

        this.annotationsArray = [];
        this.parent = null;
        this.nodeType = 'Element';
        this.nodesArray = null;
        this.attributesArray = null;
        this.name = null;
        this.nsCache = null;

        if (Object.defineProperties) {

            Object.defineProperty(this, "value", {
                get: Ltxml.XElement.prototype.getValue,
                set: Ltxml.XElement.prototype.setValue,
                enumerable: true,
                configurable: true
            });

        }

        if (typeof arg1 === 'object' && arg1.nodeType && arg1.nodeType === 'Element') {
            if (arguments.length > 1) {
                throw "XElement constructor: invalid arguments";
            }
            this.name = arg1.name;
            tempNodes = [];
            tempAtts = [];
            addContent(this,
                        function (z) { tempNodes.push(z); },
                        function (z) { tempAtts.push(z); },
                        arg1.attributesArray,
                        arg1.nodesArray);
            this.attributesArray = tempAtts;
            this.nodesArray = tempNodes;
            return;
        }

        xnameObj = arg1;
        if (typeof arg1 === 'string') {
            xnameObj = new Ltxml.XName(arg1);
        }
        this.name = xnameObj;
        if (arguments.length > 1) {
            args = [];
            for (i = 1; i < arguments.length; i += 1) {
                args.push(arguments[i]);
            }
            tempNodes2 = [];
            tempAtts2 = [];
            addContent(this,
                        function (z) { tempNodes2.push(z); },
                        function (z) { tempAtts2.push(z); },
                        args);
            this.attributesArray = tempAtts2;
            this.nodesArray = tempNodes2;
        }
        if (this.nodesArray === null) {
            this.nodesArray = [];
        }
        if (this.attributesArray === null) {
            this.attributesArray = [];
        }
    };

    Ltxml.XElement.prototype = new Ltxml.XContainer();

    Ltxml.XElement.prototype.attribute = function (xname) {
        var i;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        for (i = 0; i < this.attributesArray.length; i += 1) {
            if (this.attributesArray[i].name === xname) {
                return this.attributesArray[i];
            }
        }
        return null;
    };

    Ltxml.XElement.prototype.attributes = function (xname) {
        var atts;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }

        if (xname === undefined) {
            atts = Enumerable.from(this.attributesArray);
            return atts;
        }
        // have XName
        atts = Enumerable.from(this.attributesArray)
            .where(function (a) { return a.name === xname; });
        return atts;
    };

    Ltxml.XElement.prototype.serialize = function (o, indent, depth) {
        var attributesToUse, indent_spaces, middle_take, mixed_content,
            attribute_indent_spaces, qn, as, bs, i, n;

        if (!depth) {
            depth = 0;
        }
        qn = Ltxml.XName.qualify(this.name, this, false);
        attributesToUse = [].concat(this.attributesArray);
        attributesToUse.sort(function (a, b) {
            as = a.name.toString();
            bs = b.name.toString();
            if (as < bs) {
                return -1;
            }
            if (as > bs) {
                return 1;
            }
            return 0;
        });
        if (this.nodesArray.length === 0) {
            // ================================ content:no
            if (indent) {
                // ================================ content:no indent:yes
                indent_spaces = Ltxml.spaces.substring(0, depth);
                if (attributesToUse.length === 0) {
                    // ============ content:no indent:yes attributes:no
                    o.a(indent_spaces).a("<").a(qn).a("/>\n");
                    return;
                }
                if (attributesToUse.length === 1) {
                    // ================================ content:no indent:yes attributes:1
                    o.a(indent_spaces).a("<").a(qn).a(" ")
                        .a(attributesToUse[0]).a("/>\n");
                    return;
                }
                // ================================ content:no indent:yes attributes:*
                attribute_indent_spaces = indent_spaces +
                    Ltxml.spaces.substring(0, 2 + qn.length);
                middle_take = attributesToUse.length - 2;
                o.a(indent_spaces).a("<").a(qn).a(" ");
                attributesToUse[0].serialize(o);
                o.a("\n");
                Enumerable.from(attributesToUse)
                    .skip(1)
                    .take(middle_take)
                    .forEach(function (a) {
                        o.a(attribute_indent_spaces);
                        a.serialize(o);
                        o.a("\n");
                    });
                o.a(attribute_indent_spaces);
                attributesToUse[attributesToUse.length - 1].serialize(o);
                o.a("/>\n");
                return;
            }
            // ================================ content:no indent:no
            o.a("<").a(qn).a(attributesToUse.length === 0 ? "" : " ");
            for (i = 0; i < attributesToUse.length; i += 1) {
                attributesToUse[i].serialize(o);
                if (i < attributesToUse.length - 1) {
                    o.a(' ');
                }
            }
            o.a("/>");
            return;
        }
        // ================================ content:yes
        if (indent) {
            // ================================ content:yes indent:yes
            indent_spaces = Ltxml.spaces.substring(0, depth);
            mixed_content = false;
            for (i = 0; i < this.nodesArray.length; ++i) {
                n = this.nodesArray[i];
                if (n.nodeType === 'Text' ||
                    n.nodeType === 'Entity') {
                    mixed_content = true;
                    break;
                }
            }
            //mixed_content = (this.nodesArray[0].nodeType === 'Text' ||
            //    this.nodesArray[0].nodeType === 'CDATA' ||
            //    this.nodesArray[0].nodeType === 'Entity');
            if (mixed_content) {
                // =============== content:yes indent:yes first_child_text:yes
                if (attributesToUse.length === 0) {
                    // ========== content:yes indent:yes first_child_text:yes attributes:0
                    o.a(indent_spaces).a("<").a(qn).a(">");
                    for (i = 0; i < this.nodesArray.length; i += 1) {
                        this.nodesArray[i].serialize(o);
                    }
                    o.a("</").a(qn).a(">\n");
                    return;
                }
                if (attributesToUse.length === 1) {
                    // ========= content:yes indent:yes first_child_text:yes attributes:1
                    o.a(indent_spaces).a("<").a(qn).a(" ");
                    attributesToUse[0].serialize(o);
                    o.a(">");
                    for (i = 0; i < this.nodesArray.length; i += 1) {
                        this.nodesArray[i].serialize(o, false);
                    }
                    o.a("</").a(qn).a(">\n");
                    return;
                }
                // ============ content:yes indent:yes first_child_text:yes attributes:*
                attribute_indent_spaces = indent_spaces +
                    Ltxml.spaces.substring(0, 2 + qn.length);
                middle_take = attributesToUse.length - 2;
                o.a(indent_spaces).a("<").a(qn).a(" ");
                attributesToUse[0].serialize(o);
                o.a("\n");
                Enumerable.from(attributesToUse)
                    .skip(1)
                    .take(middle_take)
                    .forEach(function (a) { o.a(attribute_indent_spaces).a(a).a("\n"); });
                o.a(attribute_indent_spaces);
                attributesToUse[attributesToUse.length - 1].serialize(o);
                o.a(">");
                Enumerable.from(this.nodesArray)
                            .forEach(function (c) { c.serialize(o, false); });
                o.a("</").a(qn).a(">\n");
                // following is implementation that does not use LINQ
                // var first = indent_spaces + "<" + qn + " " + attributesToUse[0] + "\n";
                // var atum = [];
                // for (var i = 1; i < attributesToUse.length - 1; i += 1) {
                //     atum.push(attributesToUse[i]);
                // }
                // var z9 = '';
                // for (var j = 0; j < atum.length; j += 1) {
                //     z9 += attribute_indent_spaces + atum[j].toString() + "\n";
                // }
                // var second = z9;

                // var third = attribute_indent_spaces +
                //     attributesToUse[attributesToUse.length - 1] + ">" +
                //             Enumerable.from(this.nodesArray)
                //                 .select(function (c) { return c.serialize(false) })
                //        .aggregate('', function (a, b) { return a + b; }) +
                //                   "</" + qn + ">\n";
                // var es = first + second + third;
                return;
            }
            // ================================ content:yes indent:yes first_child_text:no
            if (attributesToUse.length === 0) {
                // =============== content:yes indent:yes first_child_text:no attributes:0
                o.a(indent_spaces).a("<").a(qn).a(">\n");
                Enumerable.from(this.nodesArray)
                    .forEach(function (c) { c.serialize(o, true, depth + 2); });
                o.a(indent_spaces).a("</").a(qn).a(">\n");
                return;
            }
            if (attributesToUse.length === 1) {
                // ============== content:yes indent:yes first_child_text:no attributes:1
                o.a(indent_spaces).a("<").a(qn).a(" ");
                attributesToUse[0].serialize(o);
                o.a(">\n");
                Enumerable.from(this.nodesArray)
                    .forEach(function (c) { c.serialize(o, true, depth + 2); });
                o.a(indent_spaces).a("</").a(qn).a(">\n");
                return;
            }
            // ================ content:yes indent:yes first_child_text:no attributes:*
            attribute_indent_spaces = indent_spaces +
                Ltxml.spaces.substring(0, 2 + qn.length);
            middle_take = attributesToUse.length - 2;
            o.a(indent_spaces).a("<").a(qn).a(" ");
            attributesToUse[0].serialize(o);
            o.a("\n");
            Enumerable.from(attributesToUse)
                        .skip(1)
                        .take(middle_take)
                        .forEach(function (a) {
                            o.a(attribute_indent_spaces); a.serialize(o); o.a("\n");
                        });
            o.a(attribute_indent_spaces);
            attributesToUse[attributesToUse.length - 1].serialize(o);
            o.a(">\n");
            Enumerable.from(this.nodesArray)
                .forEach(function (c) { c.serialize(o, true, depth + 2); });
            o.a(indent_spaces).a("</").a(qn).a(">\n");
            return;
        }
        // ================================ content:yes indent:no
        o.a("<").a(qn);
        Enumerable.from(attributesToUse)
            .forEach(function (a) { o.a(" "); a.serialize(o); });
        o.a(">");
        Enumerable.from(this.nodesArray)
            .forEach(function (n) { n.serialize(o); });
        o.a("</").a(qn).a(">");
        return;
    };

    function annotateElementForNamespaces(element, nsCache, xmlns, xml, none) {
        var needToProcess, aa, na, ns, len, i, j, nd, newNsCache, el, prefix, nn,
            newPrefix, newAtt;

        needToProcess = false;
        aa = element.attributesArray;
        len = aa.length;
        for (i = 0; i < len; i += 1) {
            nd = aa[i];
            if (!nd.isNamespaceDeclaration) {
                continue; //ignore jslint
            }
            ns = new Ltxml.XNamespace(nd.value);
            prefix = nd.name.localName;
            if (ns.preferredPrefix === null) {
                ns.preferredPrefix = prefix;
            }
            if (nsCache.namespaceArray.indexOf(ns) === -1 || prefix !== ns.preferredPrefix) {
                needToProcess = true;
                break;
            }
        }
        for (i = 0; i < len; i += 1) {
            nd = aa[i];
            if (!nd.isNamespaceDeclaration &&
                nd.name.namespace !== none &&
                nd.name.namespace !== xml) {
                if (nsCache.namespaceArray.indexOf(nd.name.namespace) === -1) {
                    while (true) {
                        newPrefix = "p" + prefixCounter;
                        if (nsCache.prefixArray.indexOf(newPrefix) === -1) {
                            break;
                        }
                        prefixCounter += 1;
                    }
                    newAtt = new Ltxml.XAttribute(Ltxml.XNamespace.getXmlns() + newPrefix,
                        nd.name.namespace.namespaceName);
                    element.add(newAtt);
                    nsCache.namespaceArray.push(nd.name.namespace);
                    nsCache.prefixArray.push(newPrefix);
                    if (nsCache.prefixesFromNamespaceObjects) {
                        nd.name.namespace.preferredPrefix = newPrefix;
                    }
                    needToProcess = true;
                }
            }
        }
        if (element.name.namespace === none &&
            (nsCache.defaultNamespace !== null &&
                nsCache.defaultNamespace !== none)) {
            if (!Enumerable.from(element.attributesArray).any(function (a) {
                return a.name.namespace === xmlns && a.name.localName === "xmlns";
            })) {
                nn = new Ltxml.XAttribute("xmlns", "");
                element.add(nn);
                needToProcess = true;
            }
        }
        if (needToProcess) {
            newNsCache = {
                prefixesFromNamespaceObjects: false,
                defaultNamespace: nsCache.defaultNamespace,
                namespaceArray: [],
                prefixArray: []
            };

            aa = element.attributesArray;
            len = aa.length;
            for (i = 0; i < len; i += 1) {
                nd = aa[i];
                if (nd.isNamespaceDeclaration) {
                    if (nd.name.namespace === xmlns && nd.name.localName === "xmlns") {
                        if (nd.value === '') {
                            newNsCache.defaultNamespace = Ltxml.XNamespace.getNone();
                        }
                        else {
                            newNsCache.defaultNamespace = new Ltxml.XNamespace(nd.value);
                        }
                    }
                    else {
                        ns = new Ltxml.XNamespace(nd.value);
                        prefix = nd.name.localName;
                        newNsCache.namespaceArray.push(ns);
                        newNsCache.prefixArray.push(prefix);
                    }
                }
            }
            for (i = 0; i < nsCache.namespaceArray.length; i += 1) {
                if (newNsCache.namespaceArray.indexOf(nsCache.namespaceArray[i]) === -1) {
                    newNsCache.namespaceArray.push(nsCache.namespaceArray[i]);
                    newNsCache.prefixArray.push(nsCache.prefixArray[i]);
                }
            }
            element.nsCache = newNsCache;
            na = element.nodesArray;
            len = na.length;
            for (j = 0; j < len; j += 1) {
                el = na[j];
                if (el.nodeType === 'Element') {
                    annotateElementForNamespaces(el, newNsCache, xmlns, xml, none);
                }
            }
            return;
        }
        element.nsCache = nsCache;
        na = element.nodesArray;
        len = na.length;
        for (j = 0; j < len; j += 1) {
            el = na[j];
            if (el.nodeType === 'Element') {
                annotateElementForNamespaces(el, nsCache, xmlns, xml, none);
            }
        }
    }

    annotateRootForNamespaces = function (rootElement) {
        var aa, na, len, i, j, nd, newPrefix, newAtt,
            nsCache, ns, prefix, el, xmlns, none, xml;

        xmlns = Ltxml.XNamespace.getXmlns();
        none = Ltxml.XNamespace.getNone();
        xml = Ltxml.XNamespace.getXml();
        for (ns in Ltxml.namespaceCache) {
            if (Ltxml.namespaceCache.hasOwnProperty(ns)) {
                if (Ltxml.namespaceCache[ns].namespaceName) {
                    ns.preferredPrefix = null;
                }
            }
        }
        prefixCounter = 0;
        nsCache = {
            prefixesFromNamespaceObjects: true,
            defaultNamespace: null,
            namespaceArray: [],
            prefixArray: []
        };
        aa = rootElement.attributesArray;
        len = aa.length;
        for (i = 0; i < len; i += 1) {
            nd = aa[i];
            if (nd.isNamespaceDeclaration) {
                if (nd.name.namespace === xmlns && nd.name.localName === "xmlns") {
                    ns = new Ltxml.XNamespace(nd.value);
                    nsCache.defaultNamespace = ns;
                    ns.preferredPrefix = '';
                }
                else {
                    ns = new Ltxml.XNamespace(nd.value);
                    prefix = nd.name.localName;
                    ns.preferredPrefix = prefix;
                    nsCache.namespaceArray.push(ns);
                    nsCache.prefixArray.push(prefix);
                }
            }
        }
        for (i = 0; i < len; i += 1) {
            nd = aa[i];
            if (!nd.isNamespaceDeclaration &&
                nd.name.namespace !== none &&
                nd.name.namespace !== xml) {
                if (nsCache.namespaceArray.indexOf(nd.name.namespace) === -1) {
                    while (true) {
                        newPrefix = "p" + prefixCounter;
                        if (nsCache.prefixArray.indexOf(newPrefix) === -1) {
                            break;
                        }
                        prefixCounter += 1;
                    }
                    newAtt = new Ltxml.XAttribute(Ltxml.XNamespace.getXmlns() + newPrefix,
                        nd.name.namespace.namespaceName);
                    rootElement.add(newAtt);
                    nsCache.namespaceArray.push(nd.name.namespace);
                    nsCache.prefixArray.push(newPrefix);
                    if (nsCache.prefixesFromNamespaceObjects) {
                        nd.name.namespace.preferredPrefix = newPrefix;
                    }
                }
            }
        }
        rootElement.nsCache = nsCache;
        na = rootElement.nodesArray;
        len = na.length;
        for (j = 0; j < len; j += 1) {
            el = na[j];
            if (el.nodeType === 'Element') {
                annotateElementForNamespaces(el, nsCache, xmlns, xml, none);
            }
        }
    };

    Ltxml.XElement.prototype.toString = function (indent) {
        var clone, o;

        o = getStringBuilder();
        clone = new Ltxml.XElement(this);
        annotateRootForNamespaces(clone);
        clone.serialize(o, indent, 0);
        return o.toString();
    };


    Ltxml.XElement.load = function (element) {
        var el = xmlNodeLoad(element);
        return el;
    };

    Ltxml.XElement.prototype.getFirstAttribute = function () {
        if (this.attributesArray.length > 0) {
            return this.attributesArray[0];
        }
        return null;
    };

    Ltxml.XElement.prototype.getDefaultNamespaceHelper = function () {
        var attributesToUse, defNamespaceAtt;

        attributesToUse = [].concat(this.attributesArray);
        defNamespaceAtt = Enumerable
            .from(attributesToUse)
            .where(function (a) { return a.isNamespaceDeclaration; })
            .firstOrDefault(function (a) {
                return a.name.namespace === Ltxml.XNamespace.getXmlns() &&
                a.name.localName === "xmlns";
            });
        return defNamespaceAtt;
    };

    Ltxml.XElement.prototype.getDefaultNamespace = function (namespace) {
        var current, dna;

        current = this;
        while (true) {
            dna = current.getDefaultNamespaceHelper(namespace);
            if (dna !== null) {
                return new Ltxml.XNamespace(dna.value);
            }
            current = current.parent;
            if (current === null || current.nodeType === 'Document') {
                return Ltxml.XNamespace.getNone();
            }
        }
    };

    Ltxml.XElement.prototype.getNamespaceOfPrefixForThisElement = function (prefix) {
        var a = Enumerable.from(this.attributesArray)
            .firstOrDefault(function (a) {
                return a.isNamespaceDeclaration &&
                    a.name.namespace === Ltxml.XNamespace.getXmlns() &&
                    a.name.localName === prefix;
            });
        return a;
    };

    Ltxml.XElement.prototype.getNamespaceOfPrefix = function (prefix) {
        var current, ns;

        current = this;
        while (true) {
            ns = current.getNamespaceOfPrefixForThisElement(prefix);
            if (ns !== null) {
                return ns;
            }
            current = current.parent;
            if (current === null || current.nodeType === 'Document') {
                return null;
            }
        }
    };

    prefixCounter = 0;

    Ltxml.XElement.prototype.getPrefixOfNamespace = function (namespace, isAttribute) {
        var current, prefix, defaultNamespace, nsCache, getPrefixesFromNamespace, index,
            newPrefix, newAtt;

        current = this;
        nsCache = this.nsCache;
        getPrefixesFromNamespace = nsCache.getPrefixesFromNamespace;
        if (getPrefixesFromNamespace && namespace.preferredPrefix !== undefined) {
            return namespace.preferredPrefix;
        }
        if (isAttribute === undefined) {
            isAttribute = false;
        }
        if (!isAttribute) {
            defaultNamespace = nsCache.defaultNamespace;
            if (namespace === defaultNamespace) {
                namespace.preferredPrefix = '';
                return '';
            }
        }
        index = nsCache.namespaceArray.indexOf(namespace);
        if (index === -1) {
            while (true) {
                newPrefix = "p" + prefixCounter;
                if (nsCache.prefixArray.indexOf(newPrefix) === -1) {
                    break;
                }
                prefixCounter += 1;
            }
            newAtt = new Ltxml.XAttribute(Ltxml.XNamespace.getXmlns() + newPrefix,
                namespace.namespaceName);
            this.add(newAtt);
            nsCache.namespaceArray.push(namespace);
            nsCache.prefixArray.push(newPrefix);
            if (nsCache.prefixesFromNamespaceObjects) {
                namespace.preferredPrefix = newPrefix;
            }
            return newPrefix;
        }
        prefix = nsCache.prefixArray[index];
        return prefix;  //ignore jslint
    };

    Ltxml.XElement.prototype.getHasAttributes = function () {
        return this.attributesArray && this.attributesArray.length > 0;
    };

    Ltxml.XElement.prototype.getHasElements = function () {
        return Enumerable.from(this.nodesArray).any(function (n) {
            return n.nodeType === 'Element';
        });
    };

    Ltxml.XElement.prototype.getIsEmpty = function () {
        return this.nodesArray.length === 0;
    };

    Ltxml.XElement.prototype.getLastAttribute = function () {
        if (this.attributesArray.length > 0) {
            return this.attributesArray[this.attributesArray.length - 1];
        }
        return null;
    };

    Ltxml.XElement.parse = function (xml) {
        var xmlDoc, el;

        xmlDoc = parseXml(xml);
        el = Ltxml.XElement.load(xmlDoc.documentElement);
        return el;
    };

    Ltxml.XElement.prototype.removeAll = function () {
        this.nodesArray = [];
        this.attributesArray = [];
    };

    Ltxml.XElement.prototype.removeAttributes = function () {
        this.attributesArray = [];
    };

    Ltxml.XElement.prototype.replaceAll = function () {
        var args, contentToInsert, i;

        args = [];
        contentToInsert = [];

        args = [];
        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        contentToInsert = [];
        addContent(this,
            function (c) { contentToInsert.push(c); },
            function () { throw "replaceAll: invalid content"; },
            args);
        this.nodesArray = contentToInsert;
    };

    Ltxml.XElement.prototype.replaceAttributes = function () {
        var args, contentToInsert, i;

        args = [];
        contentToInsert = [];

        args = [];
        for (i = 0; i < arguments.length; i += 1) {
            args.push(arguments[i]);
        }
        contentToInsert = [];
        addContent(this,
            function () { throw "replaceAttributes: invalid content"; },
            function (a) { contentToInsert.push(a); },
            args);
        this.attributesArray = contentToInsert;
    };

    Ltxml.XElement.prototype.setAttributeValue = function (xname, value) {
        var xa;

        if (typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        xa = this.attribute(xname);
        if (xa !== null) {
            if (value === null) {
                if (xa.parent !== null) {
                    xa.remove();
                }
                return;
            }
            xa.setValue(value);
            return;
        }
        xa = new Ltxml.XAttribute(xname, value);
        xa.parent = this;
        this.attributesArray.push(xa);
    };

    Ltxml.XElement.prototype.setElementValue = function (xname, value) {
        var xe, nc;

        if (typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        xe = this.element(xname);
        if (xe !== null) {
            if (value === null) {
                if (xe.parent !== null) {
                    xe.remove();
                }
                return;
            }
            nc = [];
            addContentThatCanContainEntities(value, xe, true, function (v) {
                nc.push(v);
            });
            xe.nodesArray = nc;
            return;
        }
        xe = new Ltxml.XElement(xname, value);
        xe.parent = this;
        this.nodesArray.push(xe);
    };

    Ltxml.XElement.prototype.setValue = function (value) {
        var nc = [];
        addContentThatCanContainEntities(value.toString(), this, true, function (c) {
            nc.push(c);
        });
        this.nodesArray = nc;
    };

    Ltxml.XElement.prototype.getValue = function () {
        var returnValue = this
            .descendantNodes()
            .where(function (n) {
                return n.nodeType === 'Text' ||
                n.nodeType === 'CDATA' ||
                n.nodeType === 'Entity';
            })
            .select(function (n) { return n.value; })
            .toArray()
            .join('');
        return returnValue;
    };

    Ltxml.XElement.prototype.ancestorsAndSelf = function (xname) {
        var result, current, self;

        self = this;
        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }

        if (this.lazy) {
            return Enumerable.Utils.createEnumerable(function () {
                var current;

                return Enumerable.Utils.createEnumerator(
                    function () {
                        current = self;
                    },  // initialize
                    function () { // tryGetNext
                        while (current !== null) {
                            if (xname && current.name !== xname) {
                                current = current.parent;
                            }
                            else {
                                var thisOne = current;
                                current = current.parent;
                                return this.yieldReturn(thisOne);
                            }
                        }
                        return this.yieldBreak();
                    },
                    Functions.Blank
                );
            });
        }
        result = [];
        current = this.parent;
        if (xname === undefined) {
            result.push(this);
            while (current !== null) {
                result.push(current);
                current = current.parent;
            }
            return Enumerable.from(result);
        }
        if (this.name === xname) {
            result.push(this);
        }
        while (current !== null) {
            if (current.name === xname) {
                result.push(current);
            }
            current = current.parent;
        }
        return Enumerable.from(result);
    };

    function descendantNodesAndSelfHelper(element, pushFunc) {
        var i;

        for (i = 0; i < element.nodesArray.length; i += 1) {
            pushFunc(element.nodesArray[i]);
            if (element.nodesArray[i].nodeType === 'Element' ||
                    element.nodesArray[i].nodeType === 'Document') {
                descendantNodesAndSelfHelper(element.nodesArray[i], pushFunc);
            }
        }
    }

    Ltxml.XElement.prototype.descendantNodesAndSelf = function () {
        var result, returnValue;

        if (this.lazy) {
            returnValue = Enumerable
                .from(this.nodesArray)
                .traverseDepthFirst(function (node) {
                    return Enumerable.from(node.nodesArray);
                });
            return Enumerable.from([this]).concat(returnValue);
        }

        result = [];
        result.push(this);
        descendantNodesAndSelfHelper(this, function (e) { result.push(e); });
        return Enumerable.from(result);
    };

    // xname is optional
    Ltxml.XElement.prototype.descendantsAndSelf = function (xname) {
        var result, self;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }

        if (this.lazy) {
            if (!xname) {
                self = Enumerable.from([this]);
            }
            else {
                if (xname === this.name) {
                    self = Enumerable.from([this]);
                }
                else {
                    self = Enumerable.from([]);
                }
            }
            return self.concat(lazyDescendantHelper(this, xname));
        }
        result = [];
        if (!xname) {
            result.push(this);
        }
        else {
            if (xname === this.name) {
                result.push(this);
            }
        }
        eagarDescendantHelper(this, xname, function (e) { result.push(e); });
        return Enumerable.from(result);
    };

    if (Object.defineProperties) {

        Object.defineProperty(Ltxml.XElement.prototype, "firstAttribute", {
            get: function () {
                return this.getFirstAttribute();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XElement.prototype, "hasAttributes", {
            get: function () {
                return this.getHasAttributes();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XElement.prototype, "hasElements", {
            get: function () {
                return this.getHasElements();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XElement.prototype, "isEmpty", {
            get: function () {
                return this.getIsEmpty();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Ltxml.XElement.prototype, "lastAttribute", {
            get: function () {
                return this.getLastAttribute();
            },
            enumerable: true,
            configurable: true
        });
    }

    /********************* XProcessingInstruction: XNode *********************/

    //new XProcessingInstruction(xprocessingInstruction)
    //new XProcessingInstruction(target, data)
    Ltxml.XProcessingInstruction = function (arg1, arg2) {
        this.nodeType = 'ProcessingInstruction';
        this.parent = null;
        this.target = null;
        this.data = null;

        if (arg1 && arg1.nodeType && arg1.nodeType === 'ProcessingInstruction') {
            if (arg1.target) {
                this.target = arg1.target;
            }
            if (arg1.data) {
                this.data = arg1.data;
            }
        }
        else {
            this.target = arg1;
            this.data = arg2;
        }
    };

    Ltxml.XProcessingInstruction.prototype = new Ltxml.XNode();

    Ltxml.XProcessingInstruction.prototype.serialize = function (o, indent, depth) {
        var indent_spaces;

        if (!depth) {
            depth = 0;
        }
        if (indent) {
            indent_spaces = Ltxml.spaces.substring(0, depth);
            o.a(indent_spaces).a("<?").a(this.target).a(" ").a(this.data).a("?>\n");
            return;
        }
        o.a("<?").a(this.target).a(" ").a(this.data).a("?>");
        return;
    };

    Ltxml.XProcessingInstruction.prototype.toString = function (indent) {
        var o = getStringBuilder();
        this.serialize(o, indent);
        return o.toString();
    };

    /********************** XText: XNode **********************/

    Ltxml.XText = function (arg1) {
        this.nodeType = 'Text';
        this.parent = null;

        if (arg1 && arg1.nodeType && arg1.nodeType === 'Text') {
            // copy constructor
            this.value = arg1.value.toString();
        }
        else {
            this.value = arg1;
        }

        // methods
        this.serialize = function (o) {
            o.a(this.value);
        };

        this.toString = function () {
            return this.value;
        };
    };

    Ltxml.XText.prototype = new Ltxml.XNode();

    /********************** XEntity: XNode **********************/

    Ltxml.XEntity = function (arg1) {
        this.nodeType = 'Entity';
        this.parent = null;

        if (arg1 && arg1.nodeType && arg1.nodeType === 'Entity') {
            // copy constructor
            this.value = arg1.value;
        }
        else {
            if (typeof arg1 === 'string') {
                this.value = arg1;
            }
            else {
                this.value = arg1.toString();
            }
        }

        // methods
        this.serialize = function (o) {
            var s = "&" + this.value + ";";
            o.a(s);
        };

        this.toString = function () {
            return "&" + this.value + ";";
        };
    };

    Ltxml.XEntity.prototype = new Ltxml.XNode();

    /******************* XCData: XText *******************/

    Ltxml.XCData = function (arg1) {
        this.nodeType = 'CDATA';
        this.parent = null;

        if (arg1 && arg1.nodeType && arg1.nodeType === 'CDATA') {
            // copy constructor
            this.value = arg1.value.toString();
        }
        else {
            this.value = arg1.toString();
        }
    };

    Ltxml.XCData.prototype = new Ltxml.XText();

    Ltxml.XCData.prototype.serialize = function (o, indent, depth) {
        var indent_spaces;

        if (!depth) {
            depth = 0;
        }
        if (indent) {
            indent_spaces = Ltxml.spaces.substring(0, depth);
            o.a(indent_spaces).a('<![CDATA[').a(this.value).a(']]>\n');
            return;
        }
        o.a('<![CDATA[').a(this.value).a(']]>');
        return;
    };

    Ltxml.XCData.prototype.toString = function (indent) {
        var o = getStringBuilder();
        this.serialize(o, indent);
        return o.toString();
    };

    /********************** Extension methods (XEnumerable) **********************/

    Ltxml.XEnumerable = function (source) {
        this.source = source;
        this.isXEnumerable = true;
    };

    Ltxml.XEnumerable.prototype = new Enumerable();

    Ltxml.XEnumerable.prototype.getEnumerator = function () {
        return this.source.getEnumerator();
    };

    Ltxml.XEnumerable.prototype.asEnumerable = function () {
        return this.source;
    };

    Enumerable.prototype.asXEnumerable = function () {
        return new Ltxml.XEnumerable(this);
    };

    Ltxml.XEnumerable.prototype.ancestors = function (xname) {
        var source, result;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }

        source = this.source ? this.source : this;  //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType &&
                        (e.nodeType === 'Element' ||
                            e.nodeType === 'Comment' ||
                            e.nodeType === 'ProcessingInstruction' ||
                            e.nodeType === 'Text' ||
                            e.nodeType === 'CDATA' ||
                            e.nodeType === 'Entity')) {
                        return e.ancestors(xname);
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.ancestorsAndSelf = function (xname) {
        var source, result;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        source = this.source ? this.source : this;  //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType && e.nodeType === 'Element') {
                        return e.ancestorsAndSelf(xname);
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.attributes = function (xname) {
        var source, result;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        source = this.source ? this.source : this;  //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType && e.nodeType === 'Element') {
                        return e.attributes(xname);
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.descendantNodes = function () {
        var source, result;

        source = this.source ? this.source : this;  //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType &&
                        (e.nodeType === 'Element' ||
                            e.nodeType === 'Comment' ||
                            e.nodeType === 'ProcessingInstruction' ||
                            e.nodeType === 'Text' ||
                            e.nodeType === 'CDATA' ||
                            e.nodeType === 'Entity')) {
                        return e.descendantNodes();
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.descendantNodesAndSelf = function () {
        var source, result;

        source = this.source ? this.source : this; //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType &&
                        (e.nodeType === 'Element' ||
                            e.nodeType === 'Comment' ||
                            e.nodeType === 'ProcessingInstruction' ||
                            e.nodeType === 'Text' ||
                            e.nodeType === 'CDATA' ||
                            e.nodeType === 'Entity')) {
                        return e.descendantNodesAndSelf();
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.descendants = function (xname) {
        var source, result;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        source = this.source ? this.source : this;  //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType && e.nodeType === 'Element') {
                        return e.descendants(xname);
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.descendantsAndSelf = function (xname) {
        var source, result;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        source = this.source ? this.source : this;  //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType && e.nodeType === 'Element') {
                        return e.descendantsAndSelf(xname);
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.elements = function (xname) {
        var source, result;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        source = this.source ? this.source : this;  //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType &&
                        (e.nodeType === 'Element' || e.nodeType === 'Document')) {
                        return e.elements(xname);
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.InDocumentOrder = function () {
        throw "Not implemented";
    };

    Ltxml.XEnumerable.prototype.nodes = function () {
        var source, result;

        source = this.source ? this.source : this;  //ignore jslint
        result = source
            .selectMany(
                function (e) {
                    if (e.nodeType &&
                        (e.nodeType === 'Element' ||
                            e.nodeType === 'Document')) {
                        return e.nodes();
                    }
                    return Enumerable.empty();
                })
            .asXEnumerable();
        return result;
    };

    Ltxml.XEnumerable.prototype.remove = function (xname) {
        var source, toRemove, i;

        if (xname && typeof xname === 'string') {
            xname = new Ltxml.XName(xname);
        }
        source = this.source ? this.source : this;  //ignore jslint
        toRemove = source.toArray();
        for (i = 0; i < toRemove.length; i += 1) {
            if (xname === undefined) {
                toRemove[i].remove();
            }
            else {
                if (toRemove[i].name && toRemove[i].name === xname) {
                    toRemove[i].remove();
                }
            }
        }
    };

    if (!root.Ltxml) {
        root.Ltxml = Ltxml;
    }

    /*ignore jslint start*/
    // module export
    if (typeof define === typeof function () { } && define.amd) { // AMD
        define("ltxml", [], function () { return Ltxml; });
    }
    else if (typeof module !== typeof undefined && module.exports) { // Node
        module.exports = Ltxml;
    }
    else {
        root.Ltxml = Ltxml;
    }
    /*ignore jslint end*/

} (this));