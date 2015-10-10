/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon: http://referencesource.microsoft.com/#System/net/System/_UriSyntax.cs,538e6fd0099eb7a7
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import StringKeyDictionary = require('../Collections/Dictionaries/StringKeyDictionary');
import InvalidOperationException = require('../Exceptions/InvalidOperationException');
import ArgumentOutOfRangeException = require('../Exceptions/ArgumentOutOfRangeException');
import ArgumentNullException = require('../Exceptions/ArgumentNullException');

export const enum UriSyntaxFlags {
	None                   = 0x0,

	MustHaveAuthority      = 0x1,  // must have "//" after scheme:
	OptionalAuthority      = 0x2,  // used by generic parser due to unknown Uri syntax
	MayHaveUserInfo        = 0x4,
	MayHavePort            = 0x8,
	MayHavePath            = 0x10,
	MayHaveQuery           = 0x20,
	MayHaveFragment        = 0x40,

	AllowEmptyHost         = 0x80,
	AllowUncHost           = 0x100,
	AllowDnsHost           = 0x200,
	AllowIPv4Host          = 0x400,
	AllowIPv6Host          = 0x800,
	AllowAnInternetHost    = AllowDnsHost | AllowIPv4Host | AllowIPv6Host,
	AllowAnyOtherHost      = 0x1000, // Relaxed authority syntax

	FileLikeUri            = 0x2000, //Special case to allow file:\\xxxx or file://\\xxxx
	MailToLikeUri          = 0x4000, //V1 parser inheritance mailTo:AuthorityButNoSlashes

	V1_UnknownUri          = 0x10000, // a Compatibility with V1 parser for an unknown scheme
	SimpleUserSyntax       = 0x20000, // It is safe to not call virtual UriParser methods
	BuiltInSyntax          = 0x40000, // This is a simple Uri plus it is hardcoded in the product
	ParserSchemeOnly       = 0x80000, // This is a Parser that does only Uri scheme parsing

	AllowDOSPath           = 0x100000,  // will check for "x:\"
	PathIsRooted           = 0x200000,  // For an authority based Uri the first path char is '/'
	ConvertPathSlashes     = 0x400000,  // will turn '\' into '/'
	CompressPath           = 0x800000,  // For an authority based Uri remove/compress /./ /../ in the path
	CanonicalizeAsFilePath = 0x1000000, // remove/convert sequences /.../ /x../ /x./ dangerous for a DOS path
	UnEscapeDotsAndSlashes = 0x2000000, // additionally unescape dots and slashes before doing path compression
	AllowIdn               = 0x4000000, // IDN host conversion allowed
	KeepTailLWS            = 0x8000000,
	AllowIriParsing        = 0x10000000,; // Iri parsing. String is normalized, bidi control characters are removed, unicode char limits are checked etc.
}

const enum UriQuirksVersion
{
	// V1 = 1, // RFC 1738 - Not supported
	V2 = 2, // RFC 2396
	V3 = 3; // RFC 3986, 3987
}


// Store in a static field to allow for test manipulation and emergency workarounds via reflection.
// Note this is not placed in the Uri class in order to avoid circular static dependencies.
const s_QuirksVersion:UriQuirksVersion =
	(BinaryCompatibility.TargetsAtLeast_Desktop_V4_5
		// || BinaryCompatibility.TargetsAtLeast_Silverlight_V6
		// || BinaryCompatibility.TargetsAtLeast_Phone_V8_0
	) ? UriQuirksVersion.V3 : UriQuirksVersion.V2;

const ShouldUseLegacyV2Quirks:boolean = s_QuirksVersion<=UriQuirksVersion.V2;


function FetchSyntax(
	syntax:UriParser,
	lwrCaseSchemeName:string,
	defaultPort:number/*int*/):void
{
	if(syntax.schemeName)
		throw new InvalidOperationException(SR.GetString(SR.net_uri_NeedFreshParser, syntax.schemeName));

	//lock(table)
	//{
	syntax._flags &= ~UriSyntaxFlags.V1_UnknownUri;
	var oldSyntax:UriParser = table[lwrCaseSchemeName];
	if(oldSyntax)
		throw new InvalidOperationException(SR.GetString(SR.net_uri_AlreadyRegistered, oldSyntax.schemeName));

	oldSyntax = tempTable[syntax.schemeName];
	if(oldSyntax)
	{
		// optimization on schemeName, will try to keep the first reference
		lwrCaseSchemeName = oldSyntax._scheme;
		delete tempTable[lwrCaseSchemeName];
	}

	syntax.OnRegister(lwrCaseSchemeName, defaultPort);
	syntax._scheme = lwrCaseSchemeName;
	syntax.CheckSetIsSimpleFlag();
	syntax._port = defaultPort;

	table[syntax.schemeName] = syntax;
}


//
// Various Uri scheme syntax flags
//
const UnknownV1SyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.V1_UnknownUri | // This flag must be always set here
	UriSyntaxFlags.OptionalAuthority |
	UriSyntaxFlags.MayHaveUserInfo |
	UriSyntaxFlags.MayHavePort |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveQuery |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.AllowEmptyHost |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.AllowAnyOtherHost | // V1.1 has a bug and so does not support this case
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.AllowDOSPath |
	UriSyntaxFlags.ConvertPathSlashes | // V1 compat, it will always convert backslashes
	UriSyntaxFlags.CompressPath | // V1 compat, it will always compress path even for non hierarchical Uris
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;

const HttpSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.MayHaveUserInfo |
	UriSyntaxFlags.MayHavePort |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveQuery |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.ConvertPathSlashes |
	UriSyntaxFlags.CompressPath |
	UriSyntaxFlags.CanonicalizeAsFilePath |
	(ShouldUseLegacyV2Quirks
		? UriSyntaxFlags.UnEscapeDotsAndSlashes : UriSyntaxFlags.None) |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;

const FtpSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.MayHaveUserInfo |
	UriSyntaxFlags.MayHavePort |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.ConvertPathSlashes |
	UriSyntaxFlags.CompressPath |
	UriSyntaxFlags.CanonicalizeAsFilePath |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;

const FileSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.AllowEmptyHost |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveFragment |
	(ShouldUseLegacyV2Quirks
		? UriSyntaxFlags.None : UriSyntaxFlags.MayHaveQuery) |
	UriSyntaxFlags.FileLikeUri |
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.AllowDOSPath |
	UriSyntaxFlags.ConvertPathSlashes |
	UriSyntaxFlags.CompressPath |
	UriSyntaxFlags.CanonicalizeAsFilePath |
	UriSyntaxFlags.UnEscapeDotsAndSlashes |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;


const VsmacrosSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.AllowEmptyHost |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.FileLikeUri |
	UriSyntaxFlags.AllowDOSPath |
	UriSyntaxFlags.ConvertPathSlashes |
	UriSyntaxFlags.CompressPath |
	UriSyntaxFlags.CanonicalizeAsFilePath |
	UriSyntaxFlags.UnEscapeDotsAndSlashes |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;

const GopherSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.MayHaveUserInfo |
	UriSyntaxFlags.MayHavePort |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing |
	UriSyntaxFlags.KeepTailLWS;

//Note that NNTP and NEWS are quite different in syntax
const NewsSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.AllowIriParsing;

const NntpSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.MayHaveUserInfo |
	UriSyntaxFlags.MayHavePort |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;


const TelnetSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.MayHaveUserInfo |
	UriSyntaxFlags.MayHavePort |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;


const LdapSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.AllowEmptyHost |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.MayHaveUserInfo |
	UriSyntaxFlags.MayHavePort |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveQuery |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;


const MailtoSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.AllowEmptyHost |
	UriSyntaxFlags.AllowUncHost |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.MayHaveUserInfo |
	UriSyntaxFlags.MayHavePort |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.MayHaveQuery |
	UriSyntaxFlags.MailToLikeUri |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;


const NetPipeSyntaxFlags:UriSyntaxFlags =
	UriSyntaxFlags.MustHaveAuthority |
	UriSyntaxFlags.MayHavePath |
	UriSyntaxFlags.MayHaveQuery |
	UriSyntaxFlags.MayHaveFragment |
	UriSyntaxFlags.AllowAnInternetHost |
	UriSyntaxFlags.PathIsRooted |
	UriSyntaxFlags.ConvertPathSlashes |
	UriSyntaxFlags.CompressPath |
	UriSyntaxFlags.CanonicalizeAsFilePath |
	UriSyntaxFlags.UnEscapeDotsAndSlashes |
	UriSyntaxFlags.AllowIdn |
	UriSyntaxFlags.AllowIriParsing;


const NetTcpSyntaxFlags:UriSyntaxFlags =
	NetPipeSyntaxFlags |
	UriSyntaxFlags.MayHavePort;


//var tempTable = new StringKeyDictionary<UriParser>();

const c_UpdatableFlags = UriSyntaxFlags.UnEscapeDotsAndSlashes;
const c_MaxCapacity = 512;

const NoDefaultPort = -1 | 0;

const table:IMap<UriParser> = {};
var tempTable:IMap<UriParser> = {};

//Now we will call for the instance constructors that will interrupt this static one.

// Below we simulate calls into FetchSyntax() but avoid using lock() and other things redundant for a .cctor

const HttpUri = new BuiltInUriParser("http", 80, HttpSyntaxFlags);
table[HttpUri.schemeName] = HttpUri;                   //HTTP

const HttpsUri = new BuiltInUriParser("https", 443, HttpSyntaxFlags);// HttpUri.this._flags);
table[HttpsUri.schemeName] = HttpsUri;                  //HTTPS cloned from HTTP

const WsUri = new BuiltInUriParser("ws", 80, HttpSyntaxFlags);
table[WsUri.schemeName] = WsUri;                   // WebSockets

const WssUri = new BuiltInUriParser("wss", 443, HttpSyntaxFlags);
table[WssUri.schemeName] = WssUri;                  // Secure WebSockets

const FtpUri = new BuiltInUriParser("ftp", 21, FtpSyntaxFlags);
table[FtpUri.schemeName] = FtpUri;                    //FTP

const FileUri = new BuiltInUriParser("file", NoDefaultPort, FileSyntaxFlags);
table[FileUri.schemeName] = FileUri;                   //FILE

const GopherUri = new BuiltInUriParser("gopher", 70, GopherSyntaxFlags);
table[GopherUri.schemeName] = GopherUri;                 //GOPHER

const NntpUri = new BuiltInUriParser("nntp", 119, NntpSyntaxFlags);
table[NntpUri.schemeName] = NntpUri;                   //NNTP

const NewsUri = new BuiltInUriParser("news", NoDefaultPort, NewsSyntaxFlags);
table[NewsUri.schemeName] = NewsUri;                   //NEWS

const MailToUri = new BuiltInUriParser("mailto", 25, MailtoSyntaxFlags);
table[MailToUri.schemeName] = MailToUri;                 //MAILTO

const UuidUri = new BuiltInUriParser("uuid", NoDefaultPort, NewsSyntaxFlags);// NewsUri._flags);
table[UuidUri.schemeName] = UuidUri;                   //UUID cloned from NEWS

const TelnetUri = new BuiltInUriParser("telnet", 23, TelnetSyntaxFlags);
table[TelnetUri.schemeName] = TelnetUri;                 //TELNET

const LdapUri = new BuiltInUriParser("ldap", 389, LdapSyntaxFlags);
table[LdapUri.schemeName] = LdapUri;                   //LDAP

const NetTcpUri = new BuiltInUriParser("net.tcp", 808, NetTcpSyntaxFlags);
table[NetTcpUri.schemeName] = NetTcpUri;

const NetPipeUri = new BuiltInUriParser("net.pipe", NoDefaultPort, NetPipeSyntaxFlags);
table[NetPipeUri.schemeName] = NetPipeUri;

const VsMacrosUri = new BuiltInUriParser("vsmacros", NoDefaultPort, VsmacrosSyntaxFlags);
table[VsMacrosUri.schemeName] = VsMacrosUri;               //VSMACROS

const SchemeOnlyFlags:UriSyntaxFlags = UriSyntaxFlags.MayHavePath;


class UriParser
{
	protected _scheme:string;
	protected _port:number;


	protected _updatableFlags:UriSyntaxFlags;
	protected _updatableFlagsUsed:boolean;

	constructor(protected _flags:UriSyntaxFlags = SchemeOnlyFlags)
	{
		this._scheme = '';
	}

	get schemeName():string
	{
		return this._scheme;
	}

	get DefaultPort():number
	{
		return this._port;
	}

	protected OnNewUri():UriParser

	/*
	 Is called on each Uri ctor for every non-simple parser i.e. the one that does have
	 user code.
	*/

	{
		return this;
	}

	/*
	 Is called whenever a parser gets registered with some scheme
	 The base implementation is a nop.
	*/

	protected OnRegister(schemeName:string, defaultPort:number /* int */):void
	{

	}

	/*
	 Parses and validates a Uri object, is called at the Uri ctor time.

	 This method returns a non null parsingError if Uri being created is invalid:
	*/

	protected InitializeAndValidate(
		uri:Uri,
		parsingError:{out:UriFormatException}):void
	{
		parsingError.out = uri.ParseMinimal();
	}

	/*
	 Resolves a relative Uri object into new AbsoluteUri.

	  baseUri         - The baseUri used to resolve this Uri.
	  relativeuri     - A relative Uri string passed by the application.

	 This method returns:
	 The result Uri value used to represent a new Uri
	*/

	protected Resolve(
		baseUri:Uri,
		relativeUri:Uri,
		parsingError:{out:UriFormatException}):string
	{
		if(baseUri.UserDrivenParsing)
			throw new InvalidOperationException(SR.GetString(SR.net_uri_UserDrivenParsing, this.GetType().FullName));

		if(!baseUri.IsAbsoluteUri)
			throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));


		var newUriString:string = null;
		var userEscaped = false;
		var result:Uri = Uri.ResolveHelper(
			baseUri,
			relativeUri,
			{ref: newUriString},
			{ref: userEscaped},
			parsingError);

		if(parsingError.out!=null)
			return null;

		if(result!=null)
			return result.OriginalString;

		return newUriString;
	}

	protected IsBaseOf(baseUri:Uri, relativeUri:Uri):boolean
	{
		return baseUri.IsBaseOfHelper(relativeUri);
	}

	/*
	 This method is invoked to allow a cutsom parser to override the
	 internal parser when serving application with Uri componenet strings.
	 The output format depends on the "format" parameter

	 Parameters:
	  uriComponents   - Which components are to be retrieved.
	  uriFormat       - The requested output format.

	 This method returns:
	 The final result. The base impementaion could be invoked to get a suggested value
	*/

	protected GetComponents(uri:Uri, components:UriComponents, format:UriFormat):string
	{
		if(((components & UriComponents.SerializationInfoString)!=0) && components!=UriComponents.SerializationInfoString)
			throw new ArgumentOutOfRangeException("components", components, SR.GetString(SR.net_uri_NotJustSerialization));

		if((format & ~UriFormat.SafeUnescaped)!=0)
			throw new ArgumentOutOfRangeException("format");

		if(uri.UserDrivenParsing)
			throw new InvalidOperationException(SR.GetString(SR.net_uri_UserDrivenParsing, this.GetType().FullName));

		if(!uri.IsAbsoluteUri)
			throw new InvalidOperationException(SR.GetString(SR.net_uri_NotAbsolute));

		return uri.GetComponentsHelper(components, format);
	}


	protected IsWellFormedOriginalString(uri:Uri):boolean
	{
		return uri.InternalIsWellFormedOriginalString();
	}

	//
	// Static Registration methods
	//

	/**
	 * Registers a custom Uri parser based on a scheme string
	 */
	static Register(uriParser:UriParser, schemeName:string, defaultPort:number):void
	{
		ExceptionHelper.InfrastructurePermission.Demand();

		if(uriParser==null)
			throw new ArgumentNullException("uriParser");

		if(schemeName==null)
			throw new ArgumentNullException("schemeName");

		if(schemeName.length==1)
			throw new ArgumentOutOfRangeException("schemeName");

		if(!Uri.CheckSchemeName(schemeName))
			throw new ArgumentOutOfRangeException("schemeName",schemeName);

		if((defaultPort>=0xFFFF || defaultPort<0) && defaultPort!= -1)
			throw new ArgumentOutOfRangeException("defaultPort",defaultPort);

		schemeName = schemeName.toLowerCase();//CultureInfo.InvariantCulture);
		this.FetchSyntax(uriParser, schemeName, defaultPort);
	}

	/**
	 Is a Uri scheme known to System.Uri?
	 */
	static IsKnownScheme(schemeName:string):boolean
	{
		if(schemeName==null)
			throw new ArgumentNullException("schemeName");

		if(!Uri.CheckSchemeName(schemeName))
			throw new ArgumentOutOfRangeException("schemeName");

		var syntax = UriParser.GetSyntax(schemeName.ToLower(CultureInfo.InvariantCulture));
		return syntax!=null && syntax.NotAny(UriSyntaxFlags.V1_UnknownUri);
	}

}

class BuiltInUriParser extends UriParser
{
	//
	// All BuiltIn parsers use that ctor. They are marked with "simple" and "built-in" flags
	//


	constructor(
		scheme:string,
		port:number,
		syntaxFlags:UriSyntaxFlags)
	{
		super(syntaxFlags | UriSyntaxFlags.SimpleUserSyntax | UriSyntaxFlags.BuiltInSyntax);
		this._scheme = scheme && scheme.toLowerCase();
		this._port = port;
	}


	get Flags():UriSyntaxFlags
	{
		return this._flags;
	}

	/**
	 * Returns true if none of the flags specified in 'flags' are set.
	 */
	NotAny(flags:UriSyntaxFlags):boolean
	{
		return this.IsFullMatch(flags, UriSyntaxFlags.None);
	}

	/**
	 * Returns true if at least one of the flags in 'flags' is set.
	 */
	InFact(flags:UriSyntaxFlags):boolean
	{
		return !this.IsFullMatch(flags, UriSyntaxFlags.None);
	}

	/**
	 *    Returns true if all flags in 'flags' are set.
	 */
	IsAllSet(flags:UriSyntaxFlags):boolean
	{

		return this.IsFullMatch(flags, flags);
	}

	private IsFullMatch(
		flags:UriSyntaxFlags,
		expected:UriSyntaxFlags)
	{
		/*
			 Return true, if masking the current set of flags with 'flags' equals 'expected'.
			 Definition 'current set of flags':
			 a) if updatable flags were never set: this._flags
			 b) if updatable flags were set: set union between all flags in this._flags which are not updatable
				(i.e. not part of c_UpdatableFlags) and all flags in _UpdatableFlags
		*/


		var mergedFlags:UriSyntaxFlags;

		// if none of the flags in 'flags' is an updatable flag, we ignore _UpdatableFlags
		if(((flags & c_UpdatableFlags)==0) || !_UpdatableFlagsUsed)
		{
			mergedFlags = this._flags;
		}
		else
		{
			// mask this._flags to only use the flags not in c_UpdatableFlags
			mergedFlags = (this._flags & (~c_UpdatableFlags)) | _UpdatableFlags;
		}

		return (mergedFlags & flags)==expected;
	}


	static FindOrFetchAsUnknownV1Syntax(lwrCaseScheme:string):UriParser
	{

		// check may be other thread just added one

		var syntax:UriParser = table[lwrCaseScheme];
		if(!syntax) syntax = tempTable[lwrCaseScheme];

		if(!syntax)
		{

			//lock(table)
			//{
			// This is a bit paranoid but let's prevent static table growing infinitly
			// TODO: Fix this...
			//if(tempTable.Count>=c_MaxCapacity)
			//{
			//	tempTable = new Dictionary<String, UriParser>(c_InitialTableSize);
			//}
			syntax = new BuiltInUriParser(lwrCaseScheme, NoDefaultPort, UnknownV1SyntaxFlags);
			tempTable[lwrCaseScheme] = syntax;
			//}

		}
		return syntax;
	}


	static GetSyntax(lwrCaseScheme:string):UriParser
	{
		return table[lwrCaseScheme] || tempTable[lwrCaseScheme];
	}

//
// Builtin and User Simple syntaxes do not need custom validation/parsing (i.e. virtual method calls),
//
	get IsSimple():boolean
	{
		return this.InFact(UriSyntaxFlags.SimpleUserSyntax);
	}

	CheckSetIsSimpleFlag():void
	{

		if(this instanceof GenericUriParser
			|| this instanceof HttpStyleUriParser
			|| this instanceof FtpStyleUriParser
			|| this instanceof FileStyleUriParser
			|| this instanceof NewsStyleUriParser
			|| this instanceof GopherStyleUriParser
			|| this instanceof NetPipeStyleUriParser
			|| this instanceof NetTcpStyleUriParser
			|| this instanceof LdapStyleUriParser
		)
		{
			this._flags |= UriSyntaxFlags.SimpleUserSyntax;
		}
	}

//
// This method is used to update flags. The scenario where this is needed is when the user specifies
// flags in the config file. The config file is read after UriParser instances were created.
//
	SetUpdatableFlags(flags:UriSyntaxFlags):void
	{

		// TODO: fix this
		//Debug.Assert(!_UpdatableFlagsUsed,
		//	"SetUpdatableFlags() already called. It can only be called once per parser.");
		//Debug.Assert((flags & (~c_UpdatableFlags))==0, "Only updatable flags can be set.");

		// No locks necessary. Reordering won't happen due to volatile.
		this._updatableFlags = flags;
		this._updatableFlagsUsed = true;
	}

//
// These are simple internal wrappers that will call virtual protected methods
// (to avoid "protected internal" siganures in the public docs)
//


	InternalOnNewUri():UriParser
	{
		var effectiveParser:UriParser = this.OnNewUri();
		if(this!=effectiveParser)
		{
			effectiveParser._scheme = _Scheme;
			effectiveParser._port = _Port;
			effectiveParser._flags = this._flags;
		}
		return effectiveParser;
	}


	InternalValidate(
		thisUri:Uri,
		parsingError:{out: UriFormatException}):void
	{
		this.InitializeAndValidate(thisUri, parsingError);
	}


	InternalResolve(
		thisBaseUri:Uri,
		uriLink:Uri,
		parsingError:{out:UriFormatException}):string
	{
		return this.Resolve(thisBaseUri, uriLink, parsingError);
	}


	InternalIsBaseOf(
		thisBaseUri:Uri,
		uriLink:Uri):boolean
	{
		return this.IsBaseOf(thisBaseUri, uriLink);
	}


	InternalGetComponents(
		thisUri:Uri
		, uriComponents:UriComponents
		, uriFormat:UriFormat):string
	{
		return this.GetComponents(thisUri, uriComponents, uriFormat);
	}

	InternalIsWellFormedOriginalString(thisUri:Uri):boolean
	{
		return this.IsWellFormedOriginalString(thisUri);
	}
}
