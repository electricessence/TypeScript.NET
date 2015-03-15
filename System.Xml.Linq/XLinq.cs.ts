
module System.Xml.Linq.cs
{
	/// <summary>
	/// Represents a name of an XML element or attribute. This class cannot be inherited.
	/// </summary>
	export /*sealed*/ class XName implements IEquatable<XName>
	{
		private ns: XNamespace;
		private localName: string;
		private hashCode: number/*int*/;

	/// <summary>
	/// Constructor, /*internal*/ so that external users must go through the Get() method to create an XName.
	/// </summary>
	/*internal*/ XName(ns: XNamespace, localName: string)
		{
			this.ns = ns;
			this.localName = XmlConvert.VerifyNCName(localName);
			this.hashCode = ns.GetHashCode() ^ localName.GetHashCode();
		}

		/// <summary>
		/// Gets the local (unqualified) part of the name.
		/// </summary>
		/// <seealso cref="XName.Namespace"/>
		get LocalName(): string
		{
			return localName;
		}

		/// <summary>
		/// Gets the namespace of the name.
		/// </summary>
		get Namespace(): XNamespace
		{
			return ns;
		}

		/// <summary>
		/// Gets the namespace name part of the name.
		/// </summary>
		get NamespaceName(): string
		{
			return ns.NamespaceName;
		}
	

		/// <summary>
		/// Returns the expanded XML name in the format: {namespaceName}localName.
		/// </summary>
		ToString(): string
		{
			if (ns.NamespaceName.length == 0) return localName;
			return "{" + ns.NamespaceName + "}" + localName;
		}

		/// <summary>
		/// Returns an <see cref="XName"/> object created from the specified expanded name.
		/// </summary>
		/// <param name="expandedName">
		/// A string containing an expanded XML name in the format: {namespace}localname.
		/// </param>
		/// <returns>
		/// An <see cref="XName"/> object constructed from the specified expanded name.
		/// </returns>
		static Get(expandedName: string): XName
		{
			if (expandedName == null) throw 'ArgumentNullException("expandedName")';
			if (expandedName.length == 0) throw 'ArgumentException(Res.GetString(Res.Argument_InvalidExpandedName, expandedName))';
			if (expandedName[0] == '{')
			{
				var i: number/*int*/ = expandedName.LastIndexOf('}');
				if (i <= 1 || i == expandedName.length - 1) throw 'ArgumentException(Res.GetString(Res.Argument_InvalidExpandedName, expandedName))';
				return XNamespace.Get(expandedName, 1, i - 1).GetName(expandedName, i + 1, expandedName.length - i - 1);
			}
			else
			{
				return XNamespace.None.GetName(expandedName);
			}
		}

		/// <summary>
		/// Returns an <see cref="XName"/> object from a local name and a namespace.
		/// </summary>
		/// <param name="localName">A local (unqualified) name.</param>
		/// <param name="namespaceName">An XML namespace.</param>
		/// <returns>An XName object created from the specified local name and namespace.</returns>
		static Get(localName: string, namespaceName: string): XName
		{
			return XNamespace.Get(namespaceName).GetName(localName);
		}

		/// <summary>
		/// Converts a string formatted as an expanded XML name ({namespace}localname) to an XName object.
		/// </summary>
		/// <param name="expandedName">A string containing an expanded XML name in the format: {namespace}localname.</param>
		/// <returns>An XName object constructed from the expanded name.</returns>        
		public static implicit operator XName(expandedName: string)
		{
			return expandedName != null ? Get(expandedName) : null;
		}

		/// <summary>
		/// Determines whether the specified <see cref="XName"/> is equal to the current <see cref="XName"/>.
		/// </summary>
		/// <param name="obj">The XName to compare to the current XName.</param>
		/// <returns>
		/// true if the specified <see cref="XName"/> is equal to the current XName; otherwise false.
		/// </returns>
		/// <remarks>
		/// For two <see cref="XName"/> objects to be equal, they must have the same expanded name.
		/// </remarks>
		Equals(obj: any): boolean
		{
			return <any>this == obj;
		}

		/// <summary>
		/// Serves as a hash function for <see cref="XName"/>. GetHashCode is suitable 
		/// for use in hashing algorithms and data structures like a hash table.  
		/// </summary>
		GetHashCode(): number/*int*/
		{
			return hashCode;
		}

		// The overloads of == and != are included to enable comparisons between
		// XName and string (e.g. element.Name == "foo"). C#'s predefined reference
		// equality operators require one operand to be convertible to the type of
		// the other through reference conversions only and do not consider the
		// implicit conversion from string to XName.

		/// <summary>
		/// Returns a value indicating whether two instances of <see cref="XName"/> are equal.
		/// </summary>
		/// <param name="left">The first XName to compare.</param>
		/// <param name="right">The second XName to compare.</param>
		/// <returns>true if left and right are equal; otherwise false.</returns>
		/// <remarks>
		/// This overload is included to enable the comparison between
		/// an instance of XName and string.
		/// </remarks>
		//	public static boolean operator == (left:XName, right:XName)
		//{
		//	return <any>left == <any>right;
		//}

		/// <summary>
		/// Returns a value indicating whether two instances of <see cref="XName"/> are not equal.
		/// </summary>
		/// <param name="left">The first XName to compare.</param>
		/// <param name="right">The second XName to compare.</param>
		/// <returns>true if left and right are not equal; otherwise false.</returns>
		/// <remarks>
		/// This overload is included to enable the comparison between
		/// an instance of XName and string.
		/// </remarks>
		//	public static boolean operator != (left:XName, right:XName)
		//{
		//	return <any>left != <any>right;
		//}

		/// <summary>
		/// Indicates whether the current <see cref="XName"/> is equal to 
		/// the specified <see cref="XName"/>
		/// </summary>
		/// <param name="other">The <see cref="XName"/> to compare with the
		/// current <see cref="XName"/></param> 
		/// <returns>
		/// Returns true if the current <see cref="XName"/> is equal to
		/// the specified <see cref="XName"/>. Returns false otherwise. 
		/// </returns>
		//IEquatable<XName>.Equals(other:XName):boolean
		//	{
		//		return<any>this == <any>other;
		//	}

	}


	/// <summary>
	/// Represents an XML namespace. This class cannot be inherited.
	/// </summary>
	export /*sealed*/ class XNamespace
	{
	/*internal*/ const var xmlPrefixNamespace: string = "http://www.w3.org/XML/1998/namespace";
/*internal*/ const var xmlnsPrefixNamespace: string = "http://www.w3.org/2000/xmlns/";

		static XHashtable < WeakReference > namespaces;
		static WeakReference refNone;
		static WeakReference refXml;
		static WeakReference refXmlns;

	string namespaceName;
	number/*int*/ hashCode;
	XHashtable < XName > names;

	const var NamesCapacity: number/*int*/ = 8;           // Starting capacity of XName table, which must be power of 2
	const var NamespacesCapacity: number/*int*/ = 32;     // Starting capacity of XNamespace table, which must be power of 2

/// <summary>
/// Constructor, /*internal*/ so that external users must go through the Get() method to create an XNamespace.
/// </summary>
/*internal*/ XNamespace(namespaceName:string)
	{
		this.namespaceName = namespaceName;
		this.hashCode = namespaceName.GetHashCode();
		names = new XHashtable<XName>(ExtractLocalName, NamesCapacity);
	}

	/// <summary>
	/// Gets the namespace name of the namespace.
	/// </summary>
	get NamespaceName():string
	{
		return namespaceName;
	}

	/// <summary>
	/// Returns an XName object created from the current instance and the specified local name.
	/// </summary>
	/// <remarks>
	/// The returned XName object is guaranteed to be atomic (i.e. the only one in the system for this
	/// particular expanded name).
	/// </remarks>
	GetName(localName:string):XName
	{
		if (localName == null) throw 'ArgumentNullException("localName")';
		return GetName(localName, 0, localName.length);
	}

	/// <summary>
	/// Returns the namespace name of this <see cref="XNamespace"/>.
	/// </summary>
	/// <returns>A string value containing the namespace name.</returns>
	ToString():string
	{
		return namespaceName;
	}

		/// <summary>
		/// Gets the XNamespace object that corresponds to no namespace.
		/// </summary>
		/// <remarks>
		/// If an element or attribute is in no namespace, its namespace
		/// will be set to the namespace returned by this property.
		/// </remarks>
		public static XNamespace None
	{
		get
		{
			return EnsureNamespace(refNone:ref, string.Empty);
		}
	}

		/// <summary>
		/// Gets the XNamespace object that corresponds to the xml uri (http://www.w3.org/XML/1998/namespace).
		/// </summary>
		public static XNamespace Xml
	{
		get
		{
			return EnsureNamespace(refXml:ref, xmlPrefixNamespace);
		}
	}

		/// <summary>
		/// Gets the XNamespace object that corresponds to the xmlns uri (http://www.w3.org/2000/xmlns/).
		/// </summary>
		public static XNamespace Xmlns
	{
		get
		{
			return EnsureNamespace(refXmlns:ref, xmlnsPrefixNamespace);
		}
	}

		/// <summary>
		/// Gets an XNamespace created from the specified namespace name.
		/// </summary>
		/// <remarks>
		/// The returned XNamespace object is guaranteed to be atomic
		/// (i.e. the only one in the system for that particular namespace name).
		/// </remarks>
		static Get(namespaceName:string):XNamespace
	{
		if (namespaceName == null) throw 'ArgumentNullException("namespaceName")';
		return Get(namespaceName, 0, namespaceName.length);
	}

/// <summary>
/// Converts a string containing a namespace name to an XNamespace.
/// </summary>
/// <param name="namespaceName">A string containing the namespace name.</param>
/// <returns>An XNamespace constructed from the namespace name string.</returns>

		public static implicit operator XNamespace(namespaceName:string)
	{
		return namespaceName != null ? Get(namespaceName) : null;
	}

/// <summary>
/// Combines an <see cref="XNamespace"/> object with a local name to create an <see cref="XName"/>.
/// </summary>
/// <param name="ns">The namespace for the expanded name.</param>
/// <param name="localName">The local name for the expanded name.</param>
/// <returns>The new XName constructed from the namespace and local name.</returns>        

		public static XName operator + (ns:XNamespace, localName:string)
	{
		if (ns == null) throw 'ArgumentNullException("ns")';
		return ns.GetName(localName);
	}

	/// <summary>
	/// Determines whether the specified <see cref="XNamespace"/> is equal to the current <see cref="XNamespace"/>.
	/// </summary>
	/// <param name="obj">The XNamespace to compare to the current XNamespace.</param>
	/// <returns>
	/// true if the specified <see cref="XNamespace"/> is equal to the current XNamespace; otherwise false.
	/// </returns>
	/// <remarks>
	/// For two <see cref="XNamespace"/> objects to be equal they must have the same 
	/// namespace name.
	/// </remarks>
	Equals(obj:any):boolean
	{
		return <any>this == obj;
	}

	/// <summary>
	/// Serves as a hash function for <see cref="XNamespace"/>. GetHashCode is suitable 
	/// for use in hashing algorithms and data structures like a hash table.  
	/// </summary>
	GetHashCode():number/*int*/
	{
		return hashCode;
	}


		// The overloads of == and != are included to enable comparisons between
		// XNamespace and string (e.g. element.Name.Namespace == "foo"). C#'s
		// predefined reference equality operators require one operand to be
		// convertible to the type of the other through reference conversions only
		// and do not consider the implicit conversion from string to XNamespace.

		/// <summary>
		/// Returns a value indicating whether two instances of <see cref="XNamespace"/> are equal.
		/// </summary>
		/// <param name="left">The first XNamespace to compare.</param>
		/// <param name="right">The second XNamespace to compare.</param>
		/// <returns>true if left and right are equal; otherwise false.</returns>
		/// <remarks>
		/// This overload is included to enable the comparison between
		/// an instance of XNamespace and string.
		/// </remarks>
		public static boolean operator == (left:XNamespace, right:XNamespace)
	{
		return <any>left == <any>right;
	}

		/// <summary>
		/// Returns a value indicating whether two instances of <see cref="XNamespace"/> are not equal.
		/// </summary>
		/// <param name="left">The first XNamespace to compare.</param>
		/// <param name="right">The second XNamespace to compare.</param>
		/// <returns>true if left and right are not equal; otherwise false.</returns>
		/// <remarks>
		/// This overload is included to enable the comparison between
		/// an instance of XNamespace and string.
		/// </remarks>
		public static boolean operator != (left:XNamespace, right:XNamespace)
	{
		return <any>left != <any>right;
	}

/// <summary>
/// Returns an <see cref="XName"/> created from this XNamespace <see cref="XName"/> and a portion of the passed in
/// local name parameter.  The returned XName object is guaranteed to be atomic (i.e. the only one in the system for
/// this particular expanded name).
/// </summary>
/*internal*/ XName GetName(localName:string, number/*int*/ index, count:number/*int*/)
	{
		Debug.Assert(index >= 0 && index <= localName.length, "Caller should have checked that index was in bounds");
		Debug.Assert(count >= 0 && index + count <= localName.length, "Caller should have checked that count was in bounds");

	// Attempt to get the local name from the hash table
	private name: XName;
		if (names.TryGetValue(localName, index, count, name:out))
			return name;

		// No local name has yet been added, so add it now
		return names.Add(new XName(this, localName.Substring(index, count)));
	}

/// <summary>
/// Returns an <see cref="XNamespace"/> created from a portion of the passed in namespace name parameter.  The returned XNamespace
/// object is guaranteed to be atomic (i.e. the only one in the system for this particular namespace name).
/// </summary>
/*internal*/ static XNamespace Get(namespaceName:string, number/*int*/ index, count:number/*int*/)
	{
		Debug.Assert(index >= 0 && index <= namespaceName.length, "Caller should have checked that index was in bounds");
		Debug.Assert(count >= 0 && index + count <= namespaceName.length, "Caller should have checked that count was in bounds");

		if (count == 0) return None;

		// Use CompareExchange to ensure that exactly one XHashtable<WeakReference> is used to store namespaces
		if (namespaces == null)
			Interlocked.CompareExchange(namespaces:ref, new XHashtable<WeakReference>(ExtractNamespace, NamespacesCapacity), null);

	private refNamespace: WeakReference;
private ns: XNamespace;

		// Keep looping until a non-null namespace has been retrieved
		do
		{
			// Attempt to get the WeakReference for the namespace from the hash table
			if (!namespaces.TryGetValue(namespaceName, index, count, refNamespace:out))
			{
				// If it is not there, first determine whether it's a special namespace
				if (count == xmlPrefixNamespace.length && string.CompareOrdinal(namespaceName, index, xmlPrefixNamespace, 0, count) == 0) return Xml;
				if (count == xmlnsPrefixNamespace.length && string.CompareOrdinal(namespaceName, index, xmlnsPrefixNamespace, 0, count) == 0) return Xmlns;

				// Go ahead and create the namespace and add it to the var refNamespace:table = namespaces.Add(new WeakReference(new XNamespace(namespaceName.Substring(index, count))));
			}

			ns = (refNamespace != null) ? <XNamespace>refNamespace.Target : null;
		}
		while (ns == null);

		return ns;
	}

		/// <summary>
		/// This function is used by the <![CDATA[XHashtable<XName>]]> to extract the local name part from an XName.  The hash table
		/// uses the local name as the hash key.
		/// </summary>
		private static string ExtractLocalName(n:XName)
	{
		Debug.Assert(n != null, "Null name should never exist here");
		return n.LocalName;
	}

		/// <summary>
		/// This function is used by the <![CDATA[XHashtable<WeakReference>]]> to extract the XNamespace that the WeakReference is
		/// referencing.  In cases where the XNamespace has been cleaned up, this function returns null.
		/// </summary>
		private static string ExtractNamespace(r:WeakReference)
	{
	private ns: XNamespace;

		if (r == null || (ns = <XNamespace>r.Target) == null)
			return null;

		return ns.NamespaceName;
	}

		/// <summary>
		/// Ensure that an XNamespace object for 'namespaceName' has been atomically created.  In other words, all outstanding
		/// references to this particular namespace, on any thread, must all be to the same object.  Care must be taken,
		/// since other threads can be concurrently calling this method, and the target of a WeakReference can be cleaned up
		/// at any time by the GC.
		/// </summary>
		private static XNamespace EnsureNamespace(ref WeakReference refNmsp, namespaceName:string)
	{
	private refOld: WeakReference;

		// Keep looping until a non-null namespace has been retrieved
		while (true)
		{
			// Save refNmsp in local variable, so we can work on a value that will not be changed by another var refOld:thread = refNmsp;

			if (refOld != null)
			{
				// If the target of the WeakReference is non-null, then we're done--just return the value
				var ns: XNamespace = <XNamespace>refOld.Target;
				if (ns != null) return ns;
			}

			// Either refNmsp is null, or its target is null, so update it
			// Make sure to do this atomically, so that we can guarantee atomicity of XNamespace objects
			Interlocked.CompareExchange(refNmsp:ref, new WeakReference(new XNamespace(namespaceName)), refOld);
		}
	}
}

/// <summary>
/// This is a thread-safe hash table which maps string keys to values of type TValue.  It is assumed that the string key is embedded in the hashed value
/// and can be extracted via a call to ExtractKeyDelegate (in order to save space and allow cleanup of key if value is released due to a WeakReference
/// TValue releasing its target).
/// </summary>
/// <remarks>
/// All methods on this class are thread-safe.
///
/// When the hash table fills up, it is necessary to resize it and rehash all contents.  Because this can be expensive,
/// a lock is taken, and one thread is responsible for the resize.  Other threads which need to add values must wait
/// for the resize to be complete.
///
/// Thread-Safety Notes
/// ===================
///
/// 1. Because performance and scalability are such a concern with the global name table, I have avoided the use of
///    BIFALOs (Big Fat Locks).  Instead, I use CompareExchange, Interlocked.Increment, barriers:memory, atomic state objects,
///    etc. to avoid locks.  Any changes to code which accesses these variables should be carefully reviewed and tested,
///    as it can be *very* tricky.  In particular, if you don't understand the CLR memory model or if you don't know
///    what a memory barrier is, DON'T attempt to modify this code.  A good discussion of these topics can be found at
///    <![CDATA[http://discuss.develop.com/archives/wa.exe?A2=ind0203B&L=DOTNET&P=R375]]>. 
///
/// 2. Because I am not sure if the CLR spec has changed since versions 1.0/1.1, I am assuming the weak memory model that
///    is described in the ECMA spec, in which normal writes can be reordered.  This means I must introduce more memory
///    barriers than otherwise would be necessary.
///
/// 3. There are several thread-safety concepts and patterns I utilize in this code:
///      a. Publishing -- There are a small number of places where state is exposed, published:or, to multiple threads.
///                       These places are marked with the comment "PUBLISH", and are key locations to consider when
///                       reviewing the code for thread-safety.
///
///      b. Immutable objects -- Immutable objects initialize their fields once in their constructor and then never modify
///                              them again.  As long as care is taken to ensure that initial field values are visible to
///                              other threads before publishing the immutable object itself, immutable objects are
///                              completely thread-safe.
///
///      c. Atomic state objects -- Locks typically are taken when several pieces of state must be updated atomically.  In
///                                 other words, there is a window in which state is inconsistent, and that window must
///                                 be protected from view by locking.  However, if a new object is created each time state
///                                 changes (or state changes substantially), then during creation the new object is only
///                                 visible to a single thread.  Once construction is complete, an assignment (guaranteed
///                                 atomic) can replace the old state object with the new state object, thus publishing a
///                                 consistent view to all threads.
///
///      d. Retry -- When several threads contend over shared state which only one is allowed to possess, it is possible
///                  to avoid locking by repeatedly attempting to acquire the shared state.  The CompareExchange method
///                  is useful for atomically ensuring that only one thread succeeds, and other threads are notified that
///                  they must retry.
///
/// 4. All variables which can be written by multiple threads are marked "SHARED STATE".
/// </remarks>
/*internal*/ /*sealed*/ class XHashtable<TValue>
{
	private XHashtableState state;                          // SHARED STATE: Contains all XHashtable state, so it can be atomically swapped when resizes occur

	private const var StartingHash: number/*int*/ = (5381 << 16) + 5381;   // Starting hash code value for string keys to be hashed

	/// <summary>
	/// Prototype of function which is called to extract a string key value from a hashed value.
	/// Returns null if the hashed value is invalid (e.g. value has been released due to a WeakReference TValue being cleaned up).
	/// </summary>
	public delegate string ExtractKeyDelegate(value:TValue);

	/// <summary>
	/// Construct a new XHashtable with the specified starting capacity.
	/// </summary>
	public XHashtable(extractKey:ExtractKeyDelegate, capacity:number/*int*/)
{
	state = new XHashtableState(extractKey, capacity);
}

/// <summary>
/// Get an existing value from the hash table.  Return false if no such value exists.
/// </summary>
TryGetValue(key:string, index:number/*int*/, count:number/*int*/, out TValue value):boolean
{
	return state.TryGetValue(key, index, count, value:out);
}

/// <summary>
/// Add a value to the hash table, hashed based on a string key embedded in it.  Return the added value (may be a different object than "value").
/// </summary>
Add(value:TValue):TValue
{
	private newValue: TValue;

	// Loop until value is in hash table
	while (true)
	{
		// Add new value
		// XHashtableState.TryAdd returns false if hash table is not big enough
		if (state.TryAdd(value, newValue:out))
			return newValue;

		// PUBLISH (state)
		// Hash table was not big enough, so resize it.
		// We only want one thread to perform a resize, as it is an expensive operation
		// First thread will perform resize; waiting threads will call Resize(), but should immediately
		// return since there will almost always be space in the hash table resized by the first thread.
		lock(this)
		{
			var newState: XHashtableState = state.Resize();

			Thread.MemoryBarrier();
		}
	}
}

/// <summary>
/// This class contains all the hash table state.  Rather than creating a bucket object, buckets are structs
/// packed into an array.  Buckets with the same truncated hash code are linked into lists, so that collisions
/// can be disambiguated.
/// </summary>
/// <remarks>
/// Note that the "buckets" and "entries" arrays are never themselves written by multiple threads.  Instead, the
/// *contents* of the array are written by multiple threads.  Resizing the hash table does not modify these variables,
/// or even modify the contents of these variables.  Instead, resizing makes an entirely new XHashtableState object
/// in which all entries are rehashed.  This strategy allows reader threads to continue finding values in the "old"
/// XHashtableState, while writer threads (those that need to add a new value to the table) are blocked waiting for
/// the resize to complete.
/// </remarks>
private /*sealed*/ class XHashtableState
{
	private number/*int*/[] buckets;                  // Buckets contain indexes into entries array (bucket values are SHARED STATE)
	private Entry[] entries;                // Entries contain linked lists of buckets (next pointers are SHARED STATE)
	private number/*int*/ numEntries;                 // SHARED STATE: Current number of entries (including orphaned entries)
	private ExtractKeyDelegate extractKey;  // Delegate called in order to extract string key embedded in hashed TValue

private const var EndOfList: number/*int*/ = 0;        // End of linked list marker
private const var FullList: number/*int*/ = -1;        // Indicates entries should not be added to end of linked list

	/// <summary>
	/// Construct a new XHashtableState object with the specified capacity.
	/// </summary>
	public XHashtableState(extractKey:ExtractKeyDelegate, capacity:number/*int*/)
{
	Debug.Assert((capacity & (capacity - 1)) == 0, "capacity must be a power of 2");
	Debug.Assert(extractKey != null, "extractKey may not be null");

	// Initialize hash table data structures, with specified maximum var buckets:capacity = new number/*int*/[capacity];
	entries = new Entry[capacity];

	// Save delegate
	this.extractKey = extractKey;
}

/// <summary>
/// If this table is not full, then just return "this".  Otherwise, create and return a new table with
/// additional capacity, and rehash all values in the table.
/// </summary>
Resize():XHashtableState
{
				// No need to resize if there are open entries
				if (numEntries < buckets.length)
		return this;

				var newSize: number/*int*/ = 0;

				// Determine capacity of resized hash table by first counting number of valid, non-orphaned entries
				// As this count proceeds, close all linked lists so that no additional entries can be added to them
				for (var bucketIdx: number/*int*/ = 0; bucketIdx < buckets.length; bucketIdx++)
				{
		var entryIdx: number/*int*/ = buckets[bucketIdx];

		if (entryIdx == EndOfList)
		{
			// Replace EndOfList with FullList, so that any threads still attempting to add will be forced to var entryIdx:resize = Interlocked.CompareExchange(ref buckets[bucketIdx], FullList, EndOfList);
		}

		// Loop until we've guaranteed that the list has been counted and closed to further adds
		while (entryIdx > EndOfList)
		{
			// Count each valid entry
			if (extractKey(entries[entryIdx].Value) != null)
				newSize++;

			if (entries[entryIdx].Next == EndOfList)
			{
				// Replace EndOfList with FullList, so that any threads still attempting to add will be forced to var entryIdx:resize = Interlocked.CompareExchange(ref entries[entryIdx].Next, FullList, EndOfList);
			}
			else
			{
				// Move to next entry in the var entryIdx:list = entries[entryIdx].Next;
			}
		}
		Debug.Assert(entryIdx == EndOfList, "Resize() should only be called by one thread");
				}

				// Double number of valid entries; if result is less than current capacity, then use current capacity
				if (newSize < buckets.length / 2)
				{
		newSize = buckets.length;
				}
				else
				{
		newSize = buckets.length * 2;

		if (newSize < 0)
			throw 'OverflowException()';
				}

				// Create new hash table with additional capacity
				var newHashtable: XHashtableState = new XHashtableState(extractKey, newSize);

				// Rehash names (TryAdd will always succeed, since we won't fill the new table)
				// Do not simply walk over entries and add them to table, as that would add orphaned
				// entries.  Instead, walk the linked lists and add each name.
				for (var bucketIdx: number/*int*/ = 0; bucketIdx < buckets.length; bucketIdx++)
				{
		var entryIdx: number/*int*/ = buckets[bucketIdx];
		private newValue: TValue;

		while (entryIdx > EndOfList)
		{
			newHashtable.TryAdd(entries[entryIdx].Value, newValue:out);
			Debug.Assert(<any>entries[entryIdx].Value == <any>newValue);

			entryIdx = entries[entryIdx].Next;
		}
		Debug.Assert(entryIdx == FullList, "Linked list should have been closed when it was counted");
				}

	return newHashtable;
}

/// <summary>
/// Attempt to find "key" in the table.  If the key exists, return the associated value in "value" and
/// return true.  Otherwise return false.
/// </summary>
TryGetValue(key:string, index:number/*int*/, count:number/*int*/, out TValue value):boolean
{
				var hashCode: number/*int*/ = ComputeHashCode(key, index, count);
				var entryIndex: number/*int*/ = 0;

				// If a matching entry is found, return its value
				if (FindEntry(hashCode, key, index, count, entryIndex:ref))
				{
		value = entries[entryIndex].Value;
		return true;
				}

				// No matching entry found, so return var value:false = default(TValue);
				return false;
}

/// <summary>
/// Attempt to add "value" to the table, hashed by an embedded string key.  If a value having the same key already exists,
/// then return the existing value in "newValue".  Otherwise, return the newly added value in "newValue".
///
/// If the hash table is full, return false.  Otherwise, return true.
/// </summary>
TryAdd(value:TValue, out TValue newValue):boolean
{
				number/*int*/ newEntry, entryIndex;
				private key: string;
private hashCode: number/*int*/;

	// Assume "value" will be added and returned as "newValue"
	newValue = value;

	// Extract the key from the value.  If it's null, then value is invalid and does not need to be added to table.
	key = extractKey(value);
	if (key == null)
		return true;

	// Compute hash code over entire length of var hashCode:key = ComputeHashCode(key, 0, key.length);

	// Assume value is not yet in the hash table, and prepare to add it (if table is full, false:return).
	// Use the entry index returned from Increment, which will never be zero, as zero conflicts with EndOfList.
	// Although this means that the first entry will never be used, it avoids the need to initialize all
	// starting buckets to the EndOfList value.
	newEntry = Interlocked.Increment(numEntries:ref);
	if (newEntry < 0 || newEntry >= buckets.length)
		return false;

	entries[newEntry].Value = value;
	entries[newEntry].HashCode = hashCode;

				Thread.MemoryBarrier();

	// Loop until a matching entry is found, a new entry is added, or linked list is found to be var entryIndex:full = 0;
	while (!FindEntry(hashCode, key, 0, key.length, entryIndex:ref))
	{
		// PUBLISH (slot:buckets)
		// No matching entry found, so add the new entry to the end of the list ("entryIndex" is index of last entry)
		if (entryIndex == 0)
			entryIndex = Interlocked.CompareExchange(ref buckets[hashCode & (buckets.length - 1)], newEntry, EndOfList);
		var entryIndex:else = Interlocked.CompareExchange(ref entries[entryIndex].Next, newEntry, EndOfList);

		// Return true only if the CompareExchange succeeded (happens when replaced value is EndOfList).
		// Return false if the linked list turned out to be full because another thread is currently resizing
		// the hash table.  In this case, entries[newEntry] is orphaned (not part of any linked list) and the
		// Add needs to be performed on the new hash table.  Otherwise, looping:keep, looking for new end of list.
		if (entryIndex <= EndOfList)
			return entryIndex == EndOfList;
	}

	// Another thread already added the value while this thread was trying to add, so return that instance instead.
	// Note that entries[newEntry] will be orphaned (not part of any linked list) in this var newValue:case = entries[entryIndex].Value;

	return true;
}

			/// <summary>
			/// Searches a linked list of entries, beginning at "entryIndex".  If "entryIndex" is 0, then search starts at a hash bucket instead.
			/// Each entry in the list is matched against the (hashCode, key, index, count) key.  If a matching entry is found, then its
			/// entry index is returned in "entryIndex" and true is returned.  If no matching entry is found, then the index of the last entry
			/// in the list (or 0 if list is empty) is returned in "entryIndex" and false is returned.
			/// </summary>
			/// <remarks>
			/// This method has the side effect of removing invalid entries from the list as it is traversed.
			/// </remarks>
			private boolean FindEntry(hashCode:number/*int*/, key:string, index:number/*int*/, count:number/*int*/, ref number/*int*/ entryIndex)
{
				var previousIndex: number/*int*/ = entryIndex;
				private currentIndex: number/*int*/;

	// Set initial value of currentIndex to index of the next entry following entryIndex
	if (previousIndex == 0)
		currentIndex = buckets[hashCode & (buckets.length - 1)];
	var currentIndex:else = previousIndex;

	// Loop while not at end of list
	while (currentIndex > EndOfList)
	{

		// Check for matching hash code, then matching key
		if (entries[currentIndex].HashCode == hashCode)
		{
			var keyCompare: string = extractKey(entries[currentIndex].Value);

			// If the key is invalid, then attempt to remove the current entry from the linked list.
			// This is thread-safe in the case where the Next field points to another entry, since once a Next field points
			// to another entry, it will never be modified to be EndOfList or FullList.
			if (keyCompare == null)
			{
				if (entries[currentIndex].Next > EndOfList)
				{
					// PUBLISH (buckets slot or entries slot)
					// Entry is invalid, so modify previous entry to point to its next entry
					entries[currentIndex].Value = default(TValue);
					currentIndex = entries[currentIndex].Next;

					if (previousIndex == 0)
						buckets[hashCode & (buckets.length - 1)] = currentIndex;
					else
						entries[previousIndex].Next = currentIndex;

					continue;
				}
			}
			else
			{
				// Valid key, so compare keys
				if (count == keyCompare.length && string.CompareOrdinal(key, index, keyCompare, 0, count) == 0)
				{
					// Found match, so return true and matching entry in var entryIndex:list = currentIndex;
					return true;
				}
			}
		}

		// Move to next var previousIndex:entry = currentIndex;
		currentIndex = entries[currentIndex].Next;
	}

	// Return false and last entry in var entryIndex:list = previousIndex;
	return false;
}

			/// <summary>
			/// Compute hash code for a string key (index, count substring of "key").  The algorithm used is the same on used in NameTable.cs in System.Xml.
			/// </summary>
			private static number/*int*/ ComputeHashCode(key:string, index:number/*int*/, count:number/*int*/)
{
				var hashCode: number/*int*/ = StartingHash;
				var end: number/*int*/ = index + count;
				Debug.Assert(key != null, "key should have been checked previously for null");

				// Hash the key
				for (var i: number/*int*/ = index; i < end; i++)
		hashCode += (hashCode << 7) ^ key[i];

				// Mix up hash code a bit more and clear the sign bit.  This code was taken from NameTable.cs in System.Xml.
				hashCode -= hashCode >> 17;
				hashCode -= hashCode >> 11;
				hashCode -= hashCode >> 5;
				return hashCode & 0x7FFFFFFF;
}

			/// <summary>
			/// Hash table entry.  The "Value" and "HashCode" fields are filled during initialization, and are never changed.  The "Next"
			/// field is updated when a new entry is chained to this one, and therefore care must be taken to ensure that updates to
			/// this field are thread-safe.
			/// </summary>
			private struct Entry
{
				public TValue Value;    // Hashed value
				public number/*int*/ HashCode;    // Hash code of string key (equal to extractKey(Value).GetHashCode())
				public number/*int*/ Next;        // SHARED STATE: Points to next entry in linked list
}
		}
	}

/// <summary>
/// Represents a node or an attribute in an XML tree.
/// </summary>
public /*abstract*/ class XObject implements IXmlLineInfo
{
	/*internal*/ XContainer parent;
	/*internal*/ object annotations;

	/*internal*/ XObject() { }

	/// <summary>
	/// Get the BaseUri for this <see cref="XObject"/>.
	/// </summary>
	[SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Back-compat with System.Xml.")]
		public string BaseUri
{
	get
	{
		var o: XObject = this;
		while (true)
		{
			while (o != null && o.annotations == null)
			{
				o = o.parent;
			}
			if (o == null) break;
			var a: BaseUriAnnotation = o.Annotation<BaseUriAnnotation>();
			if (a != null) return a.baseUri;
			o = o.parent;
		}
		return string.Empty;
	}
}

		/// <summary>
		/// Gets the XDocument object for this <see cref="XObject"/>.
		/// </summary>
		public XDocument Document
{
	get
	{
		var n: XObject = this;
		while (n.parent != null) n = n.parent;
		return n as XDocument;
	}
}

		/// <summary>
		/// Gets the node type for this <see cref="XObject"/>.
		/// </summary>
		public /*abstract*/ XmlNodeType NodeType { get; }

/// <summary>
/// Gets the parent <see cref="XElement"/> of this <see cref="XObject"/>.
/// </summary>
/// <remarks>
/// If this <see cref="XObject"/> has no parent <see cref="XElement"/>, this property returns null.
/// </remarks>
get Parent():XElement
{
	return parent as XElement;
}

/// <summary>
/// Adds an object to the annotation list of this <see cref="XObject"/>.
/// </summary>
/// <param name="annotation">The annotation to add.</param>
AddAnnotation(annotation:any):void
{
	if(annotation == null) throw 'ArgumentNullException("annotation")';
	if(annotations == null)
	{
		annotations = annotation is object[] ? new object[] { annotation } : annotation;
	}
	else
	{
		object[] a = annotations as object[];
		if(a == null)
		{
			annotations = new object[] { annotations, annotation };
		}
		else
		{
			var i: number/*int*/ = 0;
			while(i < a.length && a[i] != null) i++;
			if(i == a.length)
			{
				Array.Resize(a:ref, i * 2);
				annotations = a;
			}
			a[i] = annotation;
		}
	}
}

/// <summary>
/// Returns the first annotation object of the specified type from the list of annotations
/// of this <see cref="XObject"/>.
/// </summary>
/// <param name="type">The type of the annotation to retrieve.</param>
/// <returns>
/// The first matching annotation object, or null
/// if no annotation is the specified type.
/// </returns>
Annotation(type:Type):any
{
	if (type == null) throw 'ArgumentNullException("type")';
	if (annotations != null)
	{
		object[] a = annotations as object[];
		if (a == null)
		{
			if (type.IsInstanceOfType(annotations)) return annotations;
		}
		else
		{
			for (var i: number/*int*/ = 0; i < a.length; i++)
			{
				var obj: object = a[i];
				if (obj == null) break;
				if (type.IsInstanceOfType(obj)) return obj;
			}
		}
	}
	return null;
}

		/// <summary>
		/// Returns the first annotation object of the specified type from the list of annotations
		/// of this <see cref="XObject"/>.
		/// </summary>
		/// <typeparam name="T">The type of the annotation to retrieve.</typeparam>
		/// <returns>
		/// The first matching annotation object, or null if no annotation
		/// is the specified type.
		/// </returns>
		public T Annotation<T>() where T : class
{
	if (annotations != null)
	{
		object[] a = annotations as object[];
		if (a == null) return annotations as T;
		for (var i: number/*int*/ = 0; i < a.length; i++)
		{
			var obj: object = a[i];
			if (obj == null) break;
			var result: T = obj as T;
			if (result != null) return result;
		}
	}
	return null;
}

		/// <summary>
		/// Returns an enumerable collection of annotations of the specified type
		/// for this <see cref="XObject"/>.
		/// </summary>
		/// <param name="type">The type of the annotations to retrieve.</param>
		/// <returns>An enumerable collection of annotations for this XObject.</returns>
		public IEnumerable < object > Annotations(type:Type)
{
	if (type == null) throw 'ArgumentNullException("type")';
	return AnnotationsIterator(type);
}

IEnumerable < object > AnnotationsIterator(type:Type)
{
	if (annotations != null)
	{
		object[] a = annotations as object[];
		if (a == null)
		{
			if (type.IsInstanceOfType(annotations)) yield return annotations;
		}
		else
		{
			for (var i: number/*int*/ = 0; i < a.length; i++)
			{
				var obj: object = a[i];
				if (obj == null) break;
				if (type.IsInstanceOfType(obj)) yield return obj;
			}
		}
	}
}

		/// <summary>
		/// Returns an enumerable collection of annotations of the specified type
		/// for this <see cref="XObject"/>.
		/// </summary>
		/// <typeparam name="T">The type of the annotations to retrieve.</typeparam>
		/// <returns>An enumerable collection of annotations for this XObject.</returns>
		public IEnumerable < T > Annotations<T>() where T : class
{
	if (annotations != null)
	{
		object[] a = annotations as object[];
		if (a == null)
		{
			var result: T = annotations as T;
			if (result != null) yield return result;
		}
		else
		{
			for (var i: number/*int*/ = 0; i < a.length; i++)
			{
				var obj: object = a[i];
				if (obj == null) break;
				var result: T = obj as T;
				if (result != null) yield return result;
			}
		}
	}
}

/// <summary>
/// Removes the annotations of the specified type from this <see cref="XObject"/>.
/// </summary>
/// <param name="type">The type of annotations to remove.</param>
RemoveAnnotations(type:Type):void
{
	if(type == null) throw 'ArgumentNullException("type")';
	if(annotations != null)
	{
		object[] a = annotations as object[];
		if (a == null)
		{
			if (type.IsInstanceOfType(annotations)) annotations = null;
		}
		else
		{
			var i: number/*int*/ = 0, j = 0;
			while (i < a.length)
			{
				var obj: object = a[i];
				if (obj == null) break;
				if (!type.IsInstanceOfType(obj)) a[j++] = obj;
				i++;
			}
			if (j == 0)
			{
				annotations = null;
			}
			else
			{
				while (j < i) a[j++] = null;
			}
		}
	}
}

		/// <summary>
		/// Removes the annotations of the specified type from this <see cref="XObject"/>.
		/// </summary>
		/// <typeparam name="T">The type of annotations to remove.</typeparam>
		public void RemoveAnnotations<T>() where T : class
{
	if (annotations != null)
	{
		object[] a = annotations as object[];
		if (a == null)
		{
			if (annotations is T) annotations = null;
		}
		else
		{
			var i: number/*int*/ = 0, j = 0;
			while (i < a.length)
			{
				var obj: object = a[i];
				if (obj == null) break;
				if (!(obj is T)) a[j++] = obj;
				i++;
			}
			if (j == 0)
			{
				annotations = null;
			}
			else
			{
				while (j < i) a[j++] = null;
			}
		}
	}
}

		/// <summary>
		/// Occurs when this <see cref="XObject"/> or any of its descendants have changed.
		/// </summary>
		public event EventHandler< XObjectChangeEventArgs > Changed
{
	add
	{
		if (value == null) return;
		var a: XObjectChangeAnnotation = Annotation<XObjectChangeAnnotation>();
		if (a == null)
		{
			a = new XObjectChangeAnnotation();
			AddAnnotation(a);
		}
		a.changed += value;
	}
	remove
	{
		if (value == null) return;
		var a: XObjectChangeAnnotation = Annotation<XObjectChangeAnnotation>();
		if (a == null) return;
		a.changed -= value;
		if (a.changing == null && a.changed == null)
		{
			RemoveAnnotations<XObjectChangeAnnotation>();
		}
	}
}

		/// <summary>
		/// Occurs when this <see cref="XObject"/> or any of its descendants are about to change.
		/// </summary>
		public event EventHandler< XObjectChangeEventArgs > Changing
{
	add
	{
		if (value == null) return;
		var a: XObjectChangeAnnotation = Annotation<XObjectChangeAnnotation>();
		if (a == null)
		{
			a = new XObjectChangeAnnotation();
			AddAnnotation(a);
		}
		a.changing += value;
	}
	remove
	{
		if (value == null) return;
		var a: XObjectChangeAnnotation = Annotation<XObjectChangeAnnotation>();
		if (a == null) return;
		a.changing -= value;
		if (a.changing == null && a.changed == null)
		{
			RemoveAnnotations<XObjectChangeAnnotation>();
		}
	}
}

boolean IXmlLineInfo.HasLineInfo()
{
	return Annotation<LineInfoAnnotation>() != null;
}

number/*int*/ IXmlLineInfo.LineNumber
{
	get
	{
		var a: LineInfoAnnotation = Annotation<LineInfoAnnotation>();
		if (a != null) return a.lineNumber;
		return 0;
	}
}

number/*int*/ IXmlLineInfo.LinePosition
{
	get
	{
		var a: LineInfoAnnotation = Annotation<LineInfoAnnotation>();
		if (a != null) return a.linePosition;
		return 0;
	}
}

	/*internal*/ boolean HasBaseUri
{
	get
	{
		return Annotation<BaseUriAnnotation>() != null;
	}
}

	/*internal*/ boolean NotifyChanged(sender:any, e:XObjectChangeEventArgs)
{
	var notify: boolean = false;
	var o: XObject = this;
	while (true)
	{
		while (o != null && o.annotations == null)
		{
			o = o.parent;
		}
		if (o == null) break;
		var a: XObjectChangeAnnotation = o.Annotation<XObjectChangeAnnotation>();
		if (a != null)
		{
			notify = true;
			if (a.changed != null)
			{
				a.changed(sender, e);
			}
		}
		o = o.parent;
	}
	return notify;
}

	/*internal*/ boolean NotifyChanging(sender:any, e:XObjectChangeEventArgs)
{
	var notify: boolean = false;
	var o: XObject = this;
	while (true)
	{
		while (o != null && o.annotations == null)
		{
			o = o.parent;
		}
		if (o == null) break;
		var a: XObjectChangeAnnotation = o.Annotation<XObjectChangeAnnotation>();
		if (a != null)
		{
			notify = true;
			if (a.changing != null)
			{
				a.changing(sender, e);
			}
		}
		o = o.parent;
	}
	return notify;
}

	/*internal*/ void SetBaseUri(baseUri:string)
{
	AddAnnotation(new BaseUriAnnotation(baseUri));
}

	/*internal*/ void SetLineInfo(lineNumber:number/*int*/, linePosition:number/*int*/)
{
	AddAnnotation(new LineInfoAnnotation(lineNumber, linePosition));
}

	/*internal*/ boolean SkipNotify()
{
	var o: XObject = this;
	while (true)
	{
		while (o != null && o.annotations == null)
		{
			o = o.parent;
		}
		if (o == null) return true;
		if (o.Annotations<XObjectChangeAnnotation>() != null) return false;
		o = o.parent;
	}
}

	/// <summary>
	/// Walks the tree starting with "this" node and returns first annotation of type <see cref="SaveOptions"/>
	///   found in the ancestors.
	/// </summary>
	/// <returns>The effective <see cref="SaveOptions"/> for this <see cref="XObject"/></returns>
	/*internal*/ SaveOptions GetSaveOptionsFromAnnotations()
{
	var o: XObject = this;
	while (true)
	{
		while (o != null && o.annotations == null)
		{
			o = o.parent;
		}
		if (o == null)
		{
			return SaveOptions.None;
		}
		var saveOptions: object = o.Annotation(typeof (SaveOptions));
		if (saveOptions != null)
		{
			return <SaveOptions>saveOptions;
		}
		o = o.parent;
	}
}
}

class BaseUriAnnotation
{
	/*internal*/ string baseUri;

	public BaseUriAnnotation(baseUri:string)
{
	this.baseUri = baseUri;
}
}

/// <summary>
/// Instance of this class is used as an annotation on any node
/// for which we want to store its line information.
/// Note: on XElement nodes this annotation stores the line info
///   for the element start tag. The matching end tag line info
///   if present is stored using the LineInfoEndElementAnnotation
///   instance annotation.
/// </summary>
class LineInfoAnnotation
{
	/*internal*/ number/*int*/ lineNumber;
	/*internal*/ number/*int*/ linePosition;

	public LineInfoAnnotation(lineNumber: number/*int*/, linePosition: number/*int*/)
{
	this.lineNumber = lineNumber;
	this.linePosition = linePosition;
}
}

/// <summary>
/// Instance of this class is used as an annotation on XElement nodes
/// if that element is not empty element and we want to store the line info
/// for its end element tag.
/// </summary>
class LineInfoEndElementAnnotation extends LineInfoAnnotation
{
	public LineInfoEndElementAnnotation(lineNumber: number/*int*/, linePosition: number/*int*/)
		: base(lineNumber, linePosition) { }
}

class XObjectChangeAnnotation
{
	/*internal*/ EventHandler<XObjectChangeEventArgs> changing;
	/*internal*/ EventHandler<XObjectChangeEventArgs> changed;

	public XObjectChangeAnnotation()
	{
	}
}

/// <summary>
/// Specifies the event type when an event is raised for an <see cref="XObject"/>.
/// </summary>
public enum XObjectChange
{
	/// <summary>
	/// An <see cref="XObject"/> has been or will be added to an <see cref="XContainer"/>.
	/// </summary>
	Add,

	/// <summary>
	/// An <see cref="XObject"/> has been or will be removed from an <see cref="XContainer"/>.
	/// </summary>
	Remove,

	/// <summary>
	/// An <see cref="XObject"/> has been or will be renamed.
	/// </summary>
	Name,

	/// <summary>
	/// The value of an <see cref="XObject"/> has been or will be changed. 
	/// There is a special case for elements. Change in the serialization
	/// of an empty element (either from an empty tag to start/end tag
	/// pair or vice versa) raises this event.
	/// </summary>
	Value,
}

/// <summary>
/// Provides data for the <see cref="XObject.Changing"/> and <see cref="XObject.Changed"/> events.
/// </summary>
export class XObjectChangeEventArgs extends EventArgs
{
	private objectChange: XObjectChange;

	/// <summary>
	/// Event argument for a <see cref="XObjectChange.Add"/> change event.
	/// </summary>

	public static readonly var Add: XObjectChangeEventArgs = new XObjectChangeEventArgs(XObjectChange.Add);

/// <summary>
/// Event argument for a <see cref="XObjectChange.Remove"/> change event.
/// </summary>

		public static readonly var Remove: XObjectChangeEventArgs = new XObjectChangeEventArgs(XObjectChange.Remove);

/// <summary>
/// Event argument for a <see cref="XObjectChange.Name"/> change event.
/// </summary>

		public static readonly var Name: XObjectChangeEventArgs = new XObjectChangeEventArgs(XObjectChange.Name);

/// <summary>
/// Event argument for a <see cref="XObjectChange.Value"/> change event.
/// </summary>

		public static readonly var Value: XObjectChangeEventArgs = new XObjectChangeEventArgs(XObjectChange.Value);

		/// <summary>
		/// Initializes a new instance of the <see cref="XObjectChangeEventArgs"/> class.
		/// </summary>
		public XObjectChangeEventArgs(objectChange:XObjectChange)
{
	this.objectChange = objectChange;
}

/// <summary>
/// Gets the type (<see cref="XObjectChange"/>) of change.
/// </summary>
get ObjectChange():XObjectChange
{
	return objectChange;
}
}

/// <summary>
/// Represents nodes (elements, comments, type:document, processing instruction,
/// and text nodes) in the XML tree.
/// </summary>
/// <remarks>
/// Nodes in the XML tree consist of objects of the following classes:
/// <see cref="XElement"/>,
/// <see cref="XComment"/>,
/// <see cref="XDocument"/>,
/// <see cref="XProcessingInstruction"/>,
/// <see cref="XText"/>,
/// <see cref="XDocumentType"/>
/// Note that an <see cref="XAttribute"/> is not an <see cref="XNode"/>.
/// </remarks>
public /*abstract*/ class XNode extends XObject
{
	static XNodeDocumentOrderComparer documentOrderComparer;
	static XNodeEqualityComparer equalityComparer;

	/*internal*/ XNode next;

	/*internal*/ XNode() { }

	/// <summary>
	/// Gets the next sibling node of this node.
	/// </summary>
	/// <remarks>
	/// If this property does not have a parent, or if there is no next node,
	/// then this property returns null.
	/// </remarks>
	public XNode NextNode
	{
	get
	{
		return parent == null || this == parent._content ? null : next;
	}
}

		/// <summary>
		/// Gets the previous sibling node of this node.
		/// </summary>
		/// <remarks>
		/// If this property does not have a parent, or if there is no previous node,
		/// then this property returns null.
		/// </remarks>
		public XNode PreviousNode
{
	get
	{
		if (parent == null) return null;
		var n: XNode = (<XNode>parent._content).next;
		var p: XNode = null;
		while (n != this)
		{
			p = n;
			n = n.next;
		}
		return p;
	}
}

		/// <summary>
		/// Gets a comparer that can compare the relative position of two nodes.
		/// </summary>
		public static XNodeDocumentOrderComparer DocumentOrderComparer
{
	get
	{
		if (documentOrderComparer == null) documentOrderComparer = new XNodeDocumentOrderComparer();
		return documentOrderComparer;
	}
}

		/// <summary>
		/// Gets a comparer that can compare two nodes for value equality.
		/// </summary>
		public static XNodeEqualityComparer EqualityComparer
{
	get
	{
		if (equalityComparer == null) equalityComparer = new XNodeEqualityComparer();
		return equalityComparer;
	}
}

/// <overloads>
/// Adds the specified content immediately after this node. The
/// content can be simple content, a collection of
/// content objects, a parameter list of content objects,
/// or null.
/// </overloads>
/// <summary>
/// Adds the specified content immediately after this node.
/// </summary>
/// <param name="content">
/// A content object containing simple content or a collection of content objects
/// to be added after this node.
/// </param>
/// <exception cref="InvalidOperationException">
/// Thrown if the parent is null.
/// </exception>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
AddAfterSelf(content:any):void
{
	if(parent == null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_MissingParent))';
	new Inserter(parent, this).Add(content);
}

/// <summary>
/// Adds the specified content immediately after this node.
/// </summary>
/// <param name="content">
/// A parameter list of content objects.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
/// <exception cref="InvalidOperationException">
/// Thrown if the parent is null.
/// </exception>
AddAfterSelf(..._content:any[]):void
{
	AddAfterSelf(<object > content);
}

/// <overloads>
/// Adds the specified content immediately before this node. The
/// content can be simple content, a collection of
/// content objects, a parameter list of content objects,
/// or null.
/// </overloads>
/// <summary>
/// Adds the specified content immediately before this node.
/// </summary>
/// <param name="content">
/// A content object containing simple content or a collection of content objects
/// to be added after this node.
/// </param>
/// <exception cref="InvalidOperationException">
/// Thrown if the parent is null.
/// </exception>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
AddBeforeSelf(content:any):void
{
	if(parent == null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_MissingParent))';
	var p: XNode = <XNode>parent._content;
	while(p.next != this) p = p.next;
	if(p == parent._content) p = null;
	new Inserter(parent, p).Add(content);
}

/// <summary>
/// Adds the specified content immediately before this node.
/// </summary>
/// <param name="content">
/// A parameter list of content objects.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
/// <exception cref="InvalidOperationException">
/// Thrown if the parent is null.
/// </exception>
AddBeforeSelf(..._content:any[]):void
{
	AddBeforeSelf(<object > content);
}

		/// <overloads>
		/// Returns an collection of the ancestor elements for this node.
		/// Optionally an node name can be specified to filter for a specific ancestor element.
		/// </overloads>
		/// <summary>
		/// Returns a collection of the ancestor elements of this node.
		/// </summary>
		/// <returns>
		/// The ancestor elements of this node.
		/// </returns>
		/// <remarks>
		/// This method will not return itself in the results.
		/// </remarks>
		public IEnumerable < XElement > Ancestors()
{
	return GetAncestors(null, false);
}

		/// <summary>
		/// Returns a collection of the ancestor elements of this node with the specified name.
		/// </summary>
		/// <param name="name">
		/// The name of the ancestor elements to find.
		/// </param>
		/// <returns>
		/// A collection of the ancestor elements of this node with the specified name.
		/// </returns>
		/// <remarks>
		/// This method will not return itself in the results.
		/// </remarks>
		public IEnumerable < XElement > Ancestors(name:XName)
{
	return name != null ? GetAncestors(name, false) : XElement.EmptySequence;
}

/// <summary>
/// Compares two nodes to determine their relative XML document order.
/// </summary>
/// <param name="n1">First node to compare.</param>
/// <param name="n2">Second node to compare.</param>
/// <returns>
/// 0 if the nodes are equal; -1 if n1 is before n2; 1 if n1 is after n2.
/// </returns>
/// <exception cref="InvalidOperationException">
/// Thrown if the two nodes do not share a common ancestor.
/// </exception>

		static CompareDocumentOrder(n1:XNode, n2:XNode):number/*int*/
{
	if (n1 == n2) return 0;
	if (n1 == null) return -1;
	if (n2 == null) return 1;
	if (n1.parent != n2.parent)
	{
		var height: number/*int*/ = 0;
		var p1: XNode = n1;
		while (p1.parent != null)
		{
			p1 = p1.parent;
			height++;
		}
		var p2: XNode = n2;
		while (p2.parent != null)
		{
			p2 = p2.parent;
			height--;
		}
		if (p1 != p2) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_MissingAncestor))';
		if (height < 0)
		{
			do
			{
				n2 = n2.parent;
				height++;
			} while (height != 0);
			if (n1 == n2) return -1;
		}
		else if (height > 0)
		{
			do
			{
				n1 = n1.parent;
				height--;
			} while (height != 0);
			if (n1 == n2) return 1;
		}
		while (n1.parent != n2.parent)
		{
			n1 = n1.parent;
			n2 = n2.parent;
		}
	}
	else if (n1.parent == null)
	{
		throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_MissingAncestor))';
	}
	var n: XNode = <XNode>n1.parent._content;
	while (true)
	{
		n = n.next;
		if (n == n1) return -1;
		if (n == n2) return 1;
	}
}

/// <summary>
/// Creates an <see cref="XmlReader"/> for the node.
/// </summary>
/// <returns>An <see cref="XmlReader"/> that can be used to read the node and its descendants.</returns>
CreateReader():XmlReader
{
	return new XNodeReader(this, null);
}

/// <summary>
/// Creates an <see cref="XmlReader"/> for the node.
/// </summary>
/// <param name="readerOptions">
/// Options to be used for the returned reader. These override the default usage of annotations from the tree.
/// </param>
/// <returns>An <see cref="XmlReader"/> that can be used to read the node and its descendants.</returns>
CreateReader(readerOptions:ReaderOptions):XmlReader
{
	return new XNodeReader(this, null, readerOptions);
}

		/// <summary>
		/// Returns a collection of the sibling nodes after this node, in document order.
		/// </summary>
		/// <remarks>
		/// This method only includes sibling nodes in the returned collection.
		/// </remarks>
		/// <returns>The nodes after this node.</returns>
		public IEnumerable < XNode > NodesAfterSelf()
{
	var n: XNode = this;
	while (n.parent != null && n != n.parent._content)
	{
		n = n.next;
		yield return n;
	}
}

		/// <summary>
		/// Returns a collection of the sibling nodes before this node, in document order.
		/// </summary>
		/// <remarks>
		/// This method only includes sibling nodes in the returned collection.
		/// </remarks>
		/// <returns>The nodes after this node.</returns>
		public IEnumerable < XNode > NodesBeforeSelf()
{
	if (parent != null)
	{
		var n: XNode = <XNode>parent._content;
		do
		{
			n = n.next;
			if (n == this) break;
			yield return n;
		} while (parent != null && parent == n.parent);
	}
}

		/// <summary>
		/// Returns a collection of the sibling element nodes after this node, in document order.
		/// </summary>
		/// <remarks>
		/// This method only includes sibling element nodes in the returned collection.
		/// </remarks>
		/// <returns>The element nodes after this node.</returns>
		public IEnumerable < XElement > ElementsAfterSelf()
{
	return GetElementsAfterSelf(null);
}

		/// <summary>
		/// Returns a collection of the sibling element nodes with the specified name
		/// after this node, in document order.
		/// </summary>
		/// <remarks>
		/// This method only includes sibling element nodes in the returned collection.
		/// </remarks>
		/// <returns>The element nodes after this node with the specified name.</returns>
		/// <param name="name">The name of elements to enumerate.</param>
		public IEnumerable < XElement > ElementsAfterSelf(name:XName)
{
	return name != null ? GetElementsAfterSelf(name) : XElement.EmptySequence;
}

		/// <summary>
		/// Returns a collection of the sibling element nodes before this node, in document order.
		/// </summary>
		/// <remarks>
		/// This method only includes sibling element nodes in the returned collection.
		/// </remarks>
		/// <returns>The element nodes before this node.</returns>
		public IEnumerable < XElement > ElementsBeforeSelf()
{
	return GetElementsBeforeSelf(null);
}

		/// <summary>
		/// Returns a collection of the sibling element nodes with the specified name
		/// before this node, in document order.
		/// </summary>
		/// <remarks>
		/// This method only includes sibling element nodes in the returned collection.
		/// </remarks>
		/// <returns>The element nodes before this node with the specified name.</returns>
		/// <param name="name">The name of elements to enumerate.</param>
		public IEnumerable < XElement > ElementsBeforeSelf(name:XName)
{
	return name != null ? GetElementsBeforeSelf(name) : XElement.EmptySequence;
}

/// <summary>
/// Determines if the current node appears after a specified node 
/// in terms of document order.
/// </summary>
/// <param name="node">The node to compare for document order.</param>
/// <returns>True if this node appears after the specified node; false if not.</returns>
IsAfter(node:XNode):boolean
{
	return CompareDocumentOrder(this, node) > 0;
}

/// <summary>
/// Determines if the current node appears before a specified node 
/// in terms of document order.
/// </summary>
/// <param name="node">The node to compare for document order.</param>
/// <returns>True if this node appears before the specified node; false if not.</returns>
IsBefore(node:XNode):boolean
{
	return CompareDocumentOrder(this, node) < 0;
}

		/// <summary>
		/// Creates an <see cref="XNode"/> from an <see cref="XmlReader"/>.
		/// The runtime type of the node is determined by the node type
		/// (<see cref="XObject.NodeType"/>) of the first node encountered
		/// in the reader.
		/// </summary>
		/// <param name="reader">An <see cref="XmlReader"/> positioned at the node to read into this <see cref="XNode"/>.</param>
		/// <returns>An <see cref="XNode"/> that contains the nodes read from the reader.</returns>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the <see cref="XmlReader"/> is not positioned on a recognized node type.
		/// </exception>
		static ReadFrom(reader:XmlReader):XNode
{
	if (reader == null) throw 'ArgumentNullException("reader")';
	if (reader.ReadState != ReadState.Interactive) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedInteractive))';
	switch (reader.NodeType)
	{
		case XmlNodeType.Text:
		case XmlNodeType.SignificantWhitespace:
		case XmlNodeType.Whitespace:
			return new XText(reader);
		case XmlNodeType.CDATA:
			return new XCData(reader);
		case XmlNodeType.Comment:
			return new XComment(reader);
		case XmlNodeType.DocumentType:
			return new XDocumentType(reader);
		case XmlNodeType.Element:
			return new XElement(reader);
		case XmlNodeType.ProcessingInstruction:
			return new XProcessingInstruction(reader);
		default:
			throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnexpectedNodeType, reader.NodeType))';
	}
}

/// <summary>
/// Removes this XNode from the underlying XML tree.
/// </summary>
/// <exception cref="InvalidOperationException">
/// Thrown if the parent is null.
/// </exception>
Remove():void
{
	if(parent == null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_MissingParent))';
	parent.RemoveNode(this);
}

/// <overloads>
/// Replaces this node with the specified content. The
/// content can be simple content, a collection of
/// content objects, a parameter list of content objects,
/// or null.
/// </overloads>
/// <summary>
/// Replaces the content of this <see cref="XNode"/>.
/// </summary>
/// <param name="content">Content that replaces this node.</param>
ReplaceWith(content:any):void
{
	if(parent == null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_MissingParent))';
	var c: XContainer = parent;
	var p: XNode = <XNode>parent._content;
	while(p.next != this) p = p.next;
	if(p == parent._content) p = null;
	parent.RemoveNode(this);
	if(p != null && p.parent != c) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
	new Inserter(c, p).Add(content);
}

/// <summary>
/// Replaces this node with the specified content.
/// </summary>
/// <param name="content">Content that replaces this node.</param>
ReplaceWith(..._content:any[]):void
{
	ReplaceWith(<object > content);
}

/// <summary>
/// Provides the formatted XML text representation.
/// You can use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </summary>
/// <returns>A formatted XML string.</returns>
ToString():string
{
	return GetXmlString(GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Provides the XML text representation.
/// </summary>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
/// <returns>An XML string.</returns>
ToString(options:SaveOptions):string
{
	return GetXmlString(options);
}

/// <summary>
/// Compares the values of two nodes, including the values of all descendant nodes.
/// </summary>
/// <param name="n1">The first node to compare.</param>
/// <param name="n2">The second node to compare.</param>
/// <returns>true if the nodes are equal, false otherwise.</returns>
/// <remarks>
/// A null node is equal to another null node but unequal to a non-null
/// node. Two <see cref="XNode"/> objects of different types are never equal. Two
/// <see cref="XText"/> nodes are equal if they contain the same text. Two
/// <see cref="XElement"/> nodes are equal if they have the same tag name, the same
/// set of attributes with the same values, and, ignoring comments and processing
/// instructions, contain two equal length sequences of equal content nodes.
/// Two <see cref="XDocument"/>s are equal if their root nodes are equal. Two
/// <see cref="XComment"/> nodes are equal if they contain the same comment text.
/// Two <see cref="XProcessingInstruction"/> nodes are equal if they have the same
/// target and data. Two <see cref="XDocumentType"/> nodes are equal if the have the
/// same name, id:public, system id, and /*internal*/ subset.</remarks>

		static DeepEquals(n1:XNode, n2:XNode):boolean
{
	if (n1 == n2) return true;
	if (n1 == null || n2 == null) return false;
	return n1.DeepEquals(n2);
}

		/// <summary>
		/// Write the current node to an <see cref="XmlWriter"/>.
		/// </summary>
		/// <param name="writer">The <see cref="XmlWriter"/> to write the current node into.</param>
		public /*abstract*/ void WriteTo(writer:XmlWriter);

	/*internal*/ /*virtual*/ void AppendText(sb:StringBuilder)
{
}

	/*internal*/ /*abstract*/ XNode CloneNode();

	/*internal*/ /*abstract*/ boolean DeepEquals(node:XNode);

	/*internal*/ IEnumerable < XElement > GetAncestors(name:XName, self:boolean)
{
	var e: XElement = (self ? this : parent) as XElement;
	while (e != null)
	{
		if (name == null || e.name == name) yield return e;
		e = e.parent as XElement;
	}
}

	private IEnumerable < XElement > GetElementsAfterSelf(name:XName)
{
	var n: XNode = this;
	while (n.parent != null && n != n.parent._content)
	{
		n = n.next;
		var e: XElement = n as XElement;
		if (e != null && (name == null || e.name == name)) yield return e;
	}
}

	private IEnumerable < XElement > GetElementsBeforeSelf(name:XName)
{
	if (parent != null)
	{
		var n: XNode = <XNode>parent._content;
		do
		{
			n = n.next;
			if (n == this) break;
			var e: XElement = n as XElement;
			if (e != null && (name == null || e.name == name)) yield return e;
		} while (parent != null && parent == n.parent);
	}
}

	/*internal*/ /*abstract*/ number/*int*/ GetDeepHashCode();

	// The settings simulate a non-validating processor with the external
	// entity resolution disabled. The processing of the /*internal*/ subset is 
	// enabled by default. In order to prevent DoS attacks, the expanded 
	// size of the /*internal*/ subset is limited to 10 million characters.
	/*internal*/ static XmlReaderSettings GetXmlReaderSettings(o:LoadOptions)
{
	var rs: XmlReaderSettings = new XmlReaderSettings();
	if ((o & LoadOptions.PreserveWhitespace) == 0) rs.IgnoreWhitespace = true;
	rs.DtdProcessing = DtdProcessing.Parse;
	rs.MaxCharactersFromEntities = <long>1e7;
	rs.XmlResolver = null;
	return rs;
}

	/*internal*/ static XmlWriterSettings GetXmlWriterSettings(o:SaveOptions)
{
	var ws: XmlWriterSettings = new XmlWriterSettings();
	if ((o & SaveOptions.DisableFormatting) == 0) ws.Indent = true;
	if ((o & SaveOptions.OmitDuplicateNamespaces) != 0) ws.NamespaceHandling |= NamespaceHandling.OmitDuplicates;
	return ws;
}

	private string GetXmlString(o:SaveOptions)
{
	using(var sw: StringWriter = new StringWriter(CultureInfo.InvariantCulture))
	{
		var ws: XmlWriterSettings = new XmlWriterSettings();
		ws.OmitXmlDeclaration = true;
		if ((o & SaveOptions.DisableFormatting) == 0) ws.Indent = true;
		if ((o & SaveOptions.OmitDuplicateNamespaces) != 0) ws.NamespaceHandling |= NamespaceHandling.OmitDuplicates;
		if (this is XText) ws.ConformanceLevel = ConformanceLevel.Fragment;
		using(var w: XmlWriter = XmlWriter.Create(sw, ws))
		{
			var n: XDocument = this as XDocument;
			if (n != null)
			{
				n.WriteContentTo(w);
			}
			else
			{
				WriteTo(w);
			}
		}
		return sw.ToString();
	}
}
}

/// <summary>
/// Contains functionality to compare nodes for their document order.
/// This class cannot be inherited.
/// </summary>
export /*sealed*/ class XNodeDocumentOrderComparer implements IComparer,
	IComparer<XNode>
{
	/// <summary>
	/// Compares two nodes to determine their relative XML document order.
	/// </summary>
	/// <param name="x">The first node to compare.</param>
	/// <param name="y">The second node to compare.</param>
	/// <returns>
	/// 0 if the nodes are equal;
	/// -1 if x is before y; 
	/// 1 if x is after y.
	/// </returns>
	/// <exception cref="InvalidOperationException">
	/// Thrown if the two nodes do not share a common ancestor.
	/// </exception>
	Compare(x: XNode, y: XNode): number/*int*/
	{
		return XNode.CompareDocumentOrder(x, y);
	}

	/// <summary>
	/// Compares two nodes to determine their relative XML document order.
	/// </summary>
	/// <param name="x">The first node to compare.</param>
	/// <param name="y">The second node to compare.</param>
	/// <returns>
	/// 0 if the nodes are equal;
	/// -1 if x is before y; 
	/// 1 if x is after y.
	/// </returns>
	/// <exception cref="InvalidOperationException">
	/// Thrown if the two nodes do not share a common ancestor.
	/// </exception>        
	/// <exception cref="ArgumentException">
	/// Thrown if either of the two nodes are not derived from XNode.
	/// </exception>        
	number/*int*/ IComparer.Compare(x:any, y:any)
{
	var n1: XNode = x as XNode;
	if (n1 == null && x != null) throw 'ArgumentException(Res.GetString(Res.Argument_MustBeDerivedFrom, typeof (XNode)), "x")';
	var n2: XNode = y as XNode;
	if (n2 == null && y != null) throw 'ArgumentException(Res.GetString(Res.Argument_MustBeDerivedFrom, typeof (XNode)), "y")';
	return Compare(n1, n2);
}
	}

/// <summary>
/// Contains functionality to compare nodes for value equality.
/// This class cannot be inherited.
/// </summary>
export /*sealed*/ class XNodeEqualityComparer implements
	IEqualityComparer,
	IEqualityComparer<XNode>
{
	/// <summary>
	/// Compares the values of two nodes.
	/// </summary>
	/// <param name="x">The first node to compare.</param>
	/// <param name="y">The second node to compare.</param>
	/// <returns>true if the nodes are equal, false otherwise.</returns>
	/// <remarks>
	/// A null node is equal to another null node but unequal to a non-null
	/// node. Two <see cref="XNode"/>s of different types are never equal. Two
	/// <see cref="XText"/> nodes are equal if they contain the same text. Two
	/// <see cref="XElement"/> nodes are equal if they have the same tag name, the same
	/// set of attributes with the same values, and, ignoring comments and processing
	/// instructions, contain two equal length sequences of pairwise equal content nodes.
	/// Two <see cref="XDocument"/>s are equal if their root nodes are equal. Two
	/// <see cref="XComment"/> nodes are equal if they contain the same comment text.
	/// Two <see cref="XProcessingInstruction"/> nodes are equal if they have the same
	/// target and data. Two <see cref="XDocumentType"/> nodes are equal if the have the
	/// same name, id:public, system id, and /*internal*/ subset.
	/// </remarks>
	Equals(x: XNode, y: XNode): boolean
	{
		return XNode.DeepEquals(x, y);
	}

	/// <summary>
	/// Returns a hash code based on an <see cref="XNode"/> objects value.
	/// </summary>
	/// <param name="obj">The node to hash.</param>
	/// <returns>A value-based hash code for the node.</returns>
	/// <remarks>
	/// The <see cref="XNode"/> class's implementation of <see cref="Object.GetHashCode"/>
	/// is based on the referential identity of the node. This method computes a
	/// hash code based on the value of the node.
	/// </remarks>
	GetHashCode(obj: XNode): number/*int*/
	{
		return obj != null ? obj.GetDeepHashCode() : 0;
	}

	/// <summary>
	/// Compares the values of two nodes.
	/// </summary>
	/// <param name="x">The first node to compare.</param>
	/// <param name="y">The second node to compare.</param>
	/// <returns>true if the nodes are equal, false otherwise.</returns>
	/// <remarks>
	/// A null node is equal to another null node but unequal to a non-null
	/// node. Two <see cref="XNode"/>s of different types are never equal. Two
	/// <see cref="XText"/> nodes are equal if they contain the same text. Two
	/// <see cref="XElement"/> nodes are equal if they have the same tag name, the same
	/// set of attributes with the same values, and, ignoring comments and processing
	/// instructions, contain two equal length sequences of pairwise equal content nodes.
	/// Two <see cref="XDocument"/>s are equal if their root nodes are equal. Two
	/// <see cref="XComment"/> nodes are equal if they contain the same comment text.
	/// Two <see cref="XProcessingInstruction"/> nodes are equal if they have the same
	/// target and data. Two <see cref="XDocumentType"/> nodes are equal if the have the
	/// same name, id:public, system id, and /*internal*/ subset.
	/// </remarks>
	private IEqualityComparer.Equals(x: object, y: object): boolean
	{
		var n1: XNode = x as XNode;
		if (n1 == null && x != null) throw 'ArgumentException(Res.GetString(Res.Argument_MustBeDerivedFrom, typeof (XNode)), "x")';
		var n2: XNode = y as XNode;
		if (n2 == null && y != null) throw 'ArgumentException(Res.GetString(Res.Argument_MustBeDerivedFrom, typeof (XNode)), "y")';
		return Equals(n1, n2);
	}

	/// <summary>
	/// Returns a hash code based on a node's value.
	/// </summary>
	/// <param name="obj">The node to hash.</param>
	/// <returns>A value-based hash code for the node.</returns>
	/// <remarks>
	/// The <see cref="XNode"/> class's implementation of <see cref="Object.GetHashCode"/>
	/// is based on the referential identity of the node. This method computes a
	/// hash code based on the value of the node.
	/// </remarks>
	private IEqualityComparer.GetHashCode(obj: object): number/*int*/
	{
		var n: XNode = obj as XNode;
		if (n == null && obj != null) throw 'ArgumentException(Res.GetString(Res.Argument_MustBeDerivedFrom, typeof (XNode)), "obj")';
		return GetHashCode(n);
	}
}

/// <summary>
/// Represents a text node.
/// </summary>
export classXText extends XNode
{
	/*internal*/ string text;

		/// <summary>
		/// Initializes a new instance of the XText class.
		/// </summary>
		/// <param name="value">The string that contains the value of the text node.</param>
		public XText(value:string)
	{
		if (value == null) throw 'ArgumentNullException("value")';
		text = value;
	}

		/// <summary>
		/// Initializes a new instance of the XText class from another XText object.
		/// </summary>
		/// <param name="other">The text node to copy from.</param>
		public XText(other:XText)
	{
		if (other == null) throw 'ArgumentNullException("other")';
		text = other.text;
	}

	/*internal*/ XText(r:XmlReader)
	{
		text = r.Value;
		r.Read();
	}

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.Text.
		/// </remarks>
		public XmlNodeType NodeType
	{
		get
		{
			return XmlNodeType.Text;
		}
	}

		/// <summary>
		/// Gets or sets the value of this node.
		/// </summary>
		public string Value
	{
		get
		{
			return text;
		}
		set
		{
			if (value == null) throw 'ArgumentNullException("value")';
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Value);
			text = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Value);
		}
	}

	/// <summary>
	/// Write this <see cref="XText"/> to the given <see cref="XmlWriter"/>.
	/// </summary>
	/// <param name="writer">
	/// The <see cref="XmlWriter"/> to write this <see cref="XText"/> to.
	/// </param>
	WriteTo(writer:XmlWriter):void
	{
		if(writer == null) throw 'ArgumentNullException("writer")';
		if(parent is XDocument)
		{
			writer.WriteWhitespace(text);
		}
			else
		{
			writer.WriteString(text);
		}
	}

	/*internal*/ void AppendText(sb:StringBuilder)
	{
		sb.Append(text);
	}

	/*internal*/ XNode CloneNode()
	{
		return new XText(this);
	}

	/*internal*/ boolean DeepEquals(node:XNode)
	{
		return node != null && NodeType == node.NodeType && text == (<XText>node).text;
	}

	/*internal*/ number/*int*/ GetDeepHashCode()
	{
		return text.GetHashCode();
	}
}

/// <summary>
/// Represents a text node that contains CDATA.
/// </summary>
export classXCData extends XText
{
		/// <summary>
		/// Initializes a new instance of the XCData class.
		/// </summary>
		/// <param name="value">The string that contains the value of the XCData node.</param>
		public XCData(value:string) : base(value) { }

		/// <summary>
		/// Initializes a new instance of the XCData class from another XCData object.
		/// </summary>
		/// <param name="other">Text node to copy from</param>
		public XCData(other:XCData) : base(other) { }

	/*internal*/ XCData(r:XmlReader) : base(r) { }

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.CDATA.
		/// </remarks>
		public XmlNodeType NodeType
	{
		get
		{
			return XmlNodeType.CDATA;
		}
	}

	/// <summary>
	/// Write this <see cref="XCData"/> to the given <see cref="XmlWriter"/>.
	/// </summary>
	/// <param name="writer">
	/// The <see cref="XmlWriter"/> to write this <see cref="XCData"/> to.
	/// </param>
	WriteTo(writer:XmlWriter):void
	{
		if(writer == null) throw 'ArgumentNullException("writer")';
		writer.WriteCData(text);
	}

	/*internal*/ XNode CloneNode()
	{
		return new XCData(this);
	}
}

/// <summary>
/// Represents a node that can contain other nodes.
/// </summary>
/// <remarks>
/// The two classes that derive from <see cref="XContainer"/> are
/// <see cref="XDocument"/> and <see cref="XElement"/>.
/// </remarks>
public /*abstract*/ class XContainer extends XNode
{
	/*internal*/ object content;

	/*internal*/ XContainer() { }

	/*internal*/ XContainer(other: XContainer)
	{
		if (other == null) throw 'ArgumentNullException("other")';
		if (other._content is string)
		{
			this._content = other._content;
		}
			else
		{
	var n: XNode = <XNode>other._content;
	if (n != null)
	{
		do
		{
			n = n.next;
			AppendNodeSkipNotify(n.CloneNode());
		} while (n != other._content);
	}
}
	}

		/// <summary>
		/// Get the first child node of this node.
		/// </summary>
		public XNode FirstNode
{
	get
	{
		var last: XNode = LastNode;
		return last != null ? last.next : null;
	}
}

		/// <summary>
		/// Get the last child node of this node.
		/// </summary>
		public XNode LastNode
{
	get
	{
		if (content == null) return null;
		var n: XNode = content as XNode;
		if (n != null) return n;
		var s: string = content as string;
		if (s != null)
		{
			if (s.length == 0) return null;
			var t: XText = new XText(s);
			t.parent = this;
			t.next = t;
			Interlocked.CompareExchange<any>(content:ref, t, s);
		}
		return <XNode>content;
	}
}

/// <overloads>
/// Adds the specified content as a child (or as children) to this XContainer. The
/// content can be simple content, a collection of content objects, a parameter list
/// of content objects, or null.
/// </overloads>
/// <summary>
/// Adds the specified content as a child (children:or) of this XContainer.
/// </summary>
/// <param name="content">
/// A content object containing simple content or a collection of content objects
/// to be added.
/// </param>
/// <remarks>
/// When adding simple content, a number of types may be passed to this method.
/// Valid types include:
/// <list>
/// <item>string</item>
/// <item>double</item>
/// <item>float</item>
/// <item>decimal</item>
/// <item>boolean</item>
/// <item>DateTime</item>
/// <item>DateTimeOffset</item>
/// <item>TimeSpan</item>
/// <item>Any type implementing ToString()</item>
/// <item>Any type implementing IEnumerable</item>
/// 
/// </list>
/// When adding complex content, a number of types may be passed to this method.
/// <list>
/// <item>XObject</item>
/// <item>XNode</item>
/// <item>XAttribute</item>
/// <item>Any type implementing IEnumerable</item>
/// </list>
/// 
/// If an object implements IEnumerable, then the collection in the object is enumerated,
/// and all items in the collection are added. If the collection contains simple content,
/// then the simple content in the collection is concatenated and added as a single
/// string of simple content. If the collection contains complex content, then each item
/// in the collection is added separately.
/// 
/// If content is null, nothing is added. This allows the results of a query to be passed
/// as content. If the query returns null, no contents are added, and this method does not
/// throw a NullReferenceException.
/// 
/// Attributes and simple content can't be added to a document.
/// 
/// An added attribute must have a unique name within the element to
/// which it is being added.
/// </remarks>
Add(content:any):void
{
	if(SkipNotify())
	{
		AddContentSkipNotify(content);
		return;
	}
	if (content == null) return;
	var n: XNode = content as XNode;
	if(n != null)
	{
		AddNode(n);
		return;
	}
	var s: string = content as string;
	if(s != null)
	{
		AddString(s);
		return;
	}
	var a: XAttribute = content as XAttribute;
	if(a != null)
	{
		_addAttribute(a);
		return;
	}
	var x: XStreamingElement = content as XStreamingElement;
	if(x != null)
	{
		AddNode(new XElement(x));
		return;
	}
	object[] o = content as object[];
	if(o != null)
	{
		foreach(object obj in o) Add(obj);
		return;
	}
	var e: IEnumerable = content as IEnumerable;
	if(e != null)
	{
		foreach(object obj in e) Add(obj);
		return;
	}
	AddString(GetStringValue(content));
}

/// <summary>
/// Adds the specified content as a child (children:or) of this XContainer.
/// </summary>
/// <param name="content">
/// A parameter list of content objects.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
Add(..._content:any[]):void
{
	Add(<object > content);
}

/// <overloads>
/// Adds the specified content as the first child (children:or) of this document or element. The
/// content can be simple content, a collection of content objects, a parameter
/// list of content objects, or null.
/// </overloads>
/// <summary>
/// Adds the specified content as the first child (children:or) of this document or element.
/// </summary>
/// <param name="content">
/// A content object containing simple content or a collection of content objects
/// to be added.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
AddFirst(content:any):void
{
	new Inserter(this, null).Add(content);
}

/// <summary>
/// Adds the specified content as the first children of this document or element.
/// </summary>
/// <param name="content">
/// A parameter list of content objects.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
/// <exception cref="InvalidOperationException">
/// Thrown if the parent is null.
/// </exception>
AddFirst(..._content:any[]):void
{
	AddFirst(<object > content);
}

/// <summary>
/// Creates an <see cref="XmlWriter"/> used to add either nodes 
/// or attributes to the <see cref="XContainer"/>. The later option
/// applies only for <see cref="XElement"/>.
/// </summary>
/// <returns>An <see cref="XmlWriter"/></returns>
CreateWriter():XmlWriter
{
	var settings: XmlWriterSettings = new XmlWriterSettings();
	settings.ConformanceLevel = this is XDocument ? ConformanceLevel.Document : ConformanceLevel.Fragment;
	return XmlWriter.Create(new XNodeBuilder(this), settings);
}

		/// <summary>
		/// Get descendant elements plus leaf nodes contained in an <see cref="XContainer"/>
		/// </summary>
		/// <returns>IEnumerable<XNode> over all descendants</XNode></returns>
		public IEnumerable < XNode > DescendantNodes()
{
	return GetDescendantNodes(false);
}

		/// <summary>
		/// Returns the descendant <see cref="XElement"/>s of this <see cref="XContainer"/>.  Note this method will
		/// not return itself in the resulting IEnumerable.  See <see cref="XElement.DescendantsAndSelf()"/> if you
		/// need to include the current <see cref="XElement"/> in the results.  
		/// <seealso cref="XElement.DescendantsAndSelf()"/>
		/// </summary>
		/// <returns>
		/// An IEnumerable of <see cref="XElement"/> with all of the descendants below this <see cref="XContainer"/> in the XML tree.
		/// </returns>
		public IEnumerable < XElement > Descendants()
{
	return GetDescendants(null, false);
}

		/// <summary>
		/// Returns the Descendant <see cref="XElement"/>s with the passed in <see cref="XName"/> as an IEnumerable
		/// of XElement.
		/// </summary>
		/// <param name="name">The <see cref="XName"/> to match against descendant <see cref="XElement"/>s.</param>
		/// <returns>An <see cref="IEnumerable"/> of <see cref="XElement"/></returns>        
		public IEnumerable < XElement > Descendants(name:XName)
{
	return name != null ? GetDescendants(name, false) : XElement.EmptySequence;
}

/// <summary>
/// Returns the child element with this <see cref="XName"/> or null if there is no child element
/// with a matching <see cref="XName"/>.
/// <seealso cref="XContainer.Elements()"/>
/// </summary>
/// <param name="name">
/// The <see cref="XName"/> to match against this <see cref="XContainer"/>s child elements.
/// </param>
/// <returns>
/// An <see cref="XElement"/> child that matches the <see cref="XName"/> passed in, or null.
/// </returns>
Element(name:XName):XElement
{
	var n: XNode = content as XNode;
	if (n != null)
	{
		do
		{
			n = n.next;
			var e: XElement = n as XElement;
			if (e != null && e.name == name) return e;
		} while (n != content);
	}
	return null;
}

		///<overloads>
		/// Returns the child <see cref="XElement"/>s of this <see cref="XContainer"/>.
		/// </overloads>
		/// <summary>
		/// Returns all of the child elements of this <see cref="XContainer"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> over all of this <see cref="XContainer"/>'s child <see cref="XElement"/>s.
		/// </returns>
		public IEnumerable < XElement > Elements()
{
	return GetElements(null);
}

		/// <summary>
		/// Returns the child elements of this <see cref="XContainer"/> that match the <see cref="XName"/> passed in.
		/// </summary>
		/// <param name="name">
		/// The <see cref="XName"/> to match against the <see cref="XElement"/> children of this <see cref="XContainer"/>.
		/// </param>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> children of this <see cref="XContainer"/> that have
		/// a matching <see cref="XName"/>.
		/// </returns>
		public IEnumerable < XElement > Elements(name:XName)
{
	return name != null ? GetElements(name) : XElement.EmptySequence;
}

		///<overloads>
		/// Returns the content of this <see cref="XContainer"/>.  Note that the content does not
		/// include <see cref="XAttribute"/>s.
		/// <seealso cref="XElement.Attributes()"/>
		/// </overloads>
		/// <summary>
		/// Returns the content of this <see cref="XContainer"/> as an <see cref="IEnumerable"/> of <see cref="object"/>.  Note
		/// that the content does not include <see cref="XAttribute"/>s.
		/// <seealso cref="XElement.Attributes()"/>
		/// </summary>
		/// <returns>The contents of this <see cref="XContainer"/></returns>        
		public IEnumerable < XNode > Nodes()
{
	var n: XNode = LastNode;
	if (n != null)
	{
		do
		{
			n = n.next;
			yield return n;
		} while (n.parent == this && n != content);
	}
}

/// <summary>
/// Removes the nodes from this <see cref="XContainer"/>.  Note this
/// methods does not remove attributes.  See <see cref="XElement.RemoveAttributes()"/>.
/// <seealso cref="XElement.RemoveAttributes()"/>
/// </summary>
RemoveNodes():void
{
	if(SkipNotify())
	{
		RemoveNodesSkipNotify();
		return;
	}
	while (content != null)
	{
		var s: string = content as string;
		if (s != null)
		{
			if (s.length > 0)
			{
				ConvertTextToNode();
			}
			else
			{
				if (this instanceof XElement)
				{
					// Change in the serialization of an empty element: 
					// from start/end tag pair to empty tag
					NotifyChanging(this, XObjectChangeEventArgs.Value);
					if (<any>s != <any>content) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
					content = null;
					NotifyChanged(this, XObjectChangeEventArgs.Value);
				}
				else
				{
					content = null;
				}
			}

			var last: XNode = content as XNode;
			if (last != null)
			{
				var n: XNode = last.next;
				NotifyChanging(n, XObjectChangeEventArgs.Remove);
				if (last != content || n != last.next) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
				if (n != last)
				{
					last.next = n.next;
				}
				else
				{
					content = null;
				}
				n.parent = null;
				n.next = null;
				NotifyChanged(n, XObjectChangeEventArgs.Remove);
			}
		}
	}

/// <overloads>
/// Replaces the children nodes of this document or element with the specified content. The
/// content can be simple content, a collection of content objects, a parameter
/// list of content objects, or null.
/// </overloads>
/// <summary>
/// Replaces the children nodes of this document or element with the specified content.
/// </summary>
/// <param name="content">
/// A content object containing simple content or a collection of content objects
/// that replace the children nodes.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
ReplaceNodes(content: any): void
	{
		content = GetContentSnapshot(content);
		RemoveNodes();
		Add(content);
	}

/// <summary>
/// Replaces the children nodes of this document or element with the specified content.
/// </summary>
/// <param name="content">
/// A parameter list of content objects.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
ReplaceNodes(..._content: any[]): void
	{
		ReplaceNodes(<object > content);
	}

	/*internal*/ /*virtual*/ void _addAttribute(a:XAttribute)
{
}

	/*internal*/ /*virtual*/ void _addAttributeSkipNotify(a:XAttribute)
{
}

	/*internal*/ void AddContentSkipNotify(content:any)
{
	if (content == null) return;
	var n: XNode = content as XNode;
	if (n != null)
	{
		AddNodeSkipNotify(n);
		return;
	}
	var s: string = content as string;
	if (s != null)
	{
		AddStringSkipNotify(s);
		return;
	}
	var a: XAttribute = content as XAttribute;
	if (a != null)
	{
		_addAttributeSkipNotify(a);
		return;
	}
	var x: XStreamingElement = content as XStreamingElement;
	if (x != null)
	{
		AddNodeSkipNotify(new XElement(x));
		return;
	}
	object[] o = content as object[];
	if (o != null)
	{
		foreach(object obj in o) AddContentSkipNotify(obj);
		return;
	}
	var e: IEnumerable = content as IEnumerable;
	if (e != null)
	{
		foreach(object obj in e) AddContentSkipNotify(obj);
		return;
	}
	AddStringSkipNotify(GetStringValue(content));
}

	/*internal*/ void AddNode(n:XNode)
{
	_validateNode(n, this);
	if (n.parent != null)
	{
		n = n.CloneNode();
	}
	else
	{
		var p: XNode = this;
		while (p.parent != null) p = p.parent;
		if (n == p) n = n.CloneNode();
	}
	ConvertTextToNode();
	AppendNode(n);
}

	/*internal*/ void AddNodeSkipNotify(n:XNode)
{
	_validateNode(n, this);
	if (n.parent != null)
	{
		n = n.CloneNode();
	}
	else
	{
		var p: XNode = this;
		while (p.parent != null) p = p.parent;
		if (n == p) n = n.CloneNode();
	}
	ConvertTextToNode();
	AppendNodeSkipNotify(n);
}

	/*internal*/ void AddString(s:string)
{
	_validateString(s);
	if (content == null)
	{
		if (s.length > 0)
		{
			AppendNode(new XText(s));
		}
		else
		{
			if (this instanceof XElement)
			{
				// Change in the serialization of an empty element: 
				// from empty tag to start/end tag pair
				NotifyChanging(this, XObjectChangeEventArgs.Value);
				if (content != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
				content = s;
				NotifyChanged(this, XObjectChangeEventArgs.Value);
			}
			else
			{
				content = s;
			}
		}
	}
	else if (s.length > 0)
	{
		ConvertTextToNode();
		var tn: XText = content as XText;
		if (tn != null && !(tn instanceof XCData))
		{
			tn.Value += s;
		}
		else
		{
			AppendNode(new XText(s));
		}
	}
}

	/*internal*/ void AddStringSkipNotify(s:string)
{
	_validateString(s);
	if (content == null)
	{
		content = s;
	}
	else if (s.length > 0)
	{
		if (Types.isString(content))
		{
			content = <string>content + s;
		}
		else
		{
			var tn: XText = content as XText;
			if (tn != null && !(tn instanceof XCData))
			{
				tn.text += s;
			}
			else
			{
				AppendNodeSkipNotify(new XText(s));
			}
		}
	}
}

	/*internal*/ void AppendNode(n:XNode)
{
	var notify: boolean = NotifyChanging(n, XObjectChangeEventArgs.Add);
	if (n.parent != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
	AppendNodeSkipNotify(n);
	if (notify) NotifyChanged(n, XObjectChangeEventArgs.Add);
}

	/*internal*/ void AppendNodeSkipNotify(n:XNode)
{
	n.parent = this;
	if (content == null || Types.isString(content))
	{
		n.next = n;
	}
	else
	{
		var x: XNode = <XNode>content;
		n.next = x.next;
		x.next = n;
	}
	content = n;
}

	/*internal*/ void AppendText(sb:StringBuilder)
{
	var s: string = content as string;
	if (s != null)
	{
		sb.Append(s);
	}
	else
	{
		var n: XNode = <XNode>content;
		if (n != null)
		{
			do
			{
				n = n.next;
				n.AppendText(sb);
			} while (n != content);
		}
	}
}

private GetTextOnly():string
{
	if (content == null) return null;
	var s: string = content as string;
	if (s == null)
	{
		var n: XNode = <XNode>content;
		do
		{
			n = n.next;
			if (n.NodeType != XmlNodeType.Text) return null;
			s += (<XText>n).Value;
		} while (n != content);
	}
	return s;
}

private CollectText(ref XNode n):string
{
	var s: string = "";
	while (n != null && n.NodeType == XmlNodeType.Text)
	{
		s += (<XText>n).Value;
		n = n != content ? n.next : null;
	}
	return s;
}

	/*internal*/ boolean ContentsEqual(e:XContainer)
{
	if (content == e._content) return true;
	var s: string = GetTextOnly();
	if (s != null) return s == e.GetTextOnly();
	var n1: XNode = content as XNode;
	var n2: XNode = e._content as XNode;
	if (n1 != null && n2 != null)
	{
		n1 = n1.next;
		n2 = n2.next;
		while (true)
		{
			if (CollectText(n1:ref) != e.CollectText(n2:ref)) break;
			if (n1 == null && n2 == null) return true;
			if (n1 == null || n2 == null || !n1.DeepEquals(n2)) break;
			n1 = n1 != content ? n1.next : null;
			n2 = n2 != e._content ? n2.next : null;
		}
	}
	return false;
}

	/*internal*/ number/*int*/ ContentsHashCode()
{
	var s: string = GetTextOnly();
	if (s != null) return s.GetHashCode();
	var h: number/*int*/ = 0;
	var n: XNode = content as XNode;
	if (n != null)
	{
		do
		{
			n = n.next;
			var text: string = CollectText(n:ref);
			if (text.length > 0)
			{
				h ^= text.GetHashCode();
			}
			if (n == null) break;
			h ^= n.GetDeepHashCode();
		} while (n != content);
	}
	return h;
}

	/*internal*/ void ConvertTextToNode()
{
	var s: string = content as string;
	if (s != null && s.length > 0)
	{
		var t: XText = new XText(s);
		t.parent = this;
		t.next = t;
		content = t;
	}
}

	/*internal*/ static string GetDateTimeString(value:DateTime)
{
	return XmlConvert.ToString(value, XmlDateTimeSerializationMode.RoundtripKind);
}

	/*internal*/ IEnumerable < XNode > GetDescendantNodes(self:boolean)
{
	if (self) yield return this;
	var n: XNode = this;
	while (true)
	{
		var c: XContainer = n as XContainer;
			private first: XNode;
		if (c != null && (first = c.FirstNode) != null)
		{
			n = first;
		}
		else
		{
			while (n != null && n != this && n == n.parent._content) n = n.parent;
			if (n == null || n == this) break;
			n = n.next;
		}
		yield return n;
	}
}

	/*internal*/ IEnumerable < XElement > GetDescendants(name:XName, self:boolean)
{
	if (self)
	{
		var e: XElement = <XElement>this;
		if (name == null || e.name == name) yield return e;
	}
	var n: XNode = this;
	var c: XContainer = this;
	while (true)
	{
		if (c != null && c._content instanceof XNode)
		{
			n = (<XNode>c._content).next;
		}
		else
		{
			while (n != this && n == n.parent._content) n = n.parent;
			if (n == this) break;
			n = n.next;
		}
		var e: XElement = n as XElement;
		if (e != null && (name == null || e.name == name)) yield return e;
		c = e;
	}
}

IEnumerable < XElement > GetElements(name:XName)
{
	var n: XNode = content as XNode;
	if (n != null)
	{
		do
		{
			n = n.next;
			var e: XElement = n as XElement;
			if (e != null && (name == null || e.name == name)) yield return e;
		} while (n.parent == this && n != content);
	}
}

	/*internal*/ static string GetStringValue(value:any)
{
		private s: string;
	if (Types.isString(value))
	{
		s = <string>value;
	}
	else if (value instanceof double)
	{
		s = XmlConvert.ToString(<double>value);
	}
	else if (value instanceof float)
	{
		s = XmlConvert.ToString(<float>value);
	}
	else if (value instanceof decimal)
	{
		s = XmlConvert.ToString(<decimal>value);
	}
	else if (value instanceof boolean)
	{
		s = XmlConvert.ToString(<boolean>value);
	}
	else if (value instanceof DateTime)
	{
		s = GetDateTimeString(<DateTime>value);
	}
	else if (value instanceof DateTimeOffset)
	{
		s = XmlConvert.ToString(<DateTimeOffset>value);
	}
	else if (value instanceof TimeSpan)
	{
		s = XmlConvert.ToString(<TimeSpan>value);
	}
	else if (value instanceof XObject)
	{
		throw 'ArgumentException(Res.GetString(Res.Argument_XObjectValue))';
	}
	else
	{
		s = value.ToString();
	}
	if (s == null) throw 'ArgumentException(Res.GetString(Res.Argument_ConvertToString))';
	return s;
}

	/*internal*/ void ReadContentFrom(r:XmlReader)
{
	if (r.ReadState != ReadState.Interactive) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedInteractive))';
	var c: XContainer = this;
	var eCache: NamespaceCache = new NamespaceCache();
	var aCache: NamespaceCache = new NamespaceCache();
	do
	{
		switch (r.NodeType)
		{
			case XmlNodeType.Element:
				var e: XElement = new XElement(eCache.Get(r.NamespaceURI).GetName(r.LocalName));
				if (r.MoveToFirstAttribute())
				{
					do
					{
						e.AppendAttributeSkipNotify(new XAttribute(aCache.Get(r.Prefix.length == 0 ? string.Empty : r.NamespaceURI).GetName(r.LocalName), r.Value));
					} while (r.MoveToNextAttribute());
					r.MoveToElement();
				}
				c.AddNodeSkipNotify(e);
				if (!r.IsEmptyElement)
				{
					c = e;
				}
				break;
			case XmlNodeType.EndElement:
				if (c._content == null)
				{
					c._content = string.Empty;
				}
				if (c == this) return;
				c = c.parent;
				break;
			case XmlNodeType.Text:
			case XmlNodeType.SignificantWhitespace:
			case XmlNodeType.Whitespace:
				c.AddStringSkipNotify(r.Value);
				break;
			case XmlNodeType.CDATA:
				c.AddNodeSkipNotify(new XCData(r.Value));
				break;
			case XmlNodeType.Comment:
				c.AddNodeSkipNotify(new XComment(r.Value));
				break;
			case XmlNodeType.ProcessingInstruction:
				c.AddNodeSkipNotify(new XProcessingInstruction(r.Name, r.Value));
				break;
			case XmlNodeType.DocumentType:
				c.AddNodeSkipNotify(new XDocumentType(r.LocalName, r.GetAttribute("PUBLIC"), r.GetAttribute("SYSTEM"), r.Value, r.DtdInfo));
				break;
			case XmlNodeType.EntityReference:
				if (!r.CanResolveEntity) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnresolvedEntityReference))';
				r.ResolveEntity();
				break;
			case XmlNodeType.EndEntity:
				break;
			default:
				throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnexpectedNodeType, r.NodeType))';
		}
	} while (r.Read());
}

	/*internal*/ void ReadContentFrom(r:XmlReader, o:LoadOptions)
{
	if ((o & (LoadOptions.SetBaseUri | LoadOptions.SetLineInfo)) == 0)
	{
		ReadContentFrom(r);
		return;
	}
	if (r.ReadState != ReadState.Interactive) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedInteractive))';
	var c: XContainer = this;
	var n: XNode = null;
	var eCache: NamespaceCache = new NamespaceCache();
	var aCache: NamespaceCache = new NamespaceCache();
	var baseUri: string = (o & LoadOptions.SetBaseUri) != 0 ? r.BaseURI : null;
	var li: IXmlLineInfo = (o & LoadOptions.SetLineInfo) != 0 ? r as IXmlLineInfo : null;
	do
	{
		var uri: string = r.BaseURI;
		switch (r.NodeType)
		{
			case XmlNodeType.Element:
				{
					var e: XElement = new XElement(eCache.Get(r.NamespaceURI).GetName(r.LocalName));
					if (baseUri != null && baseUri != uri)
					{
						e.SetBaseUri(uri);
					}
					if (li != null && li.HasLineInfo())
					{
						e.SetLineInfo(li.LineNumber, li.LinePosition);
					}
					if (r.MoveToFirstAttribute())
					{
						do
						{
							var a: XAttribute = new XAttribute(aCache.Get(r.Prefix.length == 0 ? string.Empty : r.NamespaceURI).GetName(r.LocalName), r.Value);
							if (li != null && li.HasLineInfo())
							{
								a.SetLineInfo(li.LineNumber, li.LinePosition);
							}
							e.AppendAttributeSkipNotify(a);
						} while (r.MoveToNextAttribute());
						r.MoveToElement();
					}
					c.AddNodeSkipNotify(e);
					if (!r.IsEmptyElement)
					{
						c = e;
						if (baseUri != null)
						{
							baseUri = uri;
						}
					}
					break;
				}
			case XmlNodeType.EndElement:
				{
					if (c._content == null)
					{
						c._content = string.Empty;
					}
					// Store the line info of the end element tag.
					// Note that since we've got EndElement the current container must be an XElement
					var e: XElement = c as XElement;
					Debug.Assert(e != null, "EndElement recieved but the current container is not an element.");
					if (e != null && li != null && li.HasLineInfo())
					{
						e.SetEndElementLineInfo(li.LineNumber, li.LinePosition);
					}
					if (c == this) return;
					if (baseUri != null && c.HasBaseUri)
					{
						baseUri = c.parent.BaseUri;
					}
					c = c.parent;
					break;
				}
			case XmlNodeType.Text:
			case XmlNodeType.SignificantWhitespace:
			case XmlNodeType.Whitespace:
				if ((baseUri != null && baseUri != uri) ||
					(li != null && li.HasLineInfo()))
				{
					n = new XText(r.Value);
				}
				else
				{
					c.AddStringSkipNotify(r.Value);
				}
				break;
			case XmlNodeType.CDATA:
				n = new XCData(r.Value);
				break;
			case XmlNodeType.Comment:
				n = new XComment(r.Value);
				break;
			case XmlNodeType.ProcessingInstruction:
				n = new XProcessingInstruction(r.Name, r.Value);
				break;
			case XmlNodeType.DocumentType:
				n = new XDocumentType(r.LocalName, r.GetAttribute("PUBLIC"), r.GetAttribute("SYSTEM"), r.Value, r.DtdInfo);
				break;
			case XmlNodeType.EntityReference:
				if (!r.CanResolveEntity) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnresolvedEntityReference))';
				r.ResolveEntity();
				break;
			case XmlNodeType.EndEntity:
				break;
			default:
				throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_UnexpectedNodeType, r.NodeType))';
		}
		if (n != null)
		{
			if (baseUri != null && baseUri != uri)
			{
				n.SetBaseUri(uri);
			}
			if (li != null && li.HasLineInfo())
			{
				n.SetLineInfo(li.LineNumber, li.LinePosition);
			}
			c.AddNodeSkipNotify(n);
			n = null;
		}
	} while (r.Read());
}

	/*internal*/ void RemoveNode(n:XNode)
{
	var notify: boolean = NotifyChanging(n, XObjectChangeEventArgs.Remove);
	if (n.parent != this) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
	var p: XNode = <XNode>content;
	while (p.next != n) p = p.next;
	if (p == n)
	{
		content = null;
	}
	else
	{
		if (content == n) content = p;
		p.next = n.next;
	}
	n.parent = null;
	n.next = null;
	if (notify) NotifyChanged(n, XObjectChangeEventArgs.Remove);
}

private RemoveNodesSkipNotify():void
{
	var n: XNode = content as XNode;
	if(n != null)
	{
		do
		{
			var next: XNode = n.next;
			n.parent = null;
			n.next = null;
			n = next;
		} while (n != content);
	}
	content = null;
}

	// Validate insertion of the given node. previous is the node after which insertion
	// will occur. previous == null means at beginning, previous == this means at end.
	/*internal*/ /*virtual*/ void _validateNode(node:XNode, previous:XNode)
{
}

	/*internal*/ /*virtual*/ void _validateString(s:string)
{
}

	/*internal*/ void WriteContentTo(writer:XmlWriter)
{
	if (content != null)
	{
		if (Types.isString(content))
		{
			if (this instanceof XDocument)
			{
				writer.WriteWhitespace(<string>content);
			}
			else
			{
				writer.WriteString(<string>content);
			}
		}
		else
		{
			var n: XNode = <XNode>content;
			do
			{
				n = n.next;
				n.WriteTo(writer);
			} while (n != content);
		}
	}
}

		static void AddContentToList(List < object > list, content:any)
{
	var e: IEnumerable = Types.isString(content) ? null : content as IEnumerable;
	if (e == null)
	{
		list.Add(content);
	}
	else
	{
		foreach(object obj in e)
		{
			if (obj != null) AddContentToList(list, obj);
		}
	}
}

		static /*internal*/ object GetContentSnapshot(content:any)
{
	if (Types.isString(content) || !(content instanceof IEnumerable)) return content;
	List < object > list = new List<any>();
	AddContentToList(list, content);
	return list;
}
}

/*internal*/ struct Inserter
{
	private parent: XContainer;
private previous: XNode;
private text: string;

		public Inserter(parent:XContainer, anchor:XNode)
	{
		this.parent = parent;
		this.previous = anchor;
		this.text = null;
	}

	Add(content:any):void
	{
		AddContent(content);
		if(text != null)
		{
			if (parent._content == null)
			{
				if (parent.SkipNotify())
				{
					parent._content = text;
				}
				else
				{
					if (text.length > 0)
					{
						InsertNode(new XText(text));
					}
					else
					{
						if (parent instanceof XElement)
						{
							// Change in the serialization of an empty element: 
							// from empty tag to start/end tag pair
							parent.NotifyChanging(parent, XObjectChangeEventArgs.Value);
							if (parent._content != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
							parent._content = text;
							parent.NotifyChanged(parent, XObjectChangeEventArgs.Value);
						}
						else
						{
							parent._content = text;
						}
					}
				}
			}
			else if (text.length > 0)
			{
				if (previous instanceof XText && !(previous instanceof XCData))
				{
					(<XText>previous).Value += text;
				}
				else
				{
					parent.ConvertTextToNode();
					InsertNode(new XText(text));
				}
			}
		}
	}

private AddContent(content:any):void
	{
		if(content == null) return;
		var n: XNode = content as XNode;
		if(n != null)
		{
			AddNode(n);
			return;
		}
	var s: string = content as string;
		if(s != null)
		{
			AddString(s);
			return;
		}
	var x: XStreamingElement = content as XStreamingElement;
		if(x != null)
		{
			AddNode(new XElement(x));
			return;
		}
	object[] o = content as object[];
		if(o != null)
		{
			foreach(object obj in o) AddContent(obj);
			return;
		}
	var e: IEnumerable = content as IEnumerable;
		if(e != null)
		{
			foreach(object obj in e) AddContent(obj);
			return;
		}
	if (content instanceof XAttribute) throw 'ArgumentException(Res.GetString(Res.Argument_AddAttribute))';
		AddString(XContainer.GetStringValue(content));
	}

private AddNode(n:XNode):void
	{
		parent._validateNode(n, previous);
		if(n.parent != null)
		{
			n = n.CloneNode();
		}
	else
	{
			var p: XNode = parent;
			while(p.parent != null) p = p.parent;
			if(n == p) n = n.CloneNode();
		}
	parent.ConvertTextToNode();
		if(text != null)
		{
			if (text.length > 0)
			{
				if (previous instanceof XText && !(previous instanceof XCData))
				{
					(<XText>previous).Value += text;
				}
				else
				{
					InsertNode(new XText(text));
				}
			}
			text = null;
		}
InsertNode(n);
	}

private AddString(s:string):void
	{
		parent._validateString(s);
		text += s;
	}

// Prepends if previous == null, otherwise inserts after previous
private InsertNode(n:XNode):void
	{
		var notify: boolean = parent.NotifyChanging(n, XObjectChangeEventArgs.Add);
		if(n.parent != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
		n.parent = parent;
		if(parent._content == null || Types.isString(parent._content))
		{
			n.next = n;
			parent._content = n;
		}
			else if (previous == null)
		{
			var last: XNode = <XNode>parent._content;
			n.next = last.next;
			last.next = n;
		}
	else
	{
			n.next = previous.next;
			previous.next = n;
			if(parent._content == previous) parent._content = n;
		}
	previous = n;
		if(notify) parent.NotifyChanged(n, XObjectChangeEventArgs.Add);
	}
}

/*internal*/ struct NamespaceCache
{
	private ns: XNamespace;
private namespaceName: string;

	Get(namespaceName:string):XNamespace
	{
		if (<any>namespaceName == <any>this.namespaceName) return this.ns;
		this.namespaceName = namespaceName;
		this.ns = XNamespace.Get(namespaceName);
		return this.ns;
	}
}

/// <summary>
/// Represents an XML element.
/// </summary>
/// <remarks>
/// An element has an <see cref="XName"/>, optionally one or more attributes,
/// and can optionally contain content (see <see cref="XContainer.Nodes"/>.
/// An <see cref="XElement"/> can contain the following types of content:
///   <list>
///     <item>string (content:Text)</item>
///     <item><see cref="XElement"/></item>
///     <item><see cref="XComment"/></item>
///     <item><see cref="XProcessingInstruction"/></item>
///   </list>
/// </remarks>
export class XElement extends XContainer implements XmlSerializable
{
	static IEnumerable<XElement> emptySequence;

	/// <summary>
	/// Gets an empty collection of elements.
	/// </summary>
	public static IEnumerable<XElement> EmptySequence
	{
	get
	{
		if (emptySequence == null) emptySequence = new XElement[0];
		return emptySequence;
	}
}

	/*internal*/ XName name;
	/*internal*/ XAttribute lastAttr;

		/// <summary>
		/// Initializes a new instance of the XElement class with the specified name.
		/// </summary>
		/// <param name="name">
		/// The name of the element.
		/// </param>
		public XElement(name:XName)
{
	if (name == null) throw 'ArgumentNullException("name")';
	this.name = name;
}

		/// <summary>
		/// Initializes a new instance of the XElement class with the specified name and content.
		/// </summary>
		/// <param name="name">
		/// The element name.
		/// </param>
		/// <param name="content">The initial contents of the element.</param>
		/// <remarks>
		/// See XContainer.Add(content:any) for details about the content that can be added
		/// using this method.
		/// </remarks>
		public XElement(name:XName, content:any)
			: this(name)
{
	AddContentSkipNotify(content);
}

		/// <summary>
		/// Initializes a new instance of the XElement class with the specified name and content.
		/// </summary>
		/// <param name="name">
		/// The element name.
		/// </param>
		/// <param name="content">
		/// The initial content of the element.
		/// </param>
		/// <remarks>
		/// See XContainer.Add(content:any) for details about the content that can be added
		/// using this method.
		/// </remarks>
		public XElement(name:XName, ..._content:any[]) : this(name, <any>content) { }

		/// <summary>
		/// Initializes a new instance of the XElement class from another XElement object.
		/// </summary>
		/// <param name="other">
		/// Another element that will be copied to this element.
		/// </param>
		/// <remarks>
		/// This constructor makes a deep copy from one element to another.
		/// </remarks>
		public XElement(other:XElement)
			: base(other)
{
	this.name = other.name;
	var a: XAttribute = other.lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			AppendAttributeSkipNotify(new XAttribute(a));
		} while (a != other.lastAttr);
	}
}

		/// <summary>
		/// Initializes an XElement object from an <see cref="XStreamingElement"/> object.
		/// </summary>
		/// <param name="other">
		/// The <see cref="XStreamingElement"/> object whose value will be used
		/// to initialise the new element.
		/// </param>
		public XElement(other:XStreamingElement)
{
	if (other == null) throw 'ArgumentNullException("other")';
	name = other.name;
	AddContentSkipNotify(other._content);
}

	/*internal*/ XElement()
			: this("default")
{
}

	/*internal*/ XElement(r:XmlReader)
			: this(r, LoadOptions.None)
{
}

	/*internal*/ XElement(r:XmlReader, o:LoadOptions)
{
	ReadElementFrom(r, o);
}

/// <summary>
/// Gets the first attribute of an element.
/// </summary>
get FirstAttribute():XAttribute
{
	return lastAttr != null ? lastAttr.next : null;
}

/// <summary>
/// Gets a value indicating whether the element as at least one attribute.
/// </summary>
get HasAttributes():boolean
{
	return lastAttr != null;
}

		/// <summary>
		/// Gets a value indicating whether the element has at least one child element.
		/// </summary>
		public boolean HasElements
{
	get
	{
		var n: XNode = content as XNode;
		if (n != null)
		{
			do
			{
				if (n instanceof XElement) return true;
				n = n.next;
			} while (n != content);
		}
		return false;
	}
}

/// <summary>
/// Gets a value indicating whether the element contains no content.
/// </summary>
get IsEmpty():boolean
{
	return content == null;
}

/// <summary>
/// Gets the last attribute of an element.
/// </summary>
get LastAttribute():XAttribute
{
	return lastAttr;
}

		/// <summary>
		/// Gets the name of this element.
		/// </summary>
		public XName Name
{
	get
	{
		return name;
	}
	set
	{
		if (value == null) throw 'ArgumentNullException("value")';
		var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Name);
		name = value;
		if (notify) NotifyChanged(this, XObjectChangeEventArgs.Name);
	}
}

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.Text.
		/// </remarks>
		public XmlNodeType NodeType
{
	get
	{
		return XmlNodeType.Element;
	}
}

		/// <summary>
		/// Gets the text contents of this element.
		/// </summary>
		/// <remarks>
		/// If there is text content interspersed with nodes (content:mixed) then the text content
		/// will be concatenated and returned.
		/// </remarks>
		public string Value
{
	get
	{
		if (content == null) return string.Empty;
		var s: string = content as string;
		if (s != null) return s;
		var sb: StringBuilder = new StringBuilder();
		AppendText(sb);
		return sb.ToString();
	}
	set
	{
		if (value == null) throw 'ArgumentNullException("value")';
		RemoveNodes();
		Add(value);
	}
}

/// <overloads>
/// Returns this <see cref="XElement"/> and all of it's ancestors up
/// to the root node.  Optionally an <see cref="XName"/> can be passed
/// in to target a specific ancestor(s).
/// <seealso cref="XNode.Ancestors()"/>
/// </overloads>
/// <summary>
/// Returns this <see cref="XElement"/> and all of it's ancestors up to 
/// the root node.
/// <seealso cref="XNode.Ancestors()"/>
/// </summary>
/// <returns>
/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing all of
/// this <see cref="XElement"/>'s ancestors up to the root node (including
/// this <see cref="XElement"/>.
/// </returns>
AncestorsAndSelf():IEnumerable < XElement >
{
	return GetAncestors(null, true);
}

/// <summary>
/// Returns the ancestor(s) of this <see cref="XElement"/> with the matching
/// <see cref="XName"/>. If this <see cref="XElement"/>'s <see cref="XName"/>
/// matches the <see cref="XName"/> passed in then it will be invluded in the 
/// resulting <see cref="IEnumerable"/> or <see cref="XElement"/>.
/// <seealso cref="XNode.Ancestors()"/>
/// </summary>
/// <param name="name">
/// The <see cref="XName"/> of the target ancestor.
/// </param>
/// <returns>
/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the
/// ancestors of this <see cref="XElement"/> with a matching <see cref="XName"/>.
/// </returns>
AncestorsAndSelf(name:XName):IEnumerable < XElement >
{
	return name != null ? GetAncestors(name, true) : XElement.EmptySequence;
}

/// <summary>
/// Returns the <see cref="XAttribute"/> associated with this <see cref="XElement"/> that has this 
/// <see cref="XName"/>.
/// </summary>
/// <param name="name">
/// The <see cref="XName"/> of the <see cref="XAttribute"/> to get.
/// </param>
/// <returns>
/// The <see cref="XAttribute"/> with the <see cref="XName"/> passed in.  If there is no <see cref="XAttribute"/>
/// with this <see cref="XName"/> then null is returned.
/// </returns>
Attribute(name:XName):XAttribute
{
	var a: XAttribute = lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			if (a.name == name) return a;
		} while (a != lastAttr);
	}
	return null;
}

/// <overloads>
/// Returns the <see cref="XAttribute"/> associated with this <see cref="XElement"/>.  Optionally
/// an <see cref="XName"/> can be given to target a specific <see cref="XAttribute"/>(s).
/// </overloads>
/// <summary>
/// Returns all of the <see cref="XAttribute"/>s associated with this <see cref="XElement"/>.
/// <seealso cref="XContainer.Elements()"/>
/// </summary>
/// <returns>
/// An <see cref="IEnumerable"/> of <see cref="XAttribute"/> containing all of the <see cref="XAttribute"/>s
/// associated with this <see cref="XElement"/>.
/// </returns>
Attributes():IEnumerable < XAttribute >
{
	return GetAttributes(null);
}

/// <summary>
/// Returns the <see cref="XAttribute"/>(s) associated with this <see cref="XElement"/> that has the passed
/// in <see cref="XName"/>.
/// <seealso cref="XElement.Attributes()"/>
/// </summary>
/// <param name="name">
/// The <see cref="XName"/> of the targeted <see cref="XAttribute"/>.
/// </param>
/// <returns>
/// The <see cref="XAttribute"/>(s) with the matching 
/// </returns>
Attributes(name:XName):IEnumerable < XAttribute >
{
	return name != null ? GetAttributes(name) : XAttribute.EmptySequence;
}

/// <summary>
/// Get the self and descendant nodes for an <see cref="XElement"/>
/// </summary>
/// <returns></returns>
DescendantNodesAndSelf():IEnumerable < XNode >
{
	return GetDescendantNodes(true);
}

/// <overloads>
/// Returns this <see cref="XElement"/> and all of it's descendants.  Overloads allow
/// specification of a type of descendant to return, or a specific <see cref="XName"/>
/// of a descendant <see cref="XElement"/> to match.
/// </overloads>
/// <summary>
/// Returns this <see cref="XElement"/> and all of it's descendant <see cref="XElement"/>s
/// as an <see cref="IEnumerable"/> of <see cref="XElement"/>.
/// <seealso cref="XElement.DescendantsAndSelf()"/>
/// </summary>
/// <returns>
/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing this <see cref="XElement"/>
/// and all of it's descendants.
/// </returns>
DescendantsAndSelf():IEnumerable < XElement >
{
	return GetDescendants(null, true);
}

/// <summary>
/// Returns the descendants of this <see cref="XElement"/> that have a matching <see cref="XName"/>
/// to the one passed in, including, potentially, this <see cref="XElement"/>.
/// <seealso cref="XElement.DescendantsAndSelf(XName)"/>
/// </summary>
/// <param name="name">
/// The <see cref="XName"/> of the descendant <see cref="XElement"/> that is being targeted.
/// </param>
/// <returns>
/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing all of the descendant
/// <see cref="XElement"/>s that have this <see cref="XName"/>.
/// </returns>
DescendantsAndSelf(name:XName):IEnumerable < XElement >
{
	return name != null ? GetDescendants(name, true) : XElement.EmptySequence;
}

/// <summary>
/// Returns the default <see cref="XNamespace"/> of an <see cref="XElement"/> 
/// </summary>
GetDefaultNamespace():XNamespace
{
	var namespaceName: string = GetNamespaceOfPrefixInScope("xmlns", null);
	return namespaceName != null ? XNamespace.Get(namespaceName) : XNamespace.None;
}

/// <summary>
/// Get the namespace associated with a particular prefix for this <see cref="XElement"/> 
/// in its document context. 
/// </summary>
/// <param name="prefix">The namespace prefix to look up</param>
/// <returns>An <see cref="XNamespace"/> for the namespace bound to the prefix</returns>
GetNamespaceOfPrefix(prefix:string):XNamespace
{
	if (prefix == null) throw 'ArgumentNullException("prefix")';
	if (prefix.length == 0) throw 'ArgumentException(Res.GetString(Res.Argument_InvalidPrefix, prefix))';
	if (prefix == "xmlns") return XNamespace.Xmlns;
	var namespaceName: string = GetNamespaceOfPrefixInScope(prefix, null);
	if (namespaceName != null) return XNamespace.Get(namespaceName);
	if (prefix == "xml") return XNamespace.Xml;
	return null;
}

/// <summary>
/// Get the prefix associated with a namespace for an element in its context.
/// </summary>
/// <param name="ns">The <see cref="XNamespace"/> for which to get a prefix</param>
/// <returns>The namespace prefix string</returns>
GetPrefixOfNamespace(ns:XNamespace):string
{
	if (ns == null) throw 'ArgumentNullException("ns")';
	var namespaceName: string = ns.NamespaceName;
	var hasInScopeNamespace: boolean = false;
	var e: XElement = this;
	do
	{
		var a: XAttribute = e.lastAttr;
		if (a != null)
		{
			var hasLocalNamespace: boolean = false;
			do
			{
				a = a.next;
				if (a.IsNamespaceDeclaration)
				{
					if (a.Value == namespaceName)
					{
						if (a.Name.NamespaceName.length != 0 &&
							(!hasInScopeNamespace ||
								GetNamespaceOfPrefixInScope(a.Name.LocalName, e) == null))
						{
							return a.Name.LocalName;
						}
					}
					hasLocalNamespace = true;
				}
			}
			while (a != e.lastAttr);
			hasInScopeNamespace |= hasLocalNamespace;
		}
		e = e.parent as XElement;
	}
	while (e != null);
	if (<any>namespaceName == <any>XNamespace.xmlPrefixNamespace)
	{
		if (!hasInScopeNamespace || GetNamespaceOfPrefixInScope("xml", null) == null) return "xml";
	}
	else if (<any>namespaceName == <any>XNamespace.xmlnsPrefixNamespace)
	{
		return "xmlns";
	}
	return null;
}

/// <overloads>
/// The Load method provides multiple strategies for creating a new 
/// <see cref="XElement"/> and initializing it from a data source containing
/// raw XML.  Load from a file (passing in a URI to the file), an
/// <see cref="Stream"/>, a <see cref="TextReader"/>, or an
/// <see cref="XmlReader"/>.  Note:  Use <see cref="XDocument.Parse(string)"/>
/// to create an <see cref="XDocument"/> from a string containing XML.
/// <seealso cref="XDocument.Load(string)" />
/// <seealso cref="XElement.Parse(string)"/>
/// </overloads>
/// <summary>
/// Create a new <see cref="XElement"/> based on the contents of the file 
/// referenced by the URI parameter passed in.  Note: Use 
/// <see cref="XElement.Parse(string)"/> to create an <see cref="XElement"/> from
/// a string containing XML.
/// <seealso cref="XmlReader.Create(string)"/>
/// <seealso cref="XElement.Parse(string)"/>
/// <seealso cref="XDocument.Parse(string)"/>
/// </summary>
/// <remarks>
/// This method uses the <see cref="XmlReader.Create(string)"/> method to create
/// an <see cref="XmlReader"/> to read the raw XML into the underlying
/// XML tree.
/// </remarks>
/// <param name="uri">
/// A URI string referencing the file to load into a new <see cref="XElement"/>.
/// </param>
/// <returns>
/// An <see cref="XElement"/> initialized with the contents of the file referenced
/// in the passed in uri parameter.
/// </returns>
		static Load(uri:string):XElement
{
	return Load(uri, LoadOptions.None);
}

/// <summary>
/// Create a new <see cref="XElement"/> based on the contents of the file 
/// referenced by the URI parameter passed in.  Optionally, whitespace can be preserved.  
/// <see cref="XmlReader.Create(string)"/>
/// <seealso cref="XDocument.Load(string, LoadOptions)"/> 
/// </summary>
/// <remarks>
/// This method uses the <see cref="XmlReader.Create(string)"/> method to create
/// an <see cref="XmlReader"/> to read the raw XML into an underlying
/// XML tree. If LoadOptions.PreserveWhitespace is enabled then
/// the <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
/// is set to false.
/// </remarks>
/// <param name="uri">
/// A string representing the URI of the file to be loaded into a new <see cref="XElement"/>.
/// </param>
/// <param name="options">
/// A set of <see cref="LoadOptions"/>.
/// </param>
/// <returns>
/// An <see cref="XElement"/> initialized with the contents of the file referenced
/// in the passed uri parameter.  If LoadOptions.PreserveWhitespace is enabled then
/// significant whitespace will be preserved.
/// </returns>
		static Load(uri:string, options:LoadOptions):XElement
{
	var rs: XmlReaderSettings = GetXmlReaderSettings(options);
	using(var r: XmlReader = XmlReader.Create(uri, rs))
	{
		return Load(r, options);
	}
}

		/// <summary>
		/// Create a new <see cref="XElement"/> and initialize its underlying XML tree using
		/// the passed <see cref="Stream"/> parameter.  
		/// </summary>
		/// <param name="stream">
		/// A <see cref="Stream"/> containing the raw XML to read into the newly
		/// created <see cref="XElement"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed in
		/// <see cref="Stream"/>.
		/// </returns>
		static Load(stream:Stream):XElement
{
	return Load(stream, LoadOptions.None);
}

		/// <summary>
		/// Create a new <see cref="XElement"/> and initialize its underlying XML tree using
		/// the passed <see cref="Stream"/> parameter.  Optionally whitespace handling
		/// can be preserved.
		/// </summary>
		/// <remarks>
		/// If LoadOptions.PreserveWhitespace is enabled then
		/// the <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
		/// is set to false.
		/// </remarks>
		/// <param name="stream">
		/// A <see cref="Stream"/> containing the raw XML to read into the newly
		/// created <see cref="XElement"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed in
		/// <see cref="Stream"/>.
		/// </returns>
		static Load(stream:Stream, options:LoadOptions):XElement
{
	var rs: XmlReaderSettings = GetXmlReaderSettings(options);
	using(var r: XmlReader = XmlReader.Create(stream, rs))
	{
		return Load(r, options);
	}
}
		/// <summary>
		/// Create a new <see cref="XElement"/> and initialize its underlying XML tree using
		/// the passed <see cref="TextReader"/> parameter.  
		/// </summary>
		/// <param name="textReader">
		/// A <see cref="TextReader"/> containing the raw XML to read into the newly
		/// created <see cref="XElement"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed in
		/// <see cref="TextReader"/>.
		/// </returns>
		static Load(textReader:TextReader):XElement
{
	return Load(textReader, LoadOptions.None);
}

		/// <summary>
		/// Create a new <see cref="XElement"/> and initialize its underlying XML tree using
		/// the passed <see cref="TextReader"/> parameter.  Optionally whitespace handling
		/// can be preserved.
		/// </summary>
		/// <remarks>
		/// If LoadOptions.PreserveWhitespace is enabled then
		/// the <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
		/// is set to false.
		/// </remarks>
		/// <param name="textReader">
		/// A <see cref="TextReader"/> containing the raw XML to read into the newly
		/// created <see cref="XElement"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed in
		/// <see cref="TextReader"/>.
		/// </returns>
		static Load(textReader:TextReader, options:LoadOptions):XElement
{
	var rs: XmlReaderSettings = GetXmlReaderSettings(options);
	using(var r: XmlReader = XmlReader.Create(textReader, rs))
	{
		return Load(r, options);
	}
}

		/// <summary>
		/// Create a new <see cref="XElement"/> containing the contents of the
		/// passed in <see cref="XmlReader"/>.
		/// </summary>
		/// <param name="reader">
		/// An <see cref="XmlReader"/> containing the XML to be read into the new
		/// <see cref="XElement"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed
		/// in <see cref="XmlReader"/>.
		/// </returns>
		static Load(reader:XmlReader):XElement
{
	return Load(reader, LoadOptions.None);
}

		/// <summary>
		/// Create a new <see cref="XElement"/> containing the contents of the
		/// passed in <see cref="XmlReader"/>.
		/// </summary>
		/// <param name="reader">
		/// An <see cref="XmlReader"/> containing the XML to be read into the new
		/// <see cref="XElement"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XElement"/> containing the contents of the passed
		/// in <see cref="XmlReader"/>.
		/// </returns>
		static Load(reader:XmlReader, options:LoadOptions):XElement
{
	if (reader == null) throw 'ArgumentNullException("reader")';
	if (reader.MoveToContent() != XmlNodeType.Element) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedNodeType, XmlNodeType.Element, reader.NodeType))';
	var e: XElement = new XElement(reader, options);
	reader.MoveToContent();
	if (!reader.EOF) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedEndOfFile))';
	return e;
}

		/// <overloads>
		/// Parses a string containing XML into an <see cref="XElement"/>.  Optionally
		/// whitespace can be preserved.
		/// </overloads>
		/// <summary>
		/// Parses a string containing XML into an <see cref="XElement"/>.  
		/// </summary>
		/// <remarks>
		/// The XML must contain only one root node.
		/// </remarks>
		/// <param name="text">
		/// A string containing the XML to parse into an <see cref="XElement"/>.
		/// </param>
		/// <returns>
		/// An <see cref="XElement"/> created from the XML string passed in.
		/// </returns>
		static Parse(text:string):XElement
{
	return Parse(text, LoadOptions.None);
}

		/// <summary>
		/// Parses a string containing XML into an <see cref="XElement"/> and 
		/// optionally preserves the Whitespace.  See <see cref="XmlReaderSetting.IgnoreWhitespace"/>.
		/// </summary>
		/// <remarks>
		/// <list>
		/// <item>The XML must contain only one root node.</item>
		/// <item>
		/// If LoadOptions.PreserveWhitespace is enabled the underlying 
		/// <see cref="XmlReaderSettings"/>'
		/// property <see cref="XmlReaderSettings.IgnoreWhitespace"/> will be set to false.
		/// </item>
		/// </list>
		/// </remarks>
		/// <param name="text">
		/// A string containing the XML to parse into an <see cref="XElement"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// An <see cref="XElement"/> created from the XML string passed in.
		/// </returns>
		static Parse(text:string, options:LoadOptions):XElement
{
	using(var sr: StringReader = new StringReader(text))
	{
		XmlReaderSettings rs = GetXmlReaderSettings(options);
		using(var r: XmlReader = XmlReader.Create(sr, rs))
		{
			return Load(r, options);
		}
	}
}

/// <summary>
/// Removes content and attributes from this <see cref="XElement"/>.
/// <seealso cref="XElement.RemoveAttributes"/>
/// <seealso cref="XContainer.RemoveNodes"/>
/// </summary>
RemoveAll():void
{
	RemoveAttributes();
	RemoveNodes();
}

/// <summary>
/// Removes that attributes of this <see cref="XElement"/>.
/// <seealso cref="XElement.RemoveAll"/>
/// <seealso cref="XElement.RemoveAttributes"/>
/// </summary>
RemoveAttributes():void
{
	if(SkipNotify())
	{
		RemoveAttributesSkipNotify();
		return;
	}
	while (lastAttr != null)
	{
		var a: XAttribute = lastAttr.next;
		NotifyChanging(a, XObjectChangeEventArgs.Remove);
		if (lastAttr == null || a != lastAttr.next) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
		if (a != lastAttr)
		{
			lastAttr.next = a.next;
		}
		else
		{
			lastAttr = null;
		}
		a.parent = null;
		a.next = null;
		NotifyChanged(a, XObjectChangeEventArgs.Remove);
	}
}

/// <overloads>
/// Replaces the child nodes and the attributes of this element with the
/// specified content. The content can be simple content, a collection of
/// content objects, a parameter list of content objects, or null.
/// </overloads>
/// <summary>
/// Replaces the children nodes and the attributes of this element with the specified content.
/// </summary>
/// <param name="content">
/// The content that will replace the child nodes and attributes of this element.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
ReplaceAll(content:any):void
{
	content = GetContentSnapshot(content);
	RemoveAll();
	Add(content);
}

/// <summary>
/// Replaces the children nodes and the attributes of this element with the specified content.
/// </summary>
/// <param name="content">
/// A parameter list of content objects.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
ReplaceAll(..._content:any[]):void
{
	ReplaceAll(<object > content);
}

/// <overloads>
/// Replaces the attributes of this element with the specified content.
/// The content can be simple content, a collection of
/// content objects, a parameter list of content objects, or null.
/// </overloads>
/// <summary>
/// Replaces the attributes of this element with the specified content.
/// </summary>
/// <param name="content">
/// The content that will replace the attributes of this element.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
ReplaceAttributes(content:any):void
{
	content = GetContentSnapshot(content);
	RemoveAttributes();
	Add(content);
}

/// <summary>
/// Replaces the attributes of this element with the specified content.
/// </summary>
/// <param name="content">
/// A parameter list of content objects.
/// </param>
/// <remarks>
/// See XContainer.Add(content:any) for details about the content that can be added
/// using this method.
/// </remarks>
ReplaceAttributes(..._content:any[]):void
{
	ReplaceAttributes(<object > content);
}

///<overloads>
/// Outputs this <see cref="XElement"/>'s underlying XML tree.  The output can
/// be saved to a file, a <see cref="Stream"/>, a <see cref="TextWriter"/>,
/// or an <see cref="XmlWriter"/>.  Optionally whitespace can be preserved.  
/// </overloads>
/// <summary>
/// Output this <see cref="XElement"/> to a file.
/// </summary>
/// <remarks>
/// The format will be indented by default.  If you want
/// no indenting then use the SaveOptions version of Save (see
/// <see cref="XElement.Save(string, SaveOptions)"/>) enabling 
/// SaveOptions.DisableFormatting. 
/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </remarks>
/// <param name="fileName">
/// The name of the file to output the XML to.
/// </param>

Save(fileName:string):void
{
	Save(fileName, GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Output this <see cref="XElement"/> to a file.
/// </summary>
/// <param name="fileName">
/// The name of the file to output the XML to.  
/// </param>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
Save(fileName:string, options:SaveOptions):void
{
	var ws: XmlWriterSettings = GetXmlWriterSettings(options);
	using(var w: XmlWriter = XmlWriter.Create(fileName, ws))
	{
	Save(w);
}
}
/// <summary>
/// Output this <see cref="XElement"/> to the passed in <see cref="Stream"/>.
/// </summary>
/// <remarks>
/// The format will be indented by default.  If you want
/// no indenting then use the SaveOptions version of Save (see
/// <see cref="XElement.Save(Stream, SaveOptions)"/>) enabling 
/// SaveOptions.DisableFormatting.
/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </remarks>
/// <param name="stream">
/// The <see cref="Stream"/> to output this <see cref="XElement"/> to.
/// </param>
Save(stream:Stream):void
{
	Save(stream, GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Output this <see cref="XElement"/> to a <see cref="Stream"/>.
/// </summary>
/// <param name="stream">
/// The <see cref="Stream"/> to output the XML to.  
/// </param>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
Save(stream:Stream, options:SaveOptions):void
{
	var ws: XmlWriterSettings = GetXmlWriterSettings(options);
	using(var w: XmlWriter = XmlWriter.Create(stream, ws))
	{
	Save(w);
}
}

/// <summary>
/// Output this <see cref="XElement"/> to the passed in <see cref="TextWriter"/>.
/// </summary>
/// <remarks>
/// The format will be indented by default.  If you want
/// no indenting then use the SaveOptions version of Save (see
/// <see cref="XElement.Save(TextWriter, SaveOptions)"/>) enabling 
/// SaveOptions.DisableFormatting.
/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </remarks>
/// <param name="textWriter">
/// The <see cref="TextWriter"/> to output this <see cref="XElement"/> to.
/// </param>
Save(textWriter:TextWriter):void
{
	Save(textWriter, GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Output this <see cref="XElement"/> to a <see cref="TextWriter"/>.
/// </summary>
/// <param name="textWriter">
/// The <see cref="TextWriter"/> to output the XML to.  
/// </param>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
Save(textWriter:TextWriter, options:SaveOptions):void
{
	var ws: XmlWriterSettings = GetXmlWriterSettings(options);
	using(var w: XmlWriter = XmlWriter.Create(textWriter, ws))
	{
	Save(w);
}
}

/// <summary>
/// Output this <see cref="XElement"/> to an <see cref="XmlWriter"/>.
/// </summary>
/// <param name="writer">
/// The <see cref="XmlWriter"/> to output the XML to.
/// </param>
Save(writer:XmlWriter):void
{
	if(writer == null) throw 'ArgumentNullException("writer")';
	writer.WriteStartDocument();
	WriteTo(writer);
	writer.WriteEndDocument();
}

/// <summary>
/// Sets the value of an attribute. The value is assigned to the attribute with the given
/// name. If no attribute with the given name exists, a new attribute is added. If the
/// value is null, the attribute with the given name, any:if, is deleted.
/// <seealso cref="XAttribute.SetValue"/>
/// <seealso cref="XElement.SetElementValue"/>
/// <seealso cref="XElement.SetValue"/>
/// </summary>
/// <param name="name">
/// The name of the attribute whose value to change.
/// </param>
/// <param name="value">
/// The value to assign to the attribute. The attribute is deleted if the value is null.
/// Otherwise, the value is converted to its string representation and assigned to the
/// <see cref="Value"/> property of the attribute.
/// </param>
/// <exception cref="ArgumentException">
/// Thrown if the value is an instance of <see cref="XObject"/>.
/// </exception>
SetAttributeValue(name:XName, value:any):void
{
	var a: XAttribute = Attribute(name);
	if(value == null)
	{
		if (a != null) RemoveAttribute(a);
	}
	else
	{
		if(a != null)
		{
			a.Value = GetStringValue(value);
		}
		else
		{
			AppendAttribute(new XAttribute(name, value));
		}
	}
}

/// <summary>
/// Sets the value of a child element. The value is assigned to the first child element
/// with the given name. If no child element with the given name exists, a new child
/// element is added. If the value is null, the first child element with the given name,
/// if any, is deleted.
/// <seealso cref="XAttribute.SetValue"/>
/// <seealso cref="XElement.SetAttributeValue"/>
/// <seealso cref="XElement.SetValue"/>
/// </summary>
/// <param name="name">
/// The name of the child element whose value to change.
/// </param>
/// <param name="value">
/// The value to assign to the child element. The child element is deleted if the value
/// is null. Otherwise, the value is converted to its string representation and assigned
/// to the <see cref="Value"/> property of the child element.
/// </param>
/// <exception cref="ArgumentException">
/// Thrown if the value is an instance of <see cref="XObject"/>.
/// </exception>
SetElementValue(name:XName, value:any):void
{
	var e: XElement = Element(name);
	if(value == null)
	{
		if (e != null) RemoveNode(e);
	}
	else
	{
		if(e != null)
		{
			e.Value = GetStringValue(value);
		}
		else
		{
			AddNode(new XElement(name, GetStringValue(value)));
		}
	}
}

/// <summary>
/// Sets the value of this element.
/// <seealso cref="XAttribute.SetValue"/>
/// <seealso cref="XElement.SetAttributeValue"/>
/// <seealso cref="XElement.SetElementValue"/>
/// </summary>
/// <param name="value">
/// The value to assign to this element. The value is converted to its string representation
/// and assigned to the <see cref="Value"/> property.
/// </param>
/// <exception cref="ArgumentNullException">
/// Thrown if the specified value is null.
/// </exception>
SetValue(value:any):void
{
	if(value == null) throw 'ArgumentNullException("value")';
	Value = GetStringValue(value);
}

/// <summary>
/// Write this <see cref="XElement"/> to the passed in <see cref="XmlTextWriter"/>.
/// </summary>
/// <param name="writer">
/// The <see cref="XmlTextWriter"/> to write this <see cref="XElement"/> to.
/// </param>
WriteTo(writer:XmlWriter):void
{
	if(writer == null) throw 'ArgumentNullException("writer")';
	new ElementWriter(writer).WriteElement(this);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to a <see cref="string"/>.
/// </summary>
/// <remarks>
/// If the <see cref="XElement"/> is a subtre (an <see cref="XElement"/>
/// that has <see cref="XElement"/> children.  The concatenated string
/// value of all of the <see cref="XElement"/>'s text and descendants
/// text is returned.
/// </remarks>
/// <param name="element">
/// The <see cref="XElement"/> to cast to a string.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="string"/>.
/// </returns>
		public static explicit operator string(element:XElement)
{
	if (element == null) return null;
	return element.Value;
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to a <see cref="boolean"/>.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="boolean"/>.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="boolean"/>.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the element does not contain a valid boolean value.
/// </exception>
/// <exception cref="ArgumentNullException">
/// Thrown if the specified element is null.
/// </exception>


		public static explicit operator boolean(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToBoolean(element.Value.ToLower(CultureInfo.InvariantCulture));
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to a <see cref="boolean"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="boolean"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="boolean"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the element does not contain a valid boolean value.
/// </exception>


		public static explicit operator boolean? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToBoolean(element.Value.ToLower(CultureInfo.InvariantCulture));
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to an <see cref="number/*int*/"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="number/*int*/"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="number/*int*/"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the element does not contain a valid integer value.
		/// </exception>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified element is null.
		/// </exception>
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator number/*int*/(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToInt32(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="number/*int*/"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="number/*int*/"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="number/*int*/"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid integer value.
/// </exception>


		public static explicit operator number/*int*/ ? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToInt32(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to an <see cref="uint"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="uint"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="uint"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid unsigned integer value.
		/// </exception>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified element is null.
		/// </exception>
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator uint(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToUInt32(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="uint"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="uint"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="uint"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid unsigned integer value.
/// </exception>


		public static explicit operator uint? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToUInt32(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="long"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="long"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="long"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the element does not contain a valid long integer value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator long(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToInt64(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to a <see cref="long"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="long"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="long"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid long integer value.
/// </exception>


		public static explicit operator long? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToInt64(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to an <see cref="ulong"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="ulong"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="ulong"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid unsigned long integer value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator ulong(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToUInt64(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="ulong"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="ulong"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="ulong"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid unsigned long integer value.
/// </exception>


		public static explicit operator ulong? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToUInt64(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="float"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="float"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="float"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid float value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator float(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToSingle(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="float"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="float"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="float"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid float value.
/// </exception>


		public static explicit operator float? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToSingle(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="double"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="double"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="double"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid double value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator double(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToDouble(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="double"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="double"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="double"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid double value.
/// </exception>


		public static explicit operator double? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToDouble(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="decimal"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="decimal"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="decimal"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid decimal value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>        
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator decimal(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToDecimal(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="decimal"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="decimal"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="decimal"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid decimal value.
/// </exception>


		public static explicit operator decimal? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToDecimal(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="DateTime"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="DateTime"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="DateTime"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid <see cref="DateTime"/> value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>        
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator DateTime(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return DateTime.Parse(element.Value, CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.RoundtripKind);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="DateTime"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="DateTime"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="DateTime"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid <see cref="DateTime"/> value.
/// </exception>


		public static explicit operator DateTime? (element: XElement)
		{
	if (element == null) return null;
	return DateTime.Parse(element.Value, CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.RoundtripKind);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="DateTimeOffset"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="DateTimeOffset"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="DateTimeOffset"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid <see cref="DateTimeOffset"/> value.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>        
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator DateTimeOffset(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToDateTimeOffset(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="DateTimeOffset"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="DateTimeOffset"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="DateTimeOffset"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid <see cref="DateTimeOffset"/> value.
/// </exception>


		public static explicit operator DateTimeOffset? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToDateTimeOffset(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="TimeSpan"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="TimeSpan"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="TimeSpan"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid <see cref="TimeSpan"/> value.
		/// </exception>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified element is null.
		/// </exception>
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator TimeSpan(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToTimeSpan(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="TimeSpan"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="TimeSpan"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="TimeSpan"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid <see cref="TimeSpan"/> value.
/// </exception>


		public static explicit operator TimeSpan? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToTimeSpan(element.Value);
}

		/// <summary>
		/// Cast the value of this <see cref="XElement"/> to a <see cref="Guid"/>.
		/// </summary>
		/// <param name="element">
		/// The <see cref="XElement"/> to cast to <see cref="Guid"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XElement"/> as a <see cref="Guid"/>.
		/// </returns>
		/// <exception cref="System.FormatException">
		/// Thrown if the specified element does not contain a valid guid.
		/// </exception>
		/// <exception cref="InvalidOperationException">
		/// Thrown if the specified element is null.
		/// </exception>
		[CLSCompliant(false)]
	[SuppressMessage("Microsoft.Usage", "CA2225:OperatorOverloadsHaveNamedAlternates", Justification = "Operator marked with CLSCompliant(false).")]
		public static explicit operator Guid(element:XElement)
{
	if (element == null) throw 'ArgumentNullException("element")';
	return XmlConvert.ToGuid(element.Value);
}

/// <summary>
/// Cast the value of this <see cref="XElement"/> to an <see cref="Guid"/>?.
/// </summary>
/// <param name="element">
/// The <see cref="XElement"/> to cast to <see cref="Guid"/>?.
/// </param>
/// <returns>
/// The content of this <see cref="XElement"/> as a <see cref="Guid"/>?.
/// </returns>
/// <exception cref="System.FormatException">
/// Thrown if the specified element does not contain a valid guid.
/// </exception>


		public static explicit operator Guid? (element: XElement)
		{
	if (element == null) return null;
	return XmlConvert.ToGuid(element.Value);
}

		/// <summary>
		/// This method is obsolete for the IXmlSerializable contract.
		/// </summary>
		XmlSchema IXmlSerializable.GetSchema()
{
	return null;
}

/// <summary>
/// Generates a <see cref="XElement"/> from its XML respresentation.
/// </summary>
/// <param name="reader">
/// The <see cref="XmlReader"/> stream from which the <see cref="XElement"/>
/// is deserialized.
/// </param>
void IXmlSerializable.ReadXml(reader:XmlReader)
{
	if (reader == null) throw 'ArgumentNullException("reader")';
	if (parent != null || annotations != null || content != null || lastAttr != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_DeserializeInstance))';
	if (reader.MoveToContent() != XmlNodeType.Element) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedNodeType, XmlNodeType.Element, reader.NodeType))';
	ReadElementFrom(reader, LoadOptions.None);
}

/// <summary>
/// Converts a <see cref="XElement"/> into its XML representation.
/// </summary>
/// <param name="writer">
/// The <see cref="XmlWriter"/> stream to which the <see cref="XElement"/>
/// is serialized.
/// </param>
void IXmlSerializable.WriteXml(writer:XmlWriter)
{
	WriteTo(writer);
}

	/*internal*/ void _addAttribute(a:XAttribute)
{
	if (Attribute(a.Name) != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_DuplicateAttribute))';
	if (a.parent != null) a = new XAttribute(a);
	AppendAttribute(a);
}

	/*internal*/ void _addAttributeSkipNotify(a:XAttribute)
{
	if (Attribute(a.Name) != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_DuplicateAttribute))';
	if (a.parent != null) a = new XAttribute(a);
	AppendAttributeSkipNotify(a);
}

	/*internal*/ void AppendAttribute(a:XAttribute)
{
	var notify: boolean = NotifyChanging(a, XObjectChangeEventArgs.Add);
	if (a.parent != null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
	AppendAttributeSkipNotify(a);
	if (notify) NotifyChanged(a, XObjectChangeEventArgs.Add);
}

	/*internal*/ void AppendAttributeSkipNotify(a:XAttribute)
{
	a.parent = this;
	if (lastAttr == null)
	{
		a.next = a;
	}
	else
	{
		a.next = lastAttr.next;
		lastAttr.next = a;
	}
	lastAttr = a;
}

private AttributesEqual(e:XElement):boolean
{
	var a1: XAttribute = lastAttr;
	var a2: XAttribute = e.lastAttr;
	if (a1 != null && a2 != null)
	{
		do
		{
			a1 = a1.next;
			a2 = a2.next;
			if (a1.name != a2.name || a1.value != a2.value) return false;
		} while (a1 != lastAttr);
		return a2 == e.lastAttr;
	}
	return a1 == null && a2 == null;
}

	/*internal*/ XNode CloneNode()
{
	return new XElement(this);
}

	/*internal*/ boolean DeepEquals(node:XNode)
{
	var e: XElement = node as XElement;
	return e != null && name == e.name && ContentsEqual(e) && AttributesEqual(e);
}

IEnumerable < XAttribute > GetAttributes(name:XName)
{
	var a: XAttribute = lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			if (name == null || a.name == name) yield return a;
		} while (a.parent == this && a != lastAttr);
	}
}

private GetNamespaceOfPrefixInScope(prefix:string, outOfScope:XElement):string
{
	var e: XElement = this;
	while (e != outOfScope)
	{
		var a: XAttribute = e.lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				if (a.IsNamespaceDeclaration && a.Name.LocalName == prefix) return a.Value;
			}
			while (a != e.lastAttr);
		}
		e = e.parent as XElement;
	}
	return null;
}

	/*internal*/ number/*int*/ GetDeepHashCode()
{
	var h: number/*int*/ = name.GetHashCode();
	h ^= ContentsHashCode();
	var a: XAttribute = lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			h ^= a.GetDeepHashCode();
		} while (a != lastAttr);
	}
	return h;
}

private ReadElementFrom(r:XmlReader, o:LoadOptions):void
{
	if(r.ReadState != ReadState.Interactive) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedInteractive))';
	name = XNamespace.Get(r.NamespaceURI).GetName(r.LocalName);
	if((o & LoadOptions.SetBaseUri) != 0)
{
	var baseUri: string = r.BaseURI;
	if (baseUri != null && baseUri.length != 0)
	{
		SetBaseUri(baseUri);
	}
}
var li: IXmlLineInfo = null;
if ((o & LoadOptions.SetLineInfo) != 0)
{
	li = r as IXmlLineInfo;
	if (li != null && li.HasLineInfo())
	{
		SetLineInfo(li.LineNumber, li.LinePosition);
	}
}
if (r.MoveToFirstAttribute())
{
	do
	{
		var a: XAttribute = new XAttribute(XNamespace.Get(r.Prefix.length == 0 ? string.Empty : r.NamespaceURI).GetName(r.LocalName), r.Value);
		if (li != null && li.HasLineInfo())
		{
			a.SetLineInfo(li.LineNumber, li.LinePosition);
		}
		AppendAttributeSkipNotify(a);
	} while (r.MoveToNextAttribute());
	r.MoveToElement();
}
if (!r.IsEmptyElement)
{
	r.Read();
	ReadContentFrom(r, o);
}
r.Read();
}

	/*internal*/ void RemoveAttribute(a:XAttribute)
{
	var notify: boolean = NotifyChanging(a, XObjectChangeEventArgs.Remove);
	if (a.parent != this) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExternalCode))';
	var p: XAttribute = lastAttr, n;
	while ((n = p.next) != a) p = n;
	if (p == a)
	{
		lastAttr = null;
	}
	else
	{
		if (lastAttr == a) lastAttr = p;
		p.next = a.next;
	}
	a.parent = null;
	a.next = null;
	if (notify) NotifyChanged(a, XObjectChangeEventArgs.Remove);
}

private RemoveAttributesSkipNotify():void
{
	if(lastAttr != null)
	{
		var a: XAttribute = lastAttr;
		do
		{
			var next: XAttribute = a.next;
			a.parent = null;
			a.next = null;
			a = next;
		} while (a != lastAttr);
		lastAttr = null;
	}
}

	/*internal*/ void SetEndElementLineInfo(lineNumber:number/*int*/, linePosition:number/*int*/)
{
	AddAnnotation(new LineInfoEndElementAnnotation(lineNumber, linePosition));
}

	/*internal*/ void _validateNode(node:XNode, previous:XNode)
{
	if (node is XDocument) throw 'ArgumentException(Res.GetString(Res.Argument_AddNode, XmlNodeType.Document))';
	if (node is XDocumentType) throw 'ArgumentException(Res.GetString(Res.Argument_AddNode, XmlNodeType.DocumentType))';
}
}

/*internal*/ struct ElementWriter
{
	private writer: XmlWriter;
private resolver: NamespaceResolver;

		public ElementWriter(writer:XmlWriter)
	{
		this.writer = writer;
		this.resolver = new NamespaceResolver();
	}

	WriteElement(e:XElement):void
	{
		PushAncestors(e);
		var root: XElement = e;
		var n: XNode = e;
		while(true)
	{
		e = n as XElement;
		if (e != null)
		{
			WriteStartElement(e);
			if (e._content == null)
			{
				WriteEndElement();
			}
			else
			{
				var s: string = e._content as string;
				if (s != null)
				{
					writer.WriteString(s);
					WriteFullEndElement();
				}
				else
				{
					n = (<XNode>e._content).next;
					continue;
				}
			}
		}
		else
		{
			n.WriteTo(writer);
		}
		while (n != root && n == n.parent._content)
		{
			n = n.parent;
			WriteFullEndElement();

		}
		if (n == root) break;
		n = n.next;
	}
}

private GetPrefixOfNamespace(ns:XNamespace, allowDefaultNamespace:boolean):string
{
	var namespaceName: string = ns.NamespaceName;
	if (namespaceName.length == 0) return string.Empty;
	var prefix: string = resolver.GetPrefixOfNamespace(ns, allowDefaultNamespace);
	if (prefix != null) return prefix;
	if (<any>namespaceName == <any>XNamespace.xmlPrefixNamespace) return "xml";
	if (<any>namespaceName == <any>XNamespace.xmlnsPrefixNamespace) return "xmlns";
	return null;
}

private PushAncestors(e:XElement):void
{
	while(true)
	{
	e = e.parent as XElement;
	if (e == null) break;
	var a: XAttribute = e.lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			if (a.IsNamespaceDeclaration)
			{
				resolver.AddFirst(a.Name.NamespaceName.length == 0 ? string.Empty : a.Name.LocalName, XNamespace.Get(a.Value));
			}
		} while (a != e.lastAttr);
	}
}
}

private PushElement(e:XElement):void
{
	resolver.PushScope();
	var a: XAttribute = e.lastAttr;
	if(a != null)
	{
		do
		{
			a = a.next;
			if (a.IsNamespaceDeclaration)
			{
				resolver.Add(a.Name.NamespaceName.length == 0 ? string.Empty : a.Name.LocalName, XNamespace.Get(a.Value));
			}
		} while (a != e.lastAttr);
	}
}

private WriteEndElement():void
{
	writer.WriteEndElement();
	resolver.PopScope();
}

private WriteFullEndElement():void
{
	writer.WriteFullEndElement();
	resolver.PopScope();
}

private WriteStartElement(e:XElement):void
{
	PushElement(e);
	var ns: XNamespace = e.Name.Namespace;
	writer.WriteStartElement(GetPrefixOfNamespace(ns, true), e.Name.LocalName, ns.NamespaceName);
	var a: XAttribute = e.lastAttr;
	if(a != null)
	{
		do
		{
			a = a.next;
			ns = a.Name.Namespace;
			var localName: string = a.Name.LocalName;
			var namespaceName: string = ns.NamespaceName;
			writer.WriteAttributeString(GetPrefixOfNamespace(ns, false), localName, namespaceName.length == 0 && localName == "xmlns" ? XNamespace.xmlnsPrefixNamespace : namespaceName, a.Value);
		} while (a != e.lastAttr);
	}
}
}

/*internal*/ struct NamespaceResolver
{
		class NamespaceDeclaration
{
			public string prefix;
			public XNamespace ns;
			public number/*int*/ scope;
			public NamespaceDeclaration prev;
		}

number/*int*/ scope;
NamespaceDeclaration declaration;
NamespaceDeclaration rover;

PushScope():void
{
	scope++;
}

PopScope():void
{
	var d: NamespaceDeclaration = declaration;
	if(d != null)
	{
		do
		{
			d = d.prev;
			if (d.scope != scope) break;
			if (d == declaration)
			{
				declaration = null;
			}
			else
			{
				declaration.prev = d.prev;
			}
			rover = null;
		} while (d != declaration && declaration != null);
	}
	scope--;
}

Add(prefix:string, ns:XNamespace):void
{
	var d: NamespaceDeclaration = new NamespaceDeclaration();
	d.prefix = prefix;
	d.ns = ns;
	d.scope = scope;
	if(declaration == null)
	{
		declaration = d;
	}
	else
	{
		d.prev = declaration.prev;
	}
	declaration.prev = d;
	rover = null;
}

AddFirst(prefix:string, ns:XNamespace):void
{
	var d: NamespaceDeclaration = new NamespaceDeclaration();
	d.prefix = prefix;
	d.ns = ns;
	d.scope = scope;
	if(declaration == null)
	{
		d.prev = d;
	}
	else
	{
		d.prev = declaration.prev;
		declaration.prev = d;
	}
	declaration = d;
	rover = null;
}

// Only elements allow default namespace declarations. The rover 
// caches the last namespace declaration used by an element.
GetPrefixOfNamespace(ns:XNamespace, allowDefaultNamespace:boolean):string
{
	if (rover != null && rover.ns == ns && (allowDefaultNamespace || rover.prefix.length > 0)) return rover.prefix;
	var d: NamespaceDeclaration = declaration;
	if (d != null)
	{
		do
		{
			d = d.prev;
			if (d.ns == ns)
			{
				var x: NamespaceDeclaration = declaration.prev;
				while (x != d && x.prefix != d.prefix)
				{
					x = x.prev;
				}
				if (x == d)
				{
					if (allowDefaultNamespace)
					{
						rover = d;
						return d.prefix;
					}
					else if (d.prefix.length > 0)
					{
						return d.prefix;
					}
				}
			}
		} while (d != declaration);
	}
	return null;
}
	}

/// <summary>
/// Specifies a set of options for Load(). 
/// </summary>

public enum LoadOptions
{
	/// <summary>Default options.</summary>
	None = 0x00000000,

	/// <summary>Preserve whitespace.</summary>
	[SuppressMessage("Microsoft.Naming", "CA1702:CompoundWordsShouldBeCasedCorrectly", Justification = "Back-compat with System.Xml.")]
		PreserveWhitespace = 0x00000001,

	/// <summary>Set the BaseUri property.</summary>
	SetBaseUri = 0x00000002,

	/// <summary>Set the IXmlLineInfo.</summary>
	SetLineInfo = 0x00000004,
}

/// <summary>
/// Specifies a set of options for Save().
/// </summary>

public enum SaveOptions
{
	/// <summary>Default options.</summary>
	None = 0x00000000,

	/// <summary>Disable formatting.</summary>
	DisableFormatting = 0x00000001,

	/// <summary>Remove duplicate namespace declarations.</summary>
	OmitDuplicateNamespaces = 0x00000002,
}

/// <summary>
/// Specifies a set of options for CreateReader().
/// </summary>

public enum ReaderOptions
{
	/// <summary>Default options.</summary>
	None = 0x00000000,

	/// <summary>Remove duplicate namespace declarations.</summary>
	OmitDuplicateNamespaces = 0x00000001,
}

/// <summary>
/// Represents an XML document.
/// </summary>
/// <remarks>
/// An <see cref="XDocument"/> can contain:
/// <list>
///   <item>
///   A Document Type Declaration (DTD), see <see cref="XDocumentType"/>
///   </item>
///   <item>One root element.</item>
///   <item>Zero or more <see cref="XComment"/> objects.</item>
///   <item>Zero or more <see cref="XProcessingInstruction"/> objects.</item>
/// </list>
/// </remarks>
export classXDocument extends XContainer
{
	private declaration: XDeclaration;

		///<overloads>
		/// Initializes a new instance of the <see cref="XDocument"/> class.
		/// Overloaded constructors are provided for creating a new empty 
		/// <see cref="XDocument"/>, creating an <see cref="XDocument"/> with
		/// a parameter list of initial content, and as a copy of another
		/// <see cref="XDocument"/> object.
		/// </overloads>
		/// <summary>
		/// Initializes a new instance of the <see cref="XDocument"/> class.
		/// </summary>
		public XDocument()
	{
	}

		/// <summary>
		/// Initializes a new instance of the <see cref="XDocument"/> class with the specified content.
		/// </summary>
		/// <param name="content">
		/// A parameter list of content objects to add to this document.
		/// </param>
		/// <remarks>
		/// Valid content includes:
		/// <list>
		/// <item>Zero or one <see cref="XDocumentType"/> objects</item>
		/// <item>Zero or one elements</item>
		/// <item>Zero or more comments</item>
		/// <item>Zero or more processing instructions</item>
		/// </list>
		/// See XContainer.Add(content:any) for details about the content that can be added
		/// using this method.
		/// </remarks>
		public XDocument(..._content:any[])
			: this()
	{
		AddContentSkipNotify(content);
	}

		/// <summary>
		/// Initializes a new instance of the <see cref="XDocument"/> class
		/// with the specifed <see cref="XDeclaration"/> and content.
		/// </summary>
		/// <param name="declaration">
		/// The XML declaration for the document.
		/// </param>
		/// <param name="content">
		/// The contents of the document.
		/// </param>
		/// <remarks>
		/// Valid content includes:
		/// <list>
		/// <item>Zero or one <see cref="XDocumentType"/> objects</item>
		/// <item>Zero or one elements</item>
		/// <item>Zero or more comments</item>
		/// <item>Zero or more processing instructions</item>
		/// <item></item>
		/// </list>
		/// See XContainer.Add(content:any) for details about the content that can be added
		/// using this method.
		/// </remarks>
		public XDocument(declaration:XDeclaration, ..._content:any[])
			: this(content)
	{
		this.declaration = declaration;
	}

		/// <summary>
		/// Initializes a new instance of the <see cref="XDocument"/> class from an
		/// existing XDocument object.
		/// </summary>
		/// <param name="other">
		/// The <see cref="XDocument"/> object that will be copied.
		/// </param>
		public XDocument(other:XDocument)
			: base(other)
	{
		if (other.declaration != null)
		{
			declaration = new XDeclaration(other.declaration);
		}
	}

	/// <summary>
	/// Gets the XML declaration for this document.
	/// </summary>
				get Declaration():XDeclaration
	{
		return declaration;
		set { declaration = value; }
	}

		/// <summary>
		/// Gets the Document Type Definition (DTD) for this document.
		/// </summary>
		public XDocumentType DocumentType
	{
		get
		{
			return GetFirstNode<XDocumentType>();
		}
	}

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.Document.
		/// </remarks>
		public XmlNodeType NodeType
	{
		get
		{
			return XmlNodeType.Document;
		}
	}

		/// <summary>
		/// Gets the root element of the XML Tree for this document.
		/// </summary>
		public XElement Root
	{
		get
		{
			return GetFirstNode<XElement>();
		}
	}

/// <overloads>
/// The Load method provides multiple strategies for creating a new 
/// <see cref="XDocument"/> and initializing it from a data source containing
/// raw XML.  Load from a file (passing in a URI to the file), a
/// <see cref="Stream"/>, a <see cref="TextReader"/>, or an
/// <see cref="XmlReader"/>.  Note:  Use <see cref="XDocument.Parse(string)"/>
/// to create an <see cref="XDocument"/> from a string containing XML.
/// <seealso cref="XDocument.Parse(string)"/>
/// </overloads>
/// <summary>
/// Create a new <see cref="XDocument"/> based on the contents of the file 
/// referenced by the URI parameter passed in.  Note: Use 
/// <see cref="XDocument.Parse(string)"/> to create an <see cref="XDocument"/> from
/// a string containing XML.
/// <seealso cref="XmlReader.Create(string)"/>
/// <seealso cref="XDocument.Parse(string)"/>
/// </summary>
/// <remarks>
/// This method uses the <see cref="XmlReader.Create(string)"/> method to create
/// an <see cref="XmlReader"/> to read the raw XML into the underlying
/// XML tree.
/// </remarks>
/// <param name="uri">
/// A URI string referencing the file to load into a new <see cref="XDocument"/>.
/// </param>
/// <returns>
/// An <see cref="XDocument"/> initialized with the contents of the file referenced
/// in the passed in uri parameter.
/// </returns>



	#endif

		static Load(uri:string):XDocument
	{
		return Load(uri, LoadOptions.None);
	}

/// <summary>
/// Create a new <see cref="XDocument"/> based on the contents of the file 
/// referenced by the URI parameter passed in.  Optionally, whitespace can be preserved.  
/// <see cref="XmlReader.Create(string)"/>
/// </summary>
/// <remarks>
/// This method uses the <see cref="XmlReader.Create(string)"/> method to create
/// an <see cref="XmlReader"/> to read the raw XML into an underlying
/// XML tree.  If LoadOptions.PreserveWhitespace is enabled then
/// the <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
/// is set to false.
/// </remarks>
/// <param name="uri">
/// A string representing the URI of the file to be loaded into a new <see cref="XDocument"/>.
/// </param>
/// <param name="options">
/// A set of <see cref="LoadOptions"/>.
/// </param>
/// <returns>
/// An <see cref="XDocument"/> initialized with the contents of the file referenced
/// in the passed uri parameter.  If LoadOptions.PreserveWhitespace is enabled then
/// all whitespace will be preserved.
/// </returns>


		static Load(uri:string, options:LoadOptions):XDocument
	{
		var rs: XmlReaderSettings = GetXmlReaderSettings(options);
		using(var r: XmlReader = XmlReader.Create(uri, rs))
		{
			return Load(r, options);
		}
	}

		/// <summary>
		/// Create a new <see cref="XDocument"/> and initialize its underlying XML tree using
		/// the passed <see cref="Stream"/> parameter.  
		/// </summary>
		/// <param name="stream">
		/// A <see cref="Stream"/> containing the raw XML to read into the newly
		/// created <see cref="XDocument"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XDocument"/> containing the contents of the passed in
		/// <see cref="Stream"/>.
		/// </returns>
		static Load(stream:Stream):XDocument
	{
		return Load(stream, LoadOptions.None);
	}

		/// <summary>
		/// Create a new <see cref="XDocument"/> and initialize its underlying XML tree using
		/// the passed <see cref="Stream"/> parameter.  Optionally whitespace handling
		/// can be preserved.
		/// </summary>
		/// <remarks>
		/// If LoadOptions.PreserveWhitespace is enabled then
		/// the underlying <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
		/// is set to false.
		/// </remarks>
		/// <param name="stream">
		/// A <see cref="Stream"/> containing the raw XML to read into the newly
		/// created <see cref="XDocument"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XDocument"/> containing the contents of the passed in
		/// <see cref="Stream"/>.
		/// </returns>
		static Load(stream:Stream, options:LoadOptions):XDocument
	{
		var rs: XmlReaderSettings = GetXmlReaderSettings(options);
		using(var r: XmlReader = XmlReader.Create(stream, rs))
		{
			return Load(r, options);
		}
	}

		/// <summary>
		/// Create a new <see cref="XDocument"/> and initialize its underlying XML tree using
		/// the passed <see cref="TextReader"/> parameter.  
		/// </summary>
		/// <param name="textReader">
		/// A <see cref="TextReader"/> containing the raw XML to read into the newly
		/// created <see cref="XDocument"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XDocument"/> containing the contents of the passed in
		/// <see cref="TextReader"/>.
		/// </returns>
		static Load(textReader:TextReader):XDocument
	{
		return Load(textReader, LoadOptions.None);
	}

		/// <summary>
		/// Create a new <see cref="XDocument"/> and initialize its underlying XML tree using
		/// the passed <see cref="TextReader"/> parameter.  Optionally whitespace handling
		/// can be preserved.
		/// </summary>
		/// <remarks>
		/// If LoadOptions.PreserveWhitespace is enabled then
		/// the <see cref="XmlReaderSettings"/> property <see cref="XmlReaderSettings.IgnoreWhitespace"/>
		/// is set to false.
		/// </remarks>
		/// <param name="textReader">
		/// A <see cref="TextReader"/> containing the raw XML to read into the newly
		/// created <see cref="XDocument"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XDocument"/> containing the contents of the passed in
		/// <see cref="TextReader"/>.
		/// </returns>
		static Load(textReader:TextReader, options:LoadOptions):XDocument
	{
		var rs: XmlReaderSettings = GetXmlReaderSettings(options);
		using(var r: XmlReader = XmlReader.Create(textReader, rs))
		{
			return Load(r, options);
		}
	}

		/// <summary>
		/// Create a new <see cref="XDocument"/> containing the contents of the
		/// passed in <see cref="XmlReader"/>.
		/// </summary>
		/// <param name="reader">
		/// An <see cref="XmlReader"/> containing the XML to be read into the new
		/// <see cref="XDocument"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XDocument"/> containing the contents of the passed
		/// in <see cref="XmlReader"/>.
		/// </returns>
		static Load(reader:XmlReader):XDocument
	{
		return Load(reader, LoadOptions.None);
	}

		/// <summary>
		/// Create a new <see cref="XDocument"/> containing the contents of the
		/// passed in <see cref="XmlReader"/>.
		/// </summary>
		/// <param name="reader">
		/// An <see cref="XmlReader"/> containing the XML to be read into the new
		/// <see cref="XDocument"/>.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// A new <see cref="XDocument"/> containing the contents of the passed
		/// in <see cref="XmlReader"/>.
		/// </returns>
		static Load(reader:XmlReader, options:LoadOptions):XDocument
	{
		if (reader == null) throw 'ArgumentNullException("reader")';
		if (reader.ReadState == ReadState.Initial) reader.Read();
		var d: XDocument = new XDocument();
		if ((options & LoadOptions.SetBaseUri) != 0)
		{
			var baseUri: string = reader.BaseURI;
			if (baseUri != null && baseUri.length != 0)
			{
				d.SetBaseUri(baseUri);
			}
		}
		if ((options & LoadOptions.SetLineInfo) != 0)
		{
			var li: IXmlLineInfo = reader as IXmlLineInfo;
			if (li != null && li.HasLineInfo())
			{
				d.SetLineInfo(li.LineNumber, li.LinePosition);
			}
		}
		if (reader.NodeType == XmlNodeType.XmlDeclaration)
		{
			d.Declaration = new XDeclaration(reader);
		}
		d.ReadContentFrom(reader, options);
		if (!reader.EOF) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_ExpectedEndOfFile))';
		if (d.Root == null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_MissingRoot))';
		return d;
	}

		/// <overloads>
		/// Create a new <see cref="XDocument"/> from a string containing
		/// XML.  Optionally whitespace can be preserved.
		/// </overloads>
		/// <summary>
		/// Create a new <see cref="XDocument"/> from a string containing
		/// XML.
		/// </summary>
		/// <param name="text">
		/// A string containing XML.
		/// </param>
		/// <returns>
		/// An <see cref="XDocument"/> containing an XML tree initialized from the 
		/// passed in XML string.
		/// </returns>
		static Parse(text:string):XDocument
	{
		return Parse(text, LoadOptions.None);
	}

		/// <summary>
		/// Create a new <see cref="XDocument"/> from a string containing
		/// XML.  Optionally whitespace can be preserved.
		/// </summary>
		/// <remarks>
		/// This method uses <see cref="XmlReader.Create"/> method passing it a StringReader
		/// constructed from the passed in XML String.  If LoadOptions.PreserveWhitespace
		/// is enabled then <see cref="XmlReaderSettings.IgnoreWhitespace"/> is
		/// set to false.  See <see cref="XmlReaderSettings.IgnoreWhitespace"/>
		/// for more information on whitespace handling.
		/// </remarks>
		/// <param name="text">
		/// A string containing XML.
		/// </param>
		/// <param name="options">
		/// A set of <see cref="LoadOptions"/>.
		/// </param>
		/// <returns>
		/// An <see cref="XDocument"/> containing an XML tree initialized from the 
		/// passed in XML string.
		/// </returns>
		static Parse(text:string, options:LoadOptions):XDocument
	{
		using(var sr: StringReader = new StringReader(text))
		{
			XmlReaderSettings rs = GetXmlReaderSettings(options);
			using(var r: XmlReader = XmlReader.Create(sr, rs))
			{
				return Load(r, options);
			}
		}
	}

	///<overloads>
	/// Outputs this <see cref="XDocument"/>'s underlying XML tree.  The output can
	/// be saved to a file, a <see cref="Stream"/>, a <see cref="TextWriter"/>,
	/// or an <see cref="XmlWriter"/>.  Optionally whitespace can be preserved.  
	/// </overloads>
	/// <summary>
	/// Output this <see cref="XDocument"/> to a file.
	/// </summary>
	/// <remarks>
	/// The format will be indented by default.  If you want
	/// no indenting then use the SaveOptions version of Save (see
	/// <see cref="XDocument.Save(string, SaveOptions)"/>) enabling 
	/// SaveOptions.DisableFormatting.
	/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
	/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
	/// </remarks>
	/// <param name="fileName">
	/// The name of the file to output the XML to.
	/// </param>

	Save(fileName:string):void
	{
		Save(fileName, GetSaveOptionsFromAnnotations());
	}

	/// <summary>
	/// Output this <see cref="XDocument"/> to a file.
	/// </summary>
	/// <param name="fileName">
	/// The name of the file to output the XML to.  
	/// </param>
	/// <param name="options">
	/// If SaveOptions.DisableFormatting is enabled the output is not indented.
	/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
	/// </param>
	Save(fileName:string, options:SaveOptions):void
	{
		var ws: XmlWriterSettings = GetXmlWriterSettings(options);
		if(declaration != null && !string.IsNullOrEmpty(declaration.Encoding))
		{
			try
			{
				ws.Encoding = Encoding.GetEncoding(declaration.Encoding);
			}
			catch (ArgumentException)
			{
			}
		}
	using(var w: XmlWriter = XmlWriter.Create(fileName, ws))
	{
		Save(w);
	}
}

/// <summary>
/// Output this <see cref="XDocument"/> to the passed in <see cref="Stream"/>.
/// </summary>
/// <remarks>
/// The format will be indented by default.  If you want
/// no indenting then use the SaveOptions version of Save (see
/// <see cref="XDocument.Save(Stream, SaveOptions)"/>) enabling
/// SaveOptions.DisableFormatting
/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </remarks>
/// <param name="stream">
/// The <see cref="Stream"/> to output this <see cref="XDocument"/> to.
/// </param>
Save(stream:Stream):void
{
	Save(stream, GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Output this <see cref="XDocument"/> to a <see cref="Stream"/>.
/// </summary>
/// <param name="stream">
/// The <see cref="Stream"/> to output the XML to.  
/// </param>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
Save(stream:Stream, options:SaveOptions):void
{
	var ws: XmlWriterSettings = GetXmlWriterSettings(options);
	if(declaration != null && !string.IsNullOrEmpty(declaration.Encoding))
	{
		try
		{
			ws.Encoding = Encoding.GetEncoding(declaration.Encoding);
		}
		catch (ArgumentException)
		{
		}
	}
	using(var w: XmlWriter = XmlWriter.Create(stream, ws))
	{
	Save(w);
}
}

/// <summary>
/// Output this <see cref="XDocument"/> to the passed in <see cref="TextWriter"/>.
/// </summary>
/// <remarks>
/// The format will be indented by default.  If you want
/// no indenting then use the SaveOptions version of Save (see
/// <see cref="XDocument.Save(TextWriter, SaveOptions)"/>) enabling
/// SaveOptions.DisableFormatting
/// There is also an option SaveOptions.OmitDuplicateNamespaces for removing duplicate namespace declarations. 
/// Or instead use the SaveOptions as an annotation on this node or its ancestors, then this method will use those options.
/// </remarks>
/// <param name="textWriter">
/// The <see cref="TextWriter"/> to output this <see cref="XDocument"/> to.
/// </param>
Save(textWriter:TextWriter):void
{
	Save(textWriter, GetSaveOptionsFromAnnotations());
}

/// <summary>
/// Output this <see cref="XDocument"/> to a <see cref="TextWriter"/>.
/// </summary>
/// <param name="textWriter">
/// The <see cref="TextWriter"/> to output the XML to.  
/// </param>
/// <param name="options">
/// If SaveOptions.DisableFormatting is enabled the output is not indented.
/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
/// </param>
Save(textWriter:TextWriter, options:SaveOptions):void
{
	var ws: XmlWriterSettings = GetXmlWriterSettings(options);
	using(var w: XmlWriter = XmlWriter.Create(textWriter, ws))
	{
	Save(w);
}
}

/// <summary>
/// Output this <see cref="XDocument"/> to an <see cref="XmlWriter"/>.
/// </summary>
/// <param name="writer">
/// The <see cref="XmlWriter"/> to output the XML to.
/// </param>
Save(writer:XmlWriter):void
{
	WriteTo(writer);
}


/// <summary>
/// Output this <see cref="XDocument"/>'s underlying XML tree to the
/// passed in <see cref="XmlWriter"/>.
/// <seealso cref="XDocument.Save(XmlWriter)"/>
/// </summary>
/// <param name="writer">
/// The <see cref="XmlWriter"/> to output the content of this 
/// <see cref="XDocument"/>.
/// </param>
WriteTo(writer:XmlWriter):void
{
	if(writer == null) throw 'ArgumentNullException("writer")';
	if(declaration != null && declaration.Standalone == "yes")
	{
		writer.WriteStartDocument(true);
	}
	else if (declaration != null && declaration.Standalone == "no")
	{
		writer.WriteStartDocument(false);
	}
	else
	{
		writer.WriteStartDocument();
	}
	WriteContentTo(writer);
	writer.WriteEndDocument();
}

	/*internal*/ void _addAttribute(a:XAttribute)
{
	throw 'ArgumentException(Res.GetString(Res.Argument_AddAttribute))';
}

	/*internal*/ void _addAttributeSkipNotify(a:XAttribute)
{
	throw 'ArgumentException(Res.GetString(Res.Argument_AddAttribute))';
}

	/*internal*/ XNode CloneNode()
{
	return new XDocument(this);
}

	/*internal*/ boolean DeepEquals(node:XNode)
{
	var other: XDocument = node as XDocument;
	return other != null && ContentsEqual(other);
}

	/*internal*/ number/*int*/ GetDeepHashCode()
{
	return ContentsHashCode();
}

T GetFirstNode<T>() where T : XNode
{
	var n: XNode = content as XNode;
	if (n != null)
	{
		do
		{
			n = n.next;
			var e: T = n as T;
			if (e != null) return e;
		} while (n != content);
	}
	return null;
}

	/*internal*/ static boolean IsWhitespace(s:string)
{
	foreach(char ch in s)
	{
		if (ch != ' ' && ch != '\t' && ch != '\r' && ch != '\n') return false;
	}
	return true;
}

	/*internal*/ void _validateNode(node:XNode, previous:XNode)
{
	switch (node.NodeType)
	{
		case XmlNodeType.Text:
			_validateString((<XText>node).Value);
			break;
		case XmlNodeType.Element:
			ValidateDocument(previous, XmlNodeType.DocumentType, XmlNodeType.None);
			break;
		case XmlNodeType.DocumentType:
			ValidateDocument(previous, XmlNodeType.None, XmlNodeType.Element);
			break;
		case XmlNodeType.CDATA:
			throw 'ArgumentException(Res.GetString(Res.Argument_AddNode, XmlNodeType.CDATA))';
		case XmlNodeType.Document:
			throw 'ArgumentException(Res.GetString(Res.Argument_AddNode, XmlNodeType.Document))';
	}
}

private ValidateDocument(previous:XNode, XmlNodeType allowBefore, allowAfter:XmlNodeType):void
{
	var n: XNode = content as XNode;
	if(n != null)
	{
		if (previous == null) allowBefore = allowAfter;
		do
		{
			n = n.next;
			var nt: XmlNodeType = n.NodeType;
			if (nt == XmlNodeType.Element || nt == XmlNodeType.DocumentType)
			{
				if (nt != allowBefore) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_DocumentStructure))';
				allowBefore = XmlNodeType.None;
			}
			if (n == previous) allowBefore = allowAfter;
		} while (n != content);
	}
}

	/*internal*/ void _validateString(s:string)
{
	if (!IsWhitespace(s)) throw 'ArgumentException(Res.GetString(Res.Argument_AddNonWhitespace))';
}
}

/// <summary>
/// Represents an XML comment. 
/// </summary>
export classXComment extends XNode
{
	/*internal*/ string value;

		/// <overloads>
		/// Initializes a new instance of the <see cref="XComment"/> class.
		/// </overloads>
		/// <summary>
		/// Initializes a new instance of the <see cref="XComment"/> class with the
		/// specified string content.
		/// </summary>
		/// <param name="value">
		/// The contents of the new XComment object.
		/// </param>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified value is null.
		/// </exception>
		public XComment(value:string)
	{
		if (value == null) throw 'ArgumentNullException("value")';
		this.value = value;
	}

		/// <summary>
		/// Initializes a new comment node from an existing comment node.
		/// </summary>
		/// <param name="other">Comment node to copy from.</param>
		public XComment(other:XComment)
	{
		if (other == null) throw 'ArgumentNullException("other")';
		this.value = other.value;
	}

	/*internal*/ XComment(r:XmlReader)
	{
		value = r.Value;
		r.Read();
	}

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.Comment.
		/// </remarks>
		public XmlNodeType NodeType
	{
		get
		{
			return XmlNodeType.Comment;
		}
	}

		/// <summary>
		/// Gets or sets the string value of this comment.
		/// </summary>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified value is null.
		/// </exception>
		public string Value
	{
		get
		{
			return value;
		}
		set
		{
			if (value == null) throw 'ArgumentNullException("value")';
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Value);
			this.value = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Value);
		}
	}

	/// <summary>
	/// Write this <see cref="XComment"/> to the passed in <see cref="XmlWriter"/>.
	/// </summary>
	/// <param name="writer">
	/// The <see cref="XmlWriter"/> to write this <see cref="XComment"/> to.
	/// </param>
	WriteTo(writer:XmlWriter):void
	{
		if(writer == null) throw 'ArgumentNullException("writer")';
		writer.WriteComment(value);
	}

	/*internal*/ XNode CloneNode()
	{
		return new XComment(this);
	}

	/*internal*/ boolean DeepEquals(node:XNode)
	{
		var other: XComment = node as XComment;
		return other != null && value == other.value;
	}

	/*internal*/ number/*int*/ GetDeepHashCode()
	{
		return value.GetHashCode();
	}
}

/// <summary>
/// Represents an XML processing instruction.
/// </summary>
export classXProcessingInstruction extends XNode
{
	/*internal*/ string target;
	/*internal*/ string data;

		/// <summary>
		/// Initializes a new XML Processing Instruction from the specified target and string data.
		/// </summary>
		/// <param name="target">
		/// The target application for this <see cref="XProcessingInstruction"/>.
		/// </param>
		/// <param name="data">
		/// The string data that comprises the <see cref="XProcessingInstruction"/>.
		/// </param>
		/// <exception cref="ArgumentNullException">
		/// Thrown if either the target or data parameter are null.
		/// </exception>
		public XProcessingInstruction(target:string, data:string)
	{
		if (data == null) throw 'ArgumentNullException("data")';
		ValidateName(target);
		this.target = target;
		this.data = data;
	}

		/// <summary>
		/// Initializes a new XML processing instruction by copying its target and data 
		/// from another XML processing instruction.
		/// </summary>
		/// <param name="other">XML processing instruction to copy from.</param>
		public XProcessingInstruction(other:XProcessingInstruction)
	{
		if (other == null) throw 'ArgumentNullException("other")';
		this.target = other.target;
		this.data = other.data;
	}

	/*internal*/ XProcessingInstruction(r:XmlReader)
	{
		target = r.Name;
		data = r.Value;
		r.Read();
	}

		/// <summary>
		/// Gets or sets the string value of this processing instruction.
		/// </summary>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the value set is null.
		/// </exception>
		public string Data
	{
		get
		{
			return data;
		}
		set
		{
			if (value == null) throw 'ArgumentNullException("value")';
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Value);
			data = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Value);
		}
	}

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.ProcessingInstruction.
		/// </remarks>
		public XmlNodeType NodeType
	{
		get
		{
			return XmlNodeType.ProcessingInstruction;
		}
	}

		/// <summary>
		/// Gets or sets a string representing the target application for this processing instruction.
		/// </summary>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the value set is null.
		/// </exception>
		public string Target
	{
		get
		{
			return target;
		}
		set
		{
			ValidateName(value);
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Name);
			target = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Name);
		}
	}

	/// <summary>
	/// Writes this <see cref="XProcessingInstruction"/> to the passed in <see cref="XmlWriter"/>.
	/// </summary>
	/// <param name="writer">
	/// The <see cref="XmlWriter"/> to write this <see cref="XProcessingInstruction"/> to.
	/// </param>
	WriteTo(writer:XmlWriter):void
	{
		if(writer == null) throw 'ArgumentNullException("writer")';
		writer.WriteProcessingInstruction(target, data);
	}

	/*internal*/ XNode CloneNode()
	{
		return new XProcessingInstruction(this);
	}

	/*internal*/ boolean DeepEquals(node:XNode)
	{
		var other: XProcessingInstruction = node as XProcessingInstruction;
		return other != null && target == other.target && data == other.data;
	}

	/*internal*/ number/*int*/ GetDeepHashCode()
	{
		return target.GetHashCode() ^ data.GetHashCode();
	}

		static void ValidateName(name:string)
	{
		XmlConvert.VerifyNCName(name);
		if (string.Compare(name, "xml", StringComparison.OrdinalIgnoreCase) == 0) throw 'ArgumentException(Res.GetString(Res.Argument_InvalidPIName, name))';
	}
}

/// <summary>
/// Represents an XML declaration.
/// </summary>
/// <remarks>
/// An XML declaration is used to declare the XML version,
/// the encoding, and whether or not the XML document is standalone.
/// </remarks>
export classXDeclaration
{
		private version: string;
	string encoding;
	string standalone;

		/// <summary>
		/// Initilizes a new instance of the <see cref="XDeclaration"/> class from the
		/// specified version, encoding, and standalone properties.
		/// </summary>
		/// <param name="version">
		/// The version of the XML, usually "1.0".
		/// </param>
		/// <param name="encoding">
		/// The encoding for the XML document.
		/// </param>
		/// <param name="standalone">
		/// Specifies whether the XML is standalone or requires external entities
		/// to be resolved.
		/// </param>
		public XDeclaration(version:string, string encoding, standalone:string)
	{
		this.version = version;
		this.encoding = encoding;
		this.standalone = standalone;
	}

		/// <summary>
		/// Initializes an instance of the <see cref="XDeclaration"/> class
		/// from another <see cref="XDeclaration"/> object.
		/// </summary>
		/// <param name="other">
		/// The <see cref="XDeclaration"/> used to initialize this <see cref="XDeclaration"/> object.
		/// </param>
		public XDeclaration(other:XDeclaration)
	{
		if (other == null) throw 'ArgumentNullException("other")';
		version = other.version;
		encoding = other.encoding;
		standalone = other.standalone;
	}

/*internal*/ XDeclaration(r:XmlReader)
	{
		version = r.GetAttribute("version");
		encoding = r.GetAttribute("encoding");
		standalone = r.GetAttribute("standalone");
		r.Read();
	}

	/// <summary>
	/// Gets or sets the encoding for this document.
	/// </summary>
				get Encoding():string
	{
		return encoding;
		set { encoding = value; }
	}

	/// <summary>
	/// Gets or sets the standalone property for this document.
	/// </summary>
	/// <remarks>
	/// The valid values for standalone are "yes" or "no".
	/// </remarks>
				get Standalone():string
	{
		return standalone;
		set { standalone = value; }
	}

	/// <summary>
	/// Gets or sets the version property for this document.
	/// </summary>
	/// <remarks>
	/// The value is usually "1.0".
	/// </remarks>
				get Version():string
	{
		return version;
		set { version = value; }
	}

	/// <summary>
	/// Provides a formatted string.
	/// </summary>
	/// <returns>A formatted XML string.</returns>
	ToString():string
	{
		var sb: StringBuilder = new StringBuilder("<?xml");
		if (version != null)
		{
			sb.Append(" version=\"");
			sb.Append(version);
			sb.Append("\"");
		}
		if (encoding != null)
		{
			sb.Append(" encoding=\"");
			sb.Append(encoding);
			sb.Append("\"");
		}
		if (standalone != null)
		{
			sb.Append(" standalone=\"");
			sb.Append(standalone);
			sb.Append("\"");
		}
		sb.Append("?>");
		return sb.ToString();
	}
}

/// <summary>
/// Represents an XML Document Type Definition (DTD).
/// </summary>
export classXDocumentType extends XNode
{
	private name: string;
private publicId: string;
private systemId: string;
private internalSubset: string;
		// Cached DTD information from the reader
		//   This is initialized only if the DTD was loaded from a reader which supports the IDtdInfo
		//   otherwise this is null.
		private dtdInfo: IDtdInfo;


		/// <summary>
		/// Initializes an empty instance of the <see cref="XDocumentType"/> class.
		/// </summary>
		public XDocumentType(name:string, string publicId, systemId:string, internalSubset:string)
	{
		this.name = XmlConvert.VerifyName(name);
		this.publicId = publicId;
		this.systemId = systemId;
		this.internalSubset = internalSubset;
	}

		/// <summary>
		/// Initializes an instance of the XDocumentType class
		/// from another XDocumentType object.
		/// </summary>
		/// <param name="other"><see cref="XDocumentType"/> object to copy from.</param>
		public XDocumentType(other:XDocumentType)
	{
		if (other == null) throw 'ArgumentNullException("other")';
		this.name = other.name;
		this.publicId = other.publicId;
		this.systemId = other.systemId;
		this.internalSubset = other.internalSubset;
		this.dtdInfo = other.dtdInfo;
	}

	/*internal*/ XDocumentType(r:XmlReader)
	{
		name = r.Name;
		publicId = r.GetAttribute("PUBLIC");
		systemId = r.GetAttribute("SYSTEM");
		internalSubset = r.Value;
		var dtdInfo = r.DtdInfo;
		r.Read();
	}
		/*internal*/ XDocumentType(name:string, string publicId, systemId:string, string internalSubset, dtdInfo:IDtdInfo)
			: this(name, publicId, systemId, internalSubset)
	{
		this.dtdInfo = dtdInfo;
	}

		/// <summary>
		/// Gets or sets the /*internal*/ subset for this Document Type Definition (DTD).
		/// </summary>
		public string InternalSubset
	{
		get
		{
			return internalSubset;
		}
		set
		{
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Value);
			internalSubset = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Value);
		}
	}

		/// <summary>
		/// Gets or sets the name for this Document Type Definition (DTD).
		/// </summary>
		public string Name
	{
		get
		{
			return name;
		}
		set
		{
			value = XmlConvert.VerifyName(value);
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Name);
			name = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Name);
		}
	}

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.DocumentType.
		/// </remarks>
		public XmlNodeType NodeType
	{
		get
		{
			return XmlNodeType.DocumentType;
		}
	}

		/// <summary>
		/// Gets or sets the public identifier for this Document Type Definition (DTD).
		/// </summary>
		public string PublicId
	{
		get
		{
			return publicId;
		}
		set
		{
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Value);
			publicId = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Value);
		}
	}

		/// <summary>
		/// Gets or sets the system identifier for this Document Type Definition (DTD).
		/// </summary>
		public string SystemId
	{
		get
		{
			return systemId;
		}
		set
		{
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Value);
			systemId = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Value);
		}
	}


		/*internal*/ IDtdInfo DtdInfo
	{
		get
		{
			return this.dtdInfo;
		}
	}
	#endif

	/// <summary>
	/// Write this <see cref="XDocumentType"/> to the passed in <see cref="XmlWriter"/>.
	/// </summary>
	/// <param name="writer">
	/// The <see cref="XmlWriter"/> to write this <see cref="XDocumentType"/> to.
	/// </param>
	WriteTo(writer:XmlWriter):void
	{
		if(writer == null) throw 'ArgumentNullException("writer")';
		writer.WriteDocType(name, publicId, systemId, internalSubset);
	}

	/*internal*/ XNode CloneNode()
	{
		return new XDocumentType(this);
	}

	/*internal*/ boolean DeepEquals(node:XNode)
	{
		var other: XDocumentType = node as XDocumentType;
		return other != null && name == other.name && publicId == other.publicId &&
			systemId == other.SystemId && internalSubset == other.internalSubset;
	}

	/*internal*/ number/*int*/ GetDeepHashCode()
	{
		return name.GetHashCode() ^
			(publicId != null ? publicId.GetHashCode() : 0) ^
			(systemId != null ? systemId.GetHashCode() : 0) ^
			(internalSubset != null ? internalSubset.GetHashCode() : 0);
	}
}

/// <summary>
/// Represents an XML attribute.
/// </summary>
/// <remarks>
/// An XML attribute is a name/value pair associated with an XML element.
/// </remarks>
	export classXAttribute extends XObject
{
			static IEnumerable < XAttribute > emptySequence;

		/// <summary>
		/// Gets an empty collection of attributes.
		/// </summary>
		public static IEnumerable < XAttribute > EmptySequence
	{
		get
		{
			if (emptySequence == null) emptySequence = new XAttribute[0];
			return emptySequence;
		}
	}

	/*internal*/ XAttribute next;
	/*internal*/ XName name;
	/*internal*/ string value;

		/// <overloads>
		/// Initializes a new instance of the <see cref="XAttribute"/> class.
		/// </overloads>
		/// <summary>
		/// Initializes a new instance of the <see cref="XAttribute"/> class from
		/// the specified name and value.
		/// </summary>
		/// <param name="name">
		/// The name of the attribute.
		/// </param>
		/// <param name="value">
		/// The value of the attribute.
		/// </param>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the passed in name or value are null.
		/// </exception>
		public XAttribute(name:XName, value:any)
	{
		if (name == null) throw 'ArgumentNullException("name")';
		if (value == null) throw 'ArgumentNullException("value")';
		var s: string = XContainer.GetStringValue(value);
		ValidateAttribute(name, s);
		this.name = name;
		this.value = s;
	}

		/// <summary>
		/// Initializes an instance of the XAttribute class
		/// from another XAttribute object.
		/// </summary>
		/// <param name="other"><see cref="XAttribute"/> object to copy from.</param>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified <see cref="XAttribute"/> is null.
		/// </exception>
		public XAttribute(other:XAttribute)
	{
		if (other == null) throw 'ArgumentNullException("other")';
		name = other.name;
		value = other.value;
	}

		/// <summary>
		/// Gets a value indicating if this attribute is a namespace declaration.
		/// </summary>
		public boolean IsNamespaceDeclaration
	{
		get
		{
			var namespaceName: string = name.NamespaceName;
			if (namespaceName.length == 0)
			{
				return name.LocalName == "xmlns";
			}
			return <any>namespaceName == <any>XNamespace.xmlnsPrefixNamespace;
		}
	}

	/// <summary>
	/// Gets the name of this attribute.
	/// </summary>
				get Name():XName
	{
		return name;
	}

	/// <summary>
	/// Gets the next attribute of the parent element.
	/// </summary>
	/// <remarks>
	/// If this attribute does not have a parent, or if there is no next attribute,
	/// then this property returns null.
	/// </remarks>
				get NextAttribute():XAttribute
	{
		return parent != null && (<XElement>parent).lastAttr != this ? next : null;
	}

		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
		/// <remarks>
		/// This property will always return XmlNodeType.Attribute.
		/// </remarks>
		public XmlNodeType NodeType
	{
		get
		{
			return XmlNodeType.Attribute;
		}
	}

		/// <summary>
		/// Gets the previous attribute of the parent element.
		/// </summary>
		/// <remarks>
		/// If this attribute does not have a parent, or if there is no previous attribute,
		/// then this property returns null.
		/// </remarks>
		public XAttribute PreviousAttribute
	{
		get
		{
			if (parent == null) return null;
			var a: XAttribute = (<XElement>parent).lastAttr;
			while (a.next != this)
			{
				a = a.next;
			}
			return a != (<XElement>parent).lastAttr ? a : null;
		}
	}

		/// <summary>
		/// Gets or sets the value of this attribute.
		/// </summary>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the value set is null.
		/// </exception>
		public string Value
	{
		get
		{
			return value;
		}
		set
		{
			if (value == null) throw 'ArgumentNullException("value")';
			ValidateAttribute(name, value);
			var notify: boolean = NotifyChanging(this, XObjectChangeEventArgs.Value);
			this.value = value;
			if (notify) NotifyChanged(this, XObjectChangeEventArgs.Value);
		}
	}

	/// <summary>
	/// Deletes this XAttribute.
	/// </summary>
	/// <exception cref="InvalidOperationException">
	/// Thrown if the parent element is null.
	/// </exception>
	Remove():void
	{
		if(parent == null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_MissingParent))';
		(<XElement>parent).RemoveAttribute(this);
}

/// <summary>
/// Sets the value of this <see cref="XAttribute"/>.
/// <seealso cref="XElement.SetValue"/>
/// <seealso cref="XElement.SetAttributeValue"/>
/// <seealso cref="XElement.SetElementValue"/>
/// </summary>
/// <param name="value">
/// The value to assign to this attribute. The value is converted to its string
/// representation and assigned to the <see cref="Value"/> property.
/// </param>
/// <exception cref="ArgumentNullException">
/// Thrown if the specified value is null.
/// </exception>
SetValue(value:any):void
{
	if(value == null) throw 'ArgumentNullException("value")';
	Value = XContainer.GetStringValue(value);
}

/// <summary>
/// Override for <see cref="ToString()"/> on <see cref="XAttribute"/>
/// </summary>
/// <returns>XML text representation of an attribute and its value</returns>
ToString():string
{
	using(var sw: StringWriter = new StringWriter(CultureInfo.InvariantCulture))
	{
		XmlWriterSettings ws = new XmlWriterSettings();
		ws.ConformanceLevel = ConformanceLevel.Fragment;
		using(var w: XmlWriter = XmlWriter.Create(sw, ws))
		{
			w.WriteAttributeString(GetPrefixOfNamespace(name.Namespace), name.LocalName, name.NamespaceName, value);
		}
		return sw.ToString().Trim();
	}
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="string"/>.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="string"/>.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="string"/>.
/// </returns>

		public static explicit operator string(attribute:XAttribute)
{
	if (attribute == null) return null;
	return attribute.value;
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="boolean"/>.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="boolean"/>.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="boolean"/>.
/// </returns>
/// <exception cref="ArgumentNullException">
/// Thrown if the specified attribute is null.
/// </exception>

		public static explicit operator boolean(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToBoolean(attribute.value.ToLower(CultureInfo.InvariantCulture));
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="boolean"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="boolean"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="boolean"/>?.
/// </returns>

		public static explicit operator boolean? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToBoolean(attribute.value.ToLower(CultureInfo.InvariantCulture));
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to an <see cref="number/*int*/"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="number/*int*/"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as an <see cref="number/*int*/"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator number/*int*/(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToInt32(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to an <see cref="number/*int*/"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="number/*int*/"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as an <see cref="number/*int*/"/>?.
/// </returns>

		public static explicit operator number/*int*/ ? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToInt32(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to an <see cref="uint"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="uint"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as an <see cref="uint"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator uint(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToUInt32(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to an <see cref="uint"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="uint"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as an <see cref="uint"/>?.
/// </returns>

		public static explicit operator uint? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToUInt32(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to a <see cref="long"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="long"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as a <see cref="long"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator long(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToInt64(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="long"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="long"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="long"/>?.
/// </returns>

		public static explicit operator long? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToInt64(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to an <see cref="ulong"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="ulong"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as an <see cref="ulong"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator ulong(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToUInt64(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to an <see cref="ulong"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="ulong"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as an <see cref="ulong"/>?.
/// </returns>

		public static explicit operator ulong? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToUInt64(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to a <see cref="float"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="float"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as a <see cref="float"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator float(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToSingle(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="float"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="float"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="float"/>?.
/// </returns>

		public static explicit operator float? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToSingle(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to a <see cref="double"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="double"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as a <see cref="double"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator double(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToDouble(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="double"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="double"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="double"/>?.
/// </returns>

		public static explicit operator double? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToDouble(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to a <see cref="decimal"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="decimal"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as a <see cref="decimal"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator decimal(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToDecimal(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="decimal"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="decimal"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="decimal"/>?.
/// </returns>

		public static explicit operator decimal? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToDecimal(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to a <see cref="DateTime"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="DateTime"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as a <see cref="DateTime"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator DateTime(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return DateTime.Parse(attribute.value, CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.RoundtripKind);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="DateTime"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="DateTime"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="DateTime"/>?.
/// </returns>

		public static explicit operator DateTime? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return DateTime.Parse(attribute.value, CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.RoundtripKind);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to a <see cref="DateTimeOffset"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="DateTimeOffset"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as a <see cref="DateTimeOffset"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator DateTimeOffset(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToDateTimeOffset(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="DateTimeOffset"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="DateTimeOffset"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="DateTimeOffset"/>?.
/// </returns>

		public static explicit operator DateTimeOffset? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToDateTimeOffset(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to a <see cref="TimeSpan"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="TimeSpan"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as a <see cref="TimeSpan"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator TimeSpan(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToTimeSpan(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="TimeSpan"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="TimeSpan"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="TimeSpan"/>?.
/// </returns>

		public static explicit operator TimeSpan? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToTimeSpan(attribute.value);
}

		/// <summary>
		/// Cast the value of this <see cref="XAttribute"/> to a <see cref="Guid"/>.
		/// </summary>
		/// <param name="attribute">
		/// The <see cref="XAttribute"/> to cast to <see cref="Guid"/>.
		/// </param>
		/// <returns>
		/// The content of this <see cref="XAttribute"/> as a <see cref="Guid"/>.
		/// </returns>
		/// <exception cref="ArgumentNullException">
		/// Thrown if the specified attribute is null.
		/// </exception>
		[CLSCompliant(false)]
		public static explicit operator Guid(attribute:XAttribute)
{
	if (attribute == null) throw 'ArgumentNullException("attribute")';
	return XmlConvert.ToGuid(attribute.value);
}

/// <summary>
/// Cast the value of this <see cref="XAttribute"/> to a <see cref="Guid"/>?.
/// </summary>
/// <param name="attribute">
/// The <see cref="XAttribute"/> to cast to <see cref="Guid"/>?. Can be null.
/// </param>
/// <returns>
/// The content of this <see cref="XAttribute"/> as a <see cref="Guid"/>?.
/// </returns>

		public static explicit operator Guid? (attribute: XAttribute)
		{
	if (attribute == null) return null;
	return XmlConvert.ToGuid(attribute.value);
}

		/*internal*/ number/*int*/ GetDeepHashCode()
{
	return name.GetHashCode() ^ value.GetHashCode();
}

	/*internal*/ string GetPrefixOfNamespace(ns:XNamespace)
{
	var namespaceName: string = ns.NamespaceName;
	if (namespaceName.length == 0) return string.Empty;
	if (parent != null) return (<XElement>parent).GetPrefixOfNamespace(ns);
	if (<any>namespaceName == <any>XNamespace.xmlPrefixNamespace) return "xml";
	if (<any>namespaceName == <any>XNamespace.xmlnsPrefixNamespace) return "xmlns";
	return null;
}

		static void ValidateAttribute(name:XName, value:string)
{
	// The following constraints apply for namespace declarations:
	var namespaceName: string = name.NamespaceName;
	if (<any>namespaceName == <any>XNamespace.xmlnsPrefixNamespace)
	{
		if (value.length == 0)
		{
			// The empty namespace name can only be declared by 
			// the default namespace declaration
			throw 'ArgumentException(Res.GetString(Res.Argument_NamespaceDeclarationPrefixed, name.LocalName))';
		}
		else if (value == XNamespace.xmlPrefixNamespace)
		{
			// 'http://www.w3.org/XML/1998/namespace' can only
			// be declared by the 'xml' prefix namespace declaration.
			if (name.LocalName != "xml") throw 'ArgumentException(Res.GetString(Res.Argument_NamespaceDeclarationXml))';
		}
		else if (value == XNamespace.xmlnsPrefixNamespace)
		{
			// 'http://www.w3.org/2000/xmlns/' must not be declared
			// by any namespace declaration.
			throw 'ArgumentException(Res.GetString(Res.Argument_NamespaceDeclarationXmlns))';
		}
		else
		{
			var localName: string = name.LocalName;
			if (localName == "xml")
			{
				// No other namespace name can be declared by the 'xml' 
				// prefix namespace declaration. 
				throw 'ArgumentException(Res.GetString(Res.Argument_NamespaceDeclarationXml))';
			}
			else if (localName == "xmlns")
			{
				// The 'xmlns' prefix must not be declared. 
				throw 'ArgumentException(Res.GetString(Res.Argument_NamespaceDeclarationXmlns))';
			}
		}
	}
	else if (namespaceName.length == 0 && name.LocalName == "xmlns")
	{
		if (value == XNamespace.xmlPrefixNamespace)
		{
			// 'http://www.w3.org/XML/1998/namespace' can only
			// be declared by the 'xml' prefix namespace declaration.
			throw 'ArgumentException(Res.GetString(Res.Argument_NamespaceDeclarationXml))';
		}
		else if (value == XNamespace.xmlnsPrefixNamespace)
		{
			// 'http://www.w3.org/2000/xmlns/' must not be declared
			// by any namespace declaration.
			throw 'ArgumentException(Res.GetString(Res.Argument_NamespaceDeclarationXmlns))';
		}
	}
}


/// <summary>
/// Represents a class that allows elements to be streamed
/// on input and output.
/// </summary>
export class XStreamingElement
{
	/*internal*/ XName name;
	/*internal*/ object content;

	/// <summary>
	///  Creates a <see cref="XStreamingElement"/> node with a given name
	/// </summary>
	/// <param name="name">The name to assign to the new <see cref="XStreamingElement"/> node</param>
	public XStreamingElement(name: XName)
	{
		if (name == null) throw 'ArgumentNullException("name")';
		this.name = name;
	}

	/// <summary>
	/// Creates a <see cref="XStreamingElement"/> node with a given name and content
	/// </summary>
	/// <param name="name">The name to assign to the new <see cref="XStreamingElement"/> node</param>
	/// <param name="content">The content to assign to the new <see cref="XStreamingElement"/> node</param>
	public XStreamingElement(name: XName, content: any)
		: this(name)
	{
		this._content = content is List<any> ? new object[] { content } : content;
	}

	/// <summary>
	/// Creates a <see cref="XStreamingElement"/> node with a given name and content
	/// </summary>
	/// <param name="name">The name to assign to the new <see cref="XStreamingElement"/> node</param>
	/// <param name="content">An array containing content to assign to the new <see cref="XStreamingElement"/> node</param>
	public XStreamingElement(name: XName, ..._content: any[])
		: this(name)
	{
		this._content = content;
	}

	/// <summary>
	/// Gets or sets the name of this streaming element.
	/// </summary>
	get Name(): XName
	{
		return name;
	}
	set Name(name: XName)
	{
		if (value == null) throw 'ArgumentNullException("value")';
		name = value;
	}


	/// <summary>
	/// Add content to an <see cref="XStreamingElement"/>
	/// </summary>
	/// <param name="content">Object containg content to add</param>
	Add(content: any): void
	{
		if (content != null)
		{
			List < object > list = this._content as List<any>;
			if (list == null)
			{
				list = new List<any>();
				if (this._content != null) list.Add(this._content);
				this._content = list;
			}
			list.Add(content);
		}
	}

	/// <summary>
	/// Add content to an <see cref="XStreamingElement"/>
	/// </summary>
	/// <param name="content">array of objects containg content to add</param>
	Add(..._content: any[]): void
	{
		Add(<object > content);
	}


	/// <summary>
	/// Save an <see cref="XStreamingElement"/> to a file with formatting.
	/// </summary>
	/// <param name="fileName">Name of file to write content to</param>
	Save(fileName: string): void
	{
		Save(fileName, SaveOptions.None);
	}

	/// <summary>
	/// Save an <see cref="XStreamingElement"/> to a file, optionally formatting. 
	/// </summary>
	/// <param name="fileName">Name of file to write content to</param>
	/// <param name="options">
	/// If SaveOptions.DisableFormatting is enabled the output is not indented.
	/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
	/// </param>
	Save(fileName: string, options: SaveOptions): void
	{
		var ws: XmlWriterSettings = XNode.GetXmlWriterSettings(options);
		using(var w: XmlWriter = XmlWriter.Create(fileName, ws))
		{
			Save(w);
		}
	}

	/// <summary>
	/// Save the contents of an <see cref="XStreamingElement"/> to a <see cref="Stream"/>
	/// with formatting.
	/// </summary>
	/// <param name="stream"><see cref="Stream"/> to write to </param>      
	Save(stream: Stream): void
	{
		Save(stream, SaveOptions.None);
	}

	/// <summary>
	/// Save the contents of an <see cref="XStreamingElement"/> to a <see cref="Stream"/>,
	/// optionally formatting.
	/// </summary>
	/// <param name="stream"><see cref="Stream"/> to write to </param>
	/// <param name="options">
	/// If SaveOptions.DisableFormatting is enabled the output is not indented.
	/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
	/// </param>
	Save(stream: Stream, options: SaveOptions): void
	{
		var ws: XmlWriterSettings = XNode.GetXmlWriterSettings(options);
		using(var w: XmlWriter = XmlWriter.Create(stream, ws))
		{
			Save(w);
		}
	}

	/// <summary>
	/// Save the contents of an <see cref="XStreamingElement"/> to a text writer
	/// with formatting.
	/// </summary>
	/// <param name="textWriter"><see cref="TextWriter"/> to write to </param>      
	Save(textWriter: TextWriter): void
	{
		Save(textWriter, SaveOptions.None);
	}

	/// <summary>
	/// Save the contents of an <see cref="XStreamingElement"/> to a text writer
	/// optionally formatting.
	/// </summary>
	/// <param name="textWriter"><see cref="TextWriter"/> to write to </param>
	/// <param name="options">
	/// If SaveOptions.DisableFormatting is enabled the output is not indented.
	/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
	/// </param>
	Save(textWriter: TextWriter, options: SaveOptions): void
	{
		var ws: XmlWriterSettings = XNode.GetXmlWriterSettings(options);
		using(var w: XmlWriter = XmlWriter.Create(textWriter, ws))
		{
			Save(w);
		}
	}

	/// <summary>
	/// Save the contents of an <see cref="XStreamingElement"/> to an XML writer, not preserving whitepace
	/// </summary>
	/// <param name="writer"><see cref="XmlWriter"/> to write to </param>    
	Save(writer: XmlWriter): void
	{
		if (writer == null) throw 'ArgumentNullException("writer")';
		writer.WriteStartDocument();
		WriteTo(writer);
		writer.WriteEndDocument();
	}

	/// <summary>
	/// Get the XML content of an <see cref="XStreamingElement"/> as a 
	/// formatted string.
	/// </summary>
	/// <returns>The XML text as a formatted string</returns>
	ToString(): string
	{
		return GetXmlString(SaveOptions.None);
	}

	/// <summary>
	/// Gets the XML content of this streaming element as a string.
	/// </summary>
	/// <param name="options">
	/// If SaveOptions.DisableFormatting is enabled the content is not indented.
	/// If SaveOptions.OmitDuplicateNamespaces is enabled duplicate namespace declarations will be removed.
	/// </param>
	/// <returns>An XML string</returns>
	ToString(options: SaveOptions): string
	{
		return GetXmlString(options);
	}

	/// <summary>
	/// Write this <see cref="XStreamingElement"/> to an <see cref="XmlWriter"/>
	/// </summary>
	/// <param name="writer"></param>
	WriteTo(writer: XmlWriter): void
	{
		if (writer == null) throw 'ArgumentNullException("writer")';
		new StreamingElementWriter(writer).WriteStreamingElement(this);
	}

	GetXmlString(o: SaveOptions): string
	{
		using(var sw: StringWriter = new StringWriter(CultureInfo.InvariantCulture))
		{
			XmlWriterSettings ws = new XmlWriterSettings();
			ws.OmitXmlDeclaration = true;
			if ((o & SaveOptions.DisableFormatting) == 0) ws.Indent = true;
			if ((o & SaveOptions.OmitDuplicateNamespaces) != 0) ws.NamespaceHandling |= NamespaceHandling.OmitDuplicates;
			using(var w: XmlWriter = XmlWriter.Create(sw, ws))
			{
				WriteTo(w);
			}
			return sw.ToString();
		}
	}
}

/*internal*/ struct StreamingElementWriter
{
	private writer: XmlWriter;
private element: XStreamingElement;
	List < XAttribute > attributes;
private resolver: NamespaceResolver;

		public StreamingElementWriter(w:XmlWriter)
	{
		writer = w;
		element = null;
		attributes = new List<XAttribute>();
		resolver = new NamespaceResolver();
	}

private FlushElement():void
	{
		if(element != null)
		{
			PushElement();
			var ns: XNamespace = element.Name.Namespace;
			writer.WriteStartElement(GetPrefixOfNamespace(ns, true), element.Name.LocalName, ns.NamespaceName);
			foreach(XAttribute a in attributes)
			{
				ns = a.Name.Namespace;
				var localName: string = a.Name.LocalName;
				var namespaceName: string = ns.NamespaceName;
				writer.WriteAttributeString(GetPrefixOfNamespace(ns, false), localName, namespaceName.length == 0 && localName == "xmlns" ? XNamespace.xmlnsPrefixNamespace : namespaceName, a.Value);
			}
			element = null;
			attributes.Clear();
		}
	}

private GetPrefixOfNamespace(ns:XNamespace, allowDefaultNamespace:boolean):string
	{
		var namespaceName: string = ns.NamespaceName;
		if (namespaceName.length == 0) return string.Empty;
		var prefix: string = resolver.GetPrefixOfNamespace(ns, allowDefaultNamespace);
		if (prefix != null) return prefix;
		if (<any>namespaceName == <any>XNamespace.xmlPrefixNamespace) return "xml";
		if (<any>namespaceName == <any>XNamespace.xmlnsPrefixNamespace) return "xmlns";
		return null;
	}

private PushElement():void
	{
		resolver.PushScope();
		foreach(XAttribute a in attributes)
		{
			if (a.IsNamespaceDeclaration)
			{
				resolver.Add(a.Name.NamespaceName.length == 0 ? string.Empty : a.Name.LocalName, XNamespace.Get(a.Value));
			}
		}
	}

private Write(content:any):void
	{
		if(content == null) return;
		var n: XNode = content as XNode;
		if(n != null)
		{
			WriteNode(n);
			return;
		}
	var s: string = content as string;
		if(s != null)
		{
			WriteString(s);
			return;
		}
	var a: XAttribute = content as XAttribute;
		if(a != null)
		{
			WriteAttribute(a);
			return;
		}
	var x: XStreamingElement = content as XStreamingElement;
		if(x != null)
		{
			WriteStreamingElement(x);
			return;
		}
	object[] o = content as object[];
		if(o != null)
		{
			foreach(object obj in o) Write(obj);
			return;
		}
	var e: IEnumerable = content as IEnumerable;
		if(e != null)
		{
			foreach(object obj in e) Write(obj);
			return;
		}
	WriteString(XContainer.GetStringValue(content));
	}

private WriteAttribute(a:XAttribute):void
	{
		if(element == null) throw 'InvalidOperationException(Res.GetString(Res.InvalidOperation_WriteAttribute))';
		attributes.Add(a);
	}

private WriteNode(n:XNode):void
	{
		FlushElement();
		n.WriteTo(writer);
	}

	/*internal*/ void WriteStreamingElement(e:XStreamingElement)
	{
		FlushElement();
		element = e;
		Write(e._content);
		var contentWritten: boolean = element == null;
		FlushElement();
		if (contentWritten)
		{
			writer.WriteFullEndElement();
		}
		else
		{
			writer.WriteEndElement();
		}
		resolver.PopScope();
	}

private WriteString(s:string):void
	{
		FlushElement();
		writer.WriteString(s);
	}
}

/// <summary>
/// Defines the LINQ to XML extension methods.
/// </summary>
public static class Extensions
{
	/// <summary>
	/// Returns all of the <see cref="XAttribute"/>s for each <see cref="XElement"/> of
	/// this <see cref="IEnumerable"/> of <see cref="XElement"/>.
	/// </summary>
	/// <returns>
	/// An <see cref="IEnumerable"/> of <see cref="XAttribute"/> containing the XML
	/// Attributes for every <see cref="XElement"/> in the target <see cref="IEnumerable"/>
	/// of <see cref="XElement"/>.
	/// </returns>
	static Attributes(this IEnumerable< XElement > source):IEnumerable < XAttribute >
{
	if(source == null) throw 'ArgumentNullException("source")';
	return GetAttributes(source, null);
}

		/// <summary>
		/// Returns the <see cref="XAttribute"/>s that have a matching <see cref="XName"/>.  Each
		/// <see cref="XElement"/>'s <see cref="XAttribute"/>s in the target <see cref="IEnumerable"/> 
		/// of <see cref="XElement"/> are scanned for a matching <see cref="XName"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XAttribute"/> containing the XML
		/// Attributes with a matching <see cref="XName"/> for every <see cref="XElement"/> in 
		/// the target <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		static Attributes(this IEnumerable< XElement > source, name:XName):IEnumerable < XAttribute >
{
	if(source == null) throw 'ArgumentNullException("source")';
	return name != null ? GetAttributes(source, name) : XAttribute.EmptySequence;
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the ancestors (parent
		/// and it's parent up to the root) of each of the <see cref="XElement"/>s in this 
		/// <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the ancestors (parent
		/// and it's parent up to the root) of each of the <see cref="XElement"/>s in this 
		/// <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		public static IEnumerable < XElement > Ancestors<T>(this IEnumerable< T > source) where T : XNode
{
	if (source == null) throw 'ArgumentNullException("source")';
	return GetAncestors(source, null, false);
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the ancestors (parent
		/// and it's parent up to the root) that have a matching <see cref="XName"/>.  This is done for each 
		/// <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the ancestors (parent
		/// and it's parent up to the root) that have a matching <see cref="XName"/>.  This is done for each 
		/// <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		public static IEnumerable < XElement > Ancestors<T>(this IEnumerable< T > source, name:XName) where T : XNode
{
	if (source == null) throw 'ArgumentNullException("source")';
	return name != null ? GetAncestors(source, name, false) : XElement.EmptySequence;
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's ancestors (parent and it's parent up to the root).
		/// This is done for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of 
		/// <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's ancestors (parent and it's parent up to the root).
		/// This is done for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of 
		/// <see cref="XElement"/>.
		/// </returns>
		static AncestorsAndSelf(this IEnumerable< XElement > source):IEnumerable < XElement >
{
	if(source == null) throw 'ArgumentNullException("source")';
	return GetAncestors(source, null, true);
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's ancestors (parent and it's parent up to the root)
		/// that match the passed in <see cref="XName"/>.  This is done for each 
		/// <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's ancestors (parent and it's parent up to the root)
		/// that match the passed in <see cref="XName"/>.  This is done for each 
		/// <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		static AncestorsAndSelf(this IEnumerable< XElement > source, name:XName):IEnumerable < XElement >
{
	if(source == null) throw 'ArgumentNullException("source")';
	return name != null ? GetAncestors(source, name, true) : XElement.EmptySequence;
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XNode"/> over the content of a set of nodes
		/// </summary>
		public static IEnumerable < XNode > Nodes<T>(this IEnumerable< T > source) where T : XContainer
{
	if (source == null) throw 'ArgumentNullException("source")';
	foreach(XContainer root in source)
	{
		if (root != null)
		{
			var n: XNode = root.LastNode;
			if (n != null)
			{
				do
				{
					n = n.next;
					yield return n;
				} while (n.parent == root && n != root._content);
			}
		}
	}
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XNode"/> over the descendants of a set of nodes
		/// </summary>     
		public static IEnumerable < XNode > DescendantNodes<T>(this IEnumerable< T > source) where T : XContainer
{
	if (source == null) throw 'ArgumentNullException("source")';
	return GetDescendantNodes(source, false);
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the descendants (children
		/// and their children down to the leaf level).  This is done for each <see cref="XElement"/> in  
		/// this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the descendants (children
		/// and their children down to the leaf level).  This is done for each <see cref="XElement"/> in  
		/// this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		public static IEnumerable < XElement > Descendants<T>(this IEnumerable< T > source) where T : XContainer
{
	if (source == null) throw 'ArgumentNullException("source")';
	return GetDescendants(source, null, false);
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the descendants (children
		/// and their children down to the leaf level) that have a matching <see cref="XName"/>.  This is done 
		/// for each <see cref="XElement"/> in the target <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the descendants (children
		/// and their children down to the leaf level) that have a matching <see cref="XName"/>.  This is done 
		/// for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		public static IEnumerable < XElement > Descendants<T>(this IEnumerable< T > source, name:XName) where T : XContainer
{
	if (source == null) throw 'ArgumentNullException("source")';
	return name != null ? GetDescendants(source, name, false) : XElement.EmptySequence;
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's descendants
		/// that match the passed in <see cref="XName"/>.  This is done for each 
		/// <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and descendants.
		/// This is done for each 
		/// <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>      
		static DescendantNodesAndSelf(this IEnumerable< XElement > source):IEnumerable < XNode >
{
	if(source == null) throw 'ArgumentNullException("source")';
	return GetDescendantNodes(source, true);
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's descendants (children and children's children down 
		/// to the leaf nodes).  This is done for each <see cref="XElement"/> in this <see cref="IEnumerable"/> 
		/// of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's descendants (children and children's children down 
		/// to the leaf nodes).  This is done for each <see cref="XElement"/> in this <see cref="IEnumerable"/> 
		/// of <see cref="XElement"/>.
		/// </returns>
		static DescendantsAndSelf(this IEnumerable< XElement > source):IEnumerable < XElement >
{
	if(source == null) throw 'ArgumentNullException("source")';
	return GetDescendants(source, null, true);
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's descendants (children and children's children down 
		/// to the leaf nodes) that match the passed in <see cref="XName"/>.  This is done for 
		/// each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the 
		/// <see cref="XElement"/> and it's descendants (children and children's children down 
		/// to the leaf nodes) that match the passed in <see cref="XName"/>.  This is done for 
		/// each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		static DescendantsAndSelf(this IEnumerable< XElement > source, name:XName):IEnumerable < XElement >
{
	if(source == null) throw 'ArgumentNullException("source")';
	return name != null ? GetDescendants(source, name, true) : XElement.EmptySequence;
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the child elements
		/// for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the child elements
		/// for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		public static IEnumerable < XElement > Elements<T>(this IEnumerable< T > source) where T : XContainer
{
	if (source == null) throw 'ArgumentNullException("source")';
	return GetElements(source, null);
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the child elements
		/// with a matching for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the child elements
		/// for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </returns>
		public static IEnumerable < XElement > Elements<T>(this IEnumerable< T > source, name:XName) where T : XContainer
{
	if (source == null) throw 'ArgumentNullException("source")';
	return name != null ? GetElements(source, name) : XElement.EmptySequence;
}

		/// <summary>
		/// Returns an <see cref="IEnumerable"/> of <see cref="XElement"/> containing the child elements
		/// with a matching for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// </summary>
		/// <returns>
		/// An <see cref="IEnumerable"/> of <see cref="XElement"/> containing the child elements
		/// for each <see cref="XElement"/> in this <see cref="IEnumerable"/> of <see cref="XElement"/>.
		/// in document order
		/// </returns>
		public static IEnumerable < T > InDocumentOrder<T>(this IEnumerable< T > source) where T : XNode
{
	return Enumerable.OrderBy(source, n => <XNode>n, XNode.DocumentOrderComparer);
}

		/// <summary>
		/// Removes each <see cref="XAttribute"/> represented in this <see cref="IEnumerable"/> of
		/// <see cref="XAttribute"/>.  Note that this method uses snapshot semantics (copies the
		/// attributes to a <see cref="List&lt;T>"/> before deleting each).
		/// </summary>
		static Remove(this IEnumerable< XAttribute > source):void
{
	if(source == null) throw 'ArgumentNullException("source")';
	foreach(XAttribute a in new List<XAttribute>(source))
				if (a != null) a.Remove();
}

		/// <summary>
		/// Removes each <see cref="XNode"/> represented in this <see cref="IEnumerable"/>
		/// T which must be a derived from <see cref="XNode"/>.  Note that this method uses snapshot semantics 
		/// (copies the <see cref="XNode"/>s to a List before deleting each).
		/// </summary>
		public static void Remove<T>(this IEnumerable< T > source) where T : XNode
{
	if (source == null) throw 'ArgumentNullException("source")';
	foreach(T node in new List<T>(source))
				if (node != null) node.Remove();
}

		static IEnumerable < XAttribute > GetAttributes(IEnumerable < XElement > source, name:XName)
{
	foreach(XElement e in source)
	{
		if (e != null)
		{
			var a: XAttribute = e.lastAttr;
			if (a != null)
			{
				do
				{
					a = a.next;
					if (name == null || a.name == name) yield return a;
				} while (a.parent == e && a != e.lastAttr);
			}
		}
	}
}

		static IEnumerable < XElement > GetAncestors<T>(IEnumerable < T > source, name:XName, self:boolean) where T : XNode
{
	foreach(XNode node in source)
	{
		if (node != null)
		{
			var e: XElement = (self ? node : node.parent) as XElement;
			while (e != null)
			{
				if (name == null || e.name == name) yield return e;
				e = e.parent as XElement;
			}
		}
	}
}

		static IEnumerable < XNode > GetDescendantNodes<T>(IEnumerable < T > source, self:boolean) where T : XContainer
{
	foreach(XContainer root in source)
	{
		if (root != null)
		{
			if (self) yield return root;
			var n: XNode = root;
			while (true)
			{
				var c: XContainer = n as XContainer;
				private first: XNode;
				if (c != null && (first = c.FirstNode) != null)
				{
					n = first;
				}
				else
				{
					while (n != null && n != root && n == n.parent._content) n = n.parent;
					if (n == null || n == root) break;
					n = n.next;
				}
				yield return n;
			}
		}
	}
}

		static IEnumerable < XElement > GetDescendants<T>(IEnumerable < T > source, name:XName, self:boolean) where T : XContainer
{
	foreach(XContainer root in source)
	{
		if (root != null)
		{
			if (self)
			{
				var e: XElement = <XElement>root;
				if (name == null || e.name == name) yield return e;
			}
			var n: XNode = root;
			var c: XContainer = root;
			while (true)
			{
				if (c != null && c._content is XNode)
				{
					n = (<XNode>c._content).next;
				}
						else
				{
					while (n != null && n != root && n == n.parent._content) n = n.parent;
					if (n == null || n == root) break;
					n = n.next;
				}
				var e: XElement = n as XElement;
				if (e != null && (name == null || e.name == name)) yield return e;
				c = e;
			}
		}
	}
}

		static IEnumerable < XElement > GetElements<T>(IEnumerable < T > source, name:XName) where T : XContainer
{
	foreach(XContainer root in source)
	{
		if (root != null)
		{
			var n: XNode = root._content as XNode;
			if (n != null)
			{
				do
				{
					n = n.next;
					var e: XElement = n as XElement;
					if (e != null && (name == null || e.name == name)) yield return e;
				} while (n.parent == root && n != root._content);
			}
		}
	}
}
	}

/*internal*/ class XNodeBuilder extends XmlWriter
{
	List<any> content;
	private parent: XContainer;
	private attrName: XName;
	private attrValue: string;
	private root: XContainer;

	public XNodeBuilder(container: XContainer)
	{
		root = container;
	}

	public XmlWriterSettings Settings
{
	get
	{
		var settings: XmlWriterSettings = new XmlWriterSettings();
		settings.ConformanceLevel = ConformanceLevel.Auto;
		return settings;
	}
}

get WriteState():WriteState
{
	throw 'NotSupportedException()';  // nop
}

Close():void
{
	root.Add(content);
}

Flush():void
{
}

LookupPrefix(namespaceName:string):string
{
	throw 'NotSupportedException()'; // nop
}

WriteBase64(byte[] buffer, index:number/*int*/, count:number/*int*/):void
{
	throw 'NotSupportedException(Res.GetString(Res.NotSupported_WriteBase64))';
}

WriteCData(text:string):void
{
	AddNode(new XCData(text));
}

WriteCharEntity(ch:char):void
{
	AddString(new string(ch, 1));
}

WriteChars(char[] buffer, index:number/*int*/, count:number/*int*/):void
{
	AddString(new string(buffer, index, count));
}

WriteComment(text:string):void
{
	AddNode(new XComment(text));
}

WriteDocType(name:string, string pubid, sysid:string, subset:string):void
{
	AddNode(new XDocumentType(name, pubid, sysid, subset));
}

WriteEndAttribute():void
{
	var a: XAttribute = new XAttribute(attrName, attrValue);
	attrName = null;
	attrValue = null;
	if(parent != null)
	{
		parent.Add(a);
	}
	else
	{
		Add(a);
	}
}

WriteEndDocument():void
{
}

WriteEndElement():void
{
	parent = (<XElement>parent).parent;
}

WriteEntityRef(name:string):void
{
	switch(name)
	{
		case "amp":
	AddString("&");
	break;
	case "apos":
	AddString("'");
	break;
	case "gt":
	AddString(">");
	break;
	case "lt":
	AddString("<");
	break;
	case "quot":
	AddString("\"");
	break;
	default:
			throw 'NotSupportedException(Res.GetString(Res.NotSupported_WriteEntityRef))';
}
}

WriteFullEndElement():void
{
	var e: XElement = <XElement>parent;
	if(e.IsEmpty)
	{
		e.Add(string.Empty);
	}
	parent = e.parent;
}

WriteProcessingInstruction(name:string, text:string):void
{
	if(name == "xml")
	{
		return;
	}
	AddNode(new XProcessingInstruction(name, text));
}

WriteRaw(char[] buffer, index:number/*int*/, count:number/*int*/):void
{
	AddString(new string(buffer, index, count));
}

WriteRaw(data:string):void
{
	AddString(data);
}

WriteStartAttribute(prefix:string, string localName, namespaceName:string):void
{
	if(prefix == null) throw 'ArgumentNullException("prefix")';
	attrName = XNamespace.Get(prefix.length == 0 ? string.Empty : namespaceName).GetName(localName);
	attrValue = string.Empty;
}

WriteStartDocument():void
{
}

WriteStartDocument(standalone:boolean):void
{
}

WriteStartElement(prefix:string, string localName, namespaceName:string):void
{
	AddNode(new XElement(XNamespace.Get(namespaceName).GetName(localName)));
}

WriteString(text:string):void
{
	AddString(text);
}

WriteSurrogateCharEntity(lowCh:char, highCh:char):void
{
	AddString(new string(new char[] { highCh, lowCh }));
}

WriteValue(value:DateTimeOffset):void
{
	// For compatibility with custom writers, XmlWriter writes DateTimeOffset as DateTime. 
	// Our /*internal*/ writers should use the DateTimeOffset-String conversion from XmlConvert.
	WriteString(XmlConvert.ToString(value));
}

WriteWhitespace(ws:string):void
{
	AddString(ws);
}

private Add(o:any):void
{
	if(content == null)
	{
		content = new List<any>();
	}
	content.Add(o);
}

private AddNode(n:XNode):void
{
	if(parent != null)
	{
		parent.Add(n);
	}
	else
	{
		Add(n);
	}
	var c: XContainer = n as XContainer;
	if(c != null)
	{
		parent = c;
	}
}

private AddString(s:string):void
{
	if(s == null)
	{
		return;
	}
	if (attrValue != null)
	{
		attrValue += s;
	}
	else if (parent != null)
	{
		parent.Add(s);
	}
	else
	{
		Add(s);
	}
}
}

/*internal*/ class XNodeReader extends XmlReader implements XmlLineInfo
{
	// The reader position is encoded by the tuple (source, parent).
	// Lazy text uses (instance, element:parent). Attribute value
	// uses (instance, attribute:parent). End element uses (instance, 
	// instance). Common XObject uses (instance, null). 
	private source: object;
	private parent: object;
	private state: ReadState;
	private root: XNode;
	private nameTable: XmlNameTable;
	private omitDuplicateNamespaces: boolean;

	private dtdInfo: IDtdInfo;
	private dtdInfoInitialized; boolean;

	/*internal*/ XNodeReader(node: XNode, XmlNameTable nameTable, options: ReaderOptions)
	{
		this.source = node;
		this.root = node;
		this.nameTable = nameTable != null ? nameTable : CreateNameTable();
		this.omitDuplicateNamespaces = (options & ReaderOptions.OmitDuplicateNamespaces) != 0 ? true : false;
	}

	/*internal*/ XNodeReader(node: XNode, nameTable: XmlNameTable)
		: this(node, nameTable,
	(node.GetSaveOptionsFromAnnotations() & SaveOptions.OmitDuplicateNamespaces) != 0 ?
	ReaderOptions.OmitDuplicateNamespaces : ReaderOptions.None)
{
}

		public number/*int*/ AttributeCount
{
	get
	{
		if (!IsInteractive)
		{
			return 0;
		}
		var count: number/*int*/ = 0;
		var e: XElement = GetElementInAttributeScope();
		if (e != null)
		{
			var a: XAttribute = e.lastAttr;
			if (a != null)
			{
				do
				{
					a = a.next;
					if (!omitDuplicateNamespaces || !IsDuplicateNamespaceAttribute(a))
					{
						count++;
					}
				} while (a != e.lastAttr);
			}
		}
		return count;
	}
}

		public string BaseURI
{
	get
	{
		var o: XObject = source as XObject;
		if (o != null)
		{
			return o.BaseUri;
		}
		o = parent as XObject;
		if (o != null)
		{
			return o.BaseUri;
		}
		return string.Empty;
	}
}

		public number/*int*/ Depth
{
	get
	{
		if (!IsInteractive)
		{
			return 0;
		}
		var o: XObject = source as XObject;
		if (o != null)
		{
			return GetDepth(o);
		}
		o = parent as XObject;
		if (o != null)
		{
			return GetDepth(o) + 1;
		}
		return 0;
	}
}

		static number/*int*/ GetDepth(o:XObject)
{
	var depth: number/*int*/ = 0;
	while (o.parent != null)
	{
		depth++;
		o = o.parent;
	}
	if (o is XDocument)
	{
		depth--;
	}
	return depth;
}

get EOF():boolean
{
	return state == ReadState.EndOfFile;
}

		public boolean HasAttributes
{
	get
	{
		if (!IsInteractive)
		{
			return false;
		}
		var e: XElement = GetElementInAttributeScope();
		if (e != null && e.lastAttr != null)
		{
			if (omitDuplicateNamespaces)
			{
				return GetFirstNonDuplicateNamespaceAttribute(e.lastAttr.next) != null;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return false;
		}
	}
}

		public boolean HasValue
{
	get
	{
		if (!IsInteractive)
		{
			return false;
		}
		var o: XObject = source as XObject;
		if (o != null)
		{
			switch (o.NodeType)
			{
				case XmlNodeType.Attribute:
				case XmlNodeType.Text:
				case XmlNodeType.CDATA:
				case XmlNodeType.Comment:
				case XmlNodeType.ProcessingInstruction:
				case XmlNodeType.DocumentType:
					return true;
				default:
					return false;
			}
		}
		return true;
	}
}

		public boolean IsEmptyElement
{
	get
	{
		if (!IsInteractive)
		{
			return false;
		}
		var e: XElement = source as XElement;
		return e != null && e.IsEmpty;
	}
}

get LocalName():string
{
	return nameTable.Add(GetLocalName());
}

private GetLocalName():string
{
	if (!IsInteractive)
	{
		return string.Empty;
	}
	var e: XElement = source as XElement;
	if (e != null)
	{
		return e.Name.LocalName;
	}
	var a: XAttribute = source as XAttribute;
	if (a != null)
	{
		return a.Name.LocalName;
	}
	var p: XProcessingInstruction = source as XProcessingInstruction;
	if (p != null)
	{
		return p.Target;
	}
	var n: XDocumentType = source as XDocumentType;
	if (n != null)
	{
		return n.Name;
	}
	return string.Empty;
}

		public string Name
{
	get
	{
		var prefix: string = GetPrefix();
		if (prefix.length == 0)
		{
			return nameTable.Add(GetLocalName());
		}
		return nameTable.Add(string.Concat(prefix, ":", GetLocalName()));
	}
}

get NamespaceURI():string
{
	return nameTable.Add(GetNamespaceURI());
}

private GetNamespaceURI():string
{
	if (!IsInteractive)
	{
		return string.Empty;
	}
	var e: XElement = source as XElement;
	if (e != null)
	{
		return e.Name.NamespaceName;
	}
	var a: XAttribute = source as XAttribute;
	if (a != null)
	{
		var namespaceName: string = a.Name.NamespaceName;
		if (namespaceName.length == 0 && a.Name.LocalName == "xmlns")
		{
			return XNamespace.xmlnsPrefixNamespace;
		}
		return namespaceName;
	}
	return string.Empty;
}

get NameTable():XmlNameTable
{
	return nameTable;
}

		public XmlNodeType NodeType
{
	get
	{
		if (!IsInteractive)
		{
			return XmlNodeType.None;
		}
		var o: XObject = source as XObject;
		if (o != null)
		{
			if (IsEndElement)
			{
				return XmlNodeType.EndElement;
			}
			var nt: XmlNodeType = o.NodeType;
			if (nt != XmlNodeType.Text)
			{
				return nt;
			}
			if (o.parent != null && o.parent.parent == null && o.parent is XDocument)
			{
				return XmlNodeType.Whitespace;
			}
			return XmlNodeType.Text;
		}
		if (parent is XDocument)
		{
			return XmlNodeType.Whitespace;
		}
		return XmlNodeType.Text;
	}
}

get Prefix():string
{
	return nameTable.Add(GetPrefix());
}

private GetPrefix():string
{
	if (!IsInteractive)
	{
		return string.Empty;
	}
	var e: XElement = source as XElement;
	if (e != null)
	{
		var prefix: string = e.GetPrefixOfNamespace(e.Name.Namespace);
		if (prefix != null)
		{
			return prefix;
		}
		return string.Empty;
	}
	var a: XAttribute = source as XAttribute;
	if (a != null)
	{
		var prefix: string = a.GetPrefixOfNamespace(a.Name.Namespace);
		if (prefix != null)
		{
			return prefix;
		}
	}
	return string.Empty;
}

get ReadState():ReadState
{
	return state;
}

		public XmlReaderSettings Settings
{
	get
	{
		var settings: XmlReaderSettings = new XmlReaderSettings();
		settings.CheckCharacters = false;
		return settings;
	}
}

		public string Value
{
	get
	{
		if (!IsInteractive)
		{
			return string.Empty;
		}
		var o: XObject = source as XObject;
		if (o != null)
		{
			switch (o.NodeType)
			{
				case XmlNodeType.Attribute:
					return (<XAttribute>o).Value;
				case XmlNodeType.Text:
				case XmlNodeType.CDATA:
					return (<XText>o).Value;
				case XmlNodeType.Comment:
					return (<XComment>o).Value;
				case XmlNodeType.ProcessingInstruction:
					return (<XProcessingInstruction>o).Data;
				case XmlNodeType.DocumentType:
					return (<XDocumentType>o).InternalSubset;
				default:
					return string.Empty;
			}
		}
		return <string>source;
	}
}

		public string XmlLang
{
	get
	{
		if (!IsInteractive)
		{
			return string.Empty;
		}
		var e: XElement = GetElementInScope();
		if (e != null)
		{
			var name: XName = XNamespace.Xml.GetName("lang");
			do
			{
				var a: XAttribute = e.Attribute(name);
				if (a != null)
				{
					return a.Value;
				}
				e = e.parent as XElement;
			} while (e != null);
		}
		return string.Empty;
	}
}

		public XmlSpace XmlSpace
{
	get
	{
		if (!IsInteractive)
		{
			return XmlSpace.None;
		}
		var e: XElement = GetElementInScope();
		if (e != null)
		{
			var name: XName = XNamespace.Xml.GetName("space");
			do
			{
				var a: XAttribute = e.Attribute(name);
				if (a != null)
				{
					switch (a.Value.Trim(new char[] { ' ', '\t', '\n', '\r' }))
					{
						case "preserve":
							return XmlSpace.Preserve;
						case "default":
							return XmlSpace.Default;
						default:
							break;
					}
				}
				e = e.parent as XElement;
			} while (e != null);
		}
		return XmlSpace.None;
	}
}

Close():void
{
	source = null;
	parent = null;
	root = null;
	state = ReadState.Closed;
}

GetAttribute(name:string):string
{
	if (!IsInteractive)
	{
		return null;
	}
	var e: XElement = GetElementInAttributeScope();
	if (e != null)
	{
		string localName, namespaceName;
		GetNameInAttributeScope(name, e, localName:out, namespaceName:out);
		var a: XAttribute = e.lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				if (a.Name.LocalName == localName && a.Name.NamespaceName == namespaceName)
				{
					if (omitDuplicateNamespaces && IsDuplicateNamespaceAttribute(a))
					{
						return null;
					}
					else
					{
						return a.Value;
					}
				}
			} while (a != e.lastAttr);
		}
		return null;
	}
	var n: XDocumentType = source as XDocumentType;
	if (n != null)
	{
		switch (name)
		{
			case "PUBLIC":
				return n.PublicId;
			case "SYSTEM":
				return n.SystemId;
		}
	}
	return null;
}

GetAttribute(localName:string, namespaceName:string):string
{
	if (!IsInteractive)
	{
		return null;
	}
	var e: XElement = GetElementInAttributeScope();
	if (e != null)
	{
		if (localName == "xmlns")
		{
			if (namespaceName != null && namespaceName.length == 0)
			{
				return null;
			}
			if (namespaceName == XNamespace.xmlnsPrefixNamespace)
			{
				namespaceName = string.Empty;
			}
		}
		var a: XAttribute = e.lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				if (a.Name.LocalName == localName && a.Name.NamespaceName == namespaceName)
				{
					if (omitDuplicateNamespaces && IsDuplicateNamespaceAttribute(a))
					{
						return null;
					}
					else
					{
						return a.Value;
					}
				}
			} while (a != e.lastAttr);
		}
	}
	return null;
}

GetAttribute(index:number/*int*/):string
{
	if (!IsInteractive)
	{
		return null;
	}
	if (index < 0)
	{
		return null;
	}
	var e: XElement = GetElementInAttributeScope();
	if (e != null)
	{
		var a: XAttribute = e.lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				if (!omitDuplicateNamespaces || !IsDuplicateNamespaceAttribute(a))
				{
					if (index-- == 0)
					{
						return a.Value;
					}
				}
			} while (a != e.lastAttr);
		}
	}
	return null;
}

LookupNamespace(prefix:string):string
{
	if (!IsInteractive)
	{
		return null;
	}
	if (prefix == null)
	{
		return null;
	}
	var e: XElement = GetElementInScope();
	if (e != null)
	{
		var ns: XNamespace = prefix.length == 0 ? e.GetDefaultNamespace() : e.GetNamespaceOfPrefix(prefix);
		if (ns != null)
		{
			return nameTable.Add(ns.NamespaceName);
		}
	}
	return null;
}

MoveToAttribute(name:string):boolean
{
	if (!IsInteractive)
	{
		return false;
	}
	var e: XElement = GetElementInAttributeScope();
	if (e != null)
	{
		string localName, namespaceName;
		GetNameInAttributeScope(name, e, localName:out, namespaceName:out);
		var a: XAttribute = e.lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				if (a.Name.LocalName == localName &&
					a.Name.NamespaceName == namespaceName)
				{
					if (omitDuplicateNamespaces && IsDuplicateNamespaceAttribute(a))
					{
						// If it's a duplicate namespace attribute just act as if it doesn't exist
						return false;
					}
					else
					{
						source = a;
						parent = null;
						return true;
					}
				}
			} while (a != e.lastAttr);
		}
	}
	return false;
}

MoveToAttribute(localName:string, namespaceName:string):boolean
{
	if (!IsInteractive)
	{
		return false;
	}
	var e: XElement = GetElementInAttributeScope();
	if (e != null)
	{
		if (localName == "xmlns")
		{
			if (namespaceName != null && namespaceName.length == 0)
			{
				return false;
			}
			if (namespaceName == XNamespace.xmlnsPrefixNamespace)
			{
				namespaceName = string.Empty;
			}
		}
		var a: XAttribute = e.lastAttr;
		if (a != null)
		{
			do
			{
				a = a.next;
				if (a.Name.LocalName == localName &&
					a.Name.NamespaceName == namespaceName)
				{
					if (omitDuplicateNamespaces && IsDuplicateNamespaceAttribute(a))
					{
						// If it's a duplicate namespace attribute just act as if it doesn't exist
						return false;
					}
					else
					{
						source = a;
						parent = null;
						return true;
					}
				}
			} while (a != e.lastAttr);
		}
	}
	return false;
}

MoveToAttribute(index:number/*int*/):void
{
	if(!IsInteractive)
{
	return;
}
if (index < 0) throw 'ArgumentOutOfRangeException("index")';
var e: XElement = GetElementInAttributeScope();
if (e != null)
{
	var a: XAttribute = e.lastAttr;
	if (a != null)
	{
		do
		{
			a = a.next;
			if (!omitDuplicateNamespaces || !IsDuplicateNamespaceAttribute(a))
			{
				// Only count those which are non-duplicates if we're asked to
				if (index-- == 0)
				{
					source = a;
					parent = null;
					return;
				}
			}
		} while (a != e.lastAttr);
	}
}
throw 'ArgumentOutOfRangeException("index")';
}

MoveToElement():boolean
{
	if (!IsInteractive)
	{
		return false;
	}
	var a: XAttribute = source as XAttribute;
	if (a == null)
	{
		a = parent as XAttribute;
	}
	if (a != null)
	{
		if (a.parent != null)
		{
			source = a.parent;
			parent = null;
			return true;
		}
	}
	return false;
}

MoveToFirstAttribute():boolean
{
	if (!IsInteractive)
	{
		return false;
	}
	var e: XElement = GetElementInAttributeScope();
	if (e != null)
	{
		if (e.lastAttr != null)
		{
			if (omitDuplicateNamespaces)
			{
				var na: object = GetFirstNonDuplicateNamespaceAttribute(e.lastAttr.next);
				if (na == null)
				{
					return false;
				}
				source = na;
			}
			else
			{
				source = e.lastAttr.next;
			}
			return true;
		}
	}
	return false;
}

MoveToNextAttribute():boolean
{
	if (!IsInteractive)
	{
		return false;
	}
	var e: XElement = source as XElement;
	if (e != null)
	{
		if (IsEndElement)
		{
			return false;
		}
		if (e.lastAttr != null)
		{
			if (omitDuplicateNamespaces)
			{
				// Skip duplicate namespace attributes
				// We must NOT modify the this.source until we find the one we're looking for
				//   because if we don't find anything, we need to stay positioned where we're now
				var na: object = GetFirstNonDuplicateNamespaceAttribute(e.lastAttr.next);
				if (na == null)
				{
					return false;
				}
				source = na;
			}
			else
			{
				source = e.lastAttr.next;
			}
			return true;
		}
		return false;
	}
	var a: XAttribute = source as XAttribute;
	if (a == null)
	{
		a = parent as XAttribute;
	}
	if (a != null)
	{
		if (a.parent != null && (<XElement>a.parent).lastAttr != a)
		{
			if (omitDuplicateNamespaces)
			{
				// Skip duplicate namespace attributes
				// We must NOT modify the this.source until we find the one we're looking for
				//   because if we don't find anything, we need to stay positioned where we're now
				var na: object = GetFirstNonDuplicateNamespaceAttribute(a.next);
				if (na == null)
				{
					return false;
				}
				source = na;
			}
			else
			{
				source = a.next;
			}
			parent = null;
			return true;
		}
	}
	return false;
}

Read():boolean
{
	switch (state)
	{
		case ReadState.Initial:
			state = ReadState.Interactive;
			var d: XDocument = source as XDocument;
			if (d != null)
			{
				return ReadIntoDocument(d);
			}
			return true;
		case ReadState.Interactive:
			return Read(false);
		default:
			return false;
	}
}

ReadAttributeValue():boolean
{
	if (!IsInteractive)
	{
		return false;
	}
	var a: XAttribute = source as XAttribute;
	if (a != null)
	{
		return ReadIntoAttribute(a);
	}
	return false;
}

ReadToDescendant(localName:string, namespaceName:string):boolean
{
	if (!IsInteractive)
	{
		return false;
	}
	MoveToElement();
	var c: XElement = source as XElement;
	if (c != null && !c.IsEmpty)
	{
		if (IsEndElement)
		{
			return false;
		}
		foreach(XElement e in c.Descendants())
		{
			if (e.Name.LocalName == localName &&
				e.Name.NamespaceName == namespaceName)
			{
				source = e;
				return true;
			}
		}
		IsEndElement = true;
	}
	return false;
}

ReadToFollowing(localName:string, namespaceName:string):boolean
{
	while (Read())
	{
		var e: XElement = source as XElement;
		if (e != null)
		{
			if (IsEndElement) continue;
			if (e.Name.LocalName == localName && e.Name.NamespaceName == namespaceName)
			{
				return true;
			}
		}
	}
	return false;
}

ReadToNextSibling(localName:string, namespaceName:string):boolean
{
	if (!IsInteractive)
	{
		return false;
	}
	MoveToElement();
	if (source != root)
	{
		var n: XNode = source as XNode;
		if (n != null)
		{
			foreach(XElement e in n.ElementsAfterSelf())
			{
				if (e.Name.LocalName == localName &&
					e.Name.NamespaceName == namespaceName)
				{
					source = e;
					IsEndElement = false;
					return true;
				}
			}
			if (n.parent is XElement)
			{
				source = n.parent;
				IsEndElement = true;
				return false;
			}
		}
		else
		{
			if (parent is XElement)
			{
				source = parent;
				parent = null;
				IsEndElement = true;
				return false;
			}
		}
	}
	return ReadToEnd();
}

ResolveEntity():void
{
}

Skip():void
{
	if(!IsInteractive)
{
	return;
}
Read(true);
}


		/*internal*/  DtdInfo: IDtdInfo
{
	get
	{
		if (this.dtdInfoInitialized)
		{
			return this.dtdInfo;
		}
		else
		{
			this.dtdInfoInitialized = true;
			// If we're on the DocumentType use it directly
			var doctype: XDocumentType = this.source as XDocumentType;
			if (doctype == null)
			{
				// otherwise start from the root 
				// (no need to start from source as we need to walk up the whole tree
				//     looking for the XDocument)
				// and look for the XDocument
				var n: XNode = this.root;
				while (n != null)
				{
					var doc: XDocument = n as XDocument;
					if (doc != null)
					{
						doctype = doc.DocumentType;
						break;
					}
					n = n.parent;
				}
			}
			if (doctype != null)
			{
				this.dtdInfo = doctype.DtdInfo;
			}
			return this.dtdInfo;
		}
	}
}
#endif

boolean IXmlLineInfo.HasLineInfo()
{
	if (IsEndElement)
	{
		// Special case for EndElement - we store the line info differently in this case
		//   we also know that the current node (source) is XElement
		var e: XElement = source as XElement;
		if (e != null)
		{
			return e.Annotation<LineInfoEndElementAnnotation>() != null;
		}
	}
	else
	{
		var li: IXmlLineInfo = source as IXmlLineInfo;
		if (li != null)
		{
			return li.HasLineInfo();
		}
	}
	return false;
}

number/*int*/ IXmlLineInfo.LineNumber
{
	get
	{
		if (IsEndElement)
		{
			// Special case for EndElement - we store the line info differently in this case
			//   we also know that the current node (source) is XElement
			var e: XElement = source as XElement;
			if (e != null)
			{
				var a: LineInfoEndElementAnnotation = e.Annotation<LineInfoEndElementAnnotation>();
				if (a != null)
				{
					return a.lineNumber;
				}
			}
		}
		else
		{
			var li: IXmlLineInfo = source as IXmlLineInfo;
			if (li != null)
			{
				return li.LineNumber;
			}
		}
		return 0;
	}
}

number/*int*/ IXmlLineInfo.LinePosition
{
	get
	{
		if (IsEndElement)
		{
			// Special case for EndElement - we store the line info differently in this case
			//   we also know that the current node (source) is XElement
			var e: XElement = source as XElement;
			if (e != null)
			{
				var a: LineInfoEndElementAnnotation = e.Annotation<LineInfoEndElementAnnotation>();
				if (a != null)
				{
					return a.linePosition;
				}
			}
		}
		else
		{
			var li: IXmlLineInfo = source as IXmlLineInfo;
			if (li != null)
			{
				return li.LinePosition;
			}
		}
		return 0;
	}
}

boolean IsEndElement
{
	get { return parent == source; }
	set { parent = value ? source : null; }
}

boolean IsInteractive
{
	get { return state == ReadState.Interactive; }
}

		static XmlNameTable CreateNameTable()
{
	var nameTable: XmlNameTable = new NameTable();
	nameTable.Add(string.Empty);
	nameTable.Add(XNamespace.xmlnsPrefixNamespace);
	nameTable.Add(XNamespace.xmlPrefixNamespace);
	return nameTable;
}

private GetElementInAttributeScope():XElement
{
	var e: XElement = source as XElement;
	if (e != null)
	{
		if (IsEndElement)
		{
			return null;
		}
		return e;
	}
	var a: XAttribute = source as XAttribute;
	if (a != null)
	{
		return <XElement>a.parent;
	}
	a = parent as XAttribute;
	if (a != null)
	{
		return <XElement>a.parent;
	}
	return null;
}

private GetElementInScope():XElement
{
	var e: XElement = source as XElement;
	if (e != null)
	{
		return e;
	}
	var n: XNode = source as XNode;
	if (n != null)
	{
		return n.parent as XElement;
	}
	var a: XAttribute = source as XAttribute;
	if (a != null)
	{
		return <XElement>a.parent;
	}
	e = parent as XElement;
	if (e != null)
	{
		return e;
	}
	a = parent as XAttribute;
	if (a != null)
	{
		return <XElement>a.parent;
	}
	return null;
}

		static void GetNameInAttributeScope(qualifiedName:string, XElement e, out string localName, out string namespaceName)
{
	if (qualifiedName != null && qualifiedName.length != 0)
	{
		var i: number/*int*/ = qualifiedName.IndexOf(':');
		if (i != 0 && i != qualifiedName.length - 1)
		{
			if (i == -1)
			{
				localName = qualifiedName;
				namespaceName = string.Empty;
				return;
			}
			var ns: XNamespace = e.GetNamespaceOfPrefix(qualifiedName.Substring(0, i));
			if (ns != null)
			{
				localName = qualifiedName.Substring(i + 1, qualifiedName.length - i - 1);
				namespaceName = ns.NamespaceName;
				return;
			}
		}
	}
	localName = null;
	namespaceName = null;
}

private Read(skipContent:boolean):boolean
{
	var e: XElement = source as XElement;
	if (e != null)
	{
		if (e.IsEmpty || IsEndElement || skipContent)
		{
			return ReadOverNode(e);
		}
		return ReadIntoElement(e);
	}
	var n: XNode = source as XNode;
	if (n != null)
	{
		return ReadOverNode(n);
	}
	var a: XAttribute = source as XAttribute;
	if (a != null)
	{
		return ReadOverAttribute(a, skipContent);
	}
	return ReadOverText(skipContent);
}

private ReadIntoDocument(d:XDocument):boolean
{
	var n: XNode = d._content as XNode;
	if (n != null)
	{
		source = n.next;
		return true;
	}
	var s: string = d._content as string;
	if (s != null)
	{
		if (s.length > 0)
		{
			source = s;
			parent = d;
			return true;
		}
	}
	return ReadToEnd();
}

private ReadIntoElement(e:XElement):boolean
{
	var n: XNode = e._content as XNode;
	if (n != null)
	{
		source = n.next;
		return true;
	}
	var s: string = e._content as string;
	if (s != null)
	{
		if (s.length > 0)
		{
			source = s;
			parent = e;
		}
		else
		{
			source = e;
			IsEndElement = true;
		}
		return true;
	}
	return ReadToEnd();
}

private ReadIntoAttribute(a:XAttribute):boolean
{
	source = a.value;
	parent = a;
	return true;
}

private ReadOverAttribute(a:XAttribute, skipContent:boolean):boolean
{
	var e: XElement = <XElement>a.parent;
	if (e != null)
	{
		if (e.IsEmpty || skipContent)
		{
			return ReadOverNode(e);
		}
		return ReadIntoElement(e);
	}
	return ReadToEnd();
}

private ReadOverNode(n:XNode):boolean
{
	if (n == root)
	{
		return ReadToEnd();
	}
	var next: XNode = n.next;
	if (null == next || next == n || n == n.parent._content)
	{
		if (n.parent == null || (n.parent.parent == null && n.parent is XDocument))
		{
			return ReadToEnd();
		}
		source = n.parent;
		IsEndElement = true;
	}
	else
	{
		source = next;
		IsEndElement = false;
	}
	return true;
}

private ReadOverText(skipContent:boolean):boolean
{
	if (parent is XElement)
	{
		source = parent;
		parent = null;
		IsEndElement = true;
		return true;
	}
	if (parent is XAttribute)
	{
		var a: XAttribute = <XAttribute>parent;
		parent = null;
		return ReadOverAttribute(a, skipContent);
	}
	return ReadToEnd();
}

private ReadToEnd():boolean
{
	state = ReadState.EndOfFile;
	return false;
}

/// <summary>
/// Determines if the specified attribute would be a duplicate namespace declaration
///  - one which we already reported on some ancestor, so it's not necessary to report it here
/// </summary>
/// <param name="a">The attribute to test</param>
/// <returns>true if the attribute is a duplicate namespace declaration attribute</returns>
private IsDuplicateNamespaceAttribute(candidateAttribute:XAttribute):boolean
{
	if (!candidateAttribute.IsNamespaceDeclaration)
	{
		return false;
	}
	else
	{
		// Split the method in two to enable inlining of this piece (Which will work for 95% of cases)
		return IsDuplicateNamespaceAttributeInner(candidateAttribute);
	}
}

private IsDuplicateNamespaceAttributeInner(candidateAttribute:XAttribute):boolean
{
	// First of all - if this is an xmlns:xml declaration then it's a duplicate
	//   since xml prefix can't be redeclared and it's declared by default always.
	if (candidateAttribute.Name.LocalName == "xml")
	{
		return true;
	}
	// The algorithm we use is:
	//    Go up the tree (but don't go higher than the root of this reader)
	//    and find the closest namespace declaration attribute which declares the same prefix
	//    If it declares that prefix to the exact same URI as ours does then ours is a duplicate
	//    Note that if we find a namespace declaration for the same prefix but with a different URI, then we don't have a dupe!
	var element: XElement = candidateAttribute.parent as XElement;
	if (element == root || element == null)
	{
		// If there's only the parent element of our attribute, there can be no duplicates
		return false;
	}
	element = element.parent as XElement;
	while (element != null)
	{
		// Search all attributes of this element for the same prefix declaration
		// Trick - a declaration for the same prefix will have the exact same XName - so we can do a quick ref comparison of names
		// (The default ns decl is represented by an XName "xmlns{}", even if you try to create
		//  an attribute with XName "xmlns{http://www.w3.org/2000/xmlns/}" it will fail,
		//  because it's treated as a declaration of prefix "xmlns" which is invalid)
		var a: XAttribute = element.lastAttr;
		if (a != null)
		{
			do
			{
				if (a.name == candidateAttribute.name)
				{
					// Found the same prefix decl
					if (a.Value == candidateAttribute.Value)
					{
						// And it's for the same namespace URI as well - so ours is a duplicate
						return true;
					}
					else
					{
						// It's not for the same namespace URI - which means we have to keep ours
						//   (no need to continue the search as this one overrides anything above it)
						return false;
					}
				}
				a = a.next;
			} while (a != element.lastAttr);
		}
		if (element == root)
		{
			return false;
		}
		element = element.parent as XElement;
	}
	return false;
}

/// <summary>
/// Finds a first attribute (starting with the parameter) which is not a duplicate namespace attribute
/// </summary>
/// <param name="candidate">The attribute to start with</param>
/// <returns>The first attribute which is not a namespace attribute or null if the end of attributes has bean reached</returns>
private GetFirstNonDuplicateNamespaceAttribute(candidate:XAttribute):XAttribute
{
	Debug.Assert(omitDuplicateNamespaces, "This method should only be caled if we're omitting duplicate namespace attribute." +
		"For perf reason it's better to test this flag in the caller method.");
	if (!IsDuplicateNamespaceAttribute(candidate))
	{
		return candidate;
	}

	var e: XElement = candidate.parent as XElement;
	if (e != null && candidate != e.lastAttr)
	{
		do
		{
			candidate = candidate.next;
			if (!IsDuplicateNamespaceAttribute(candidate))
			{
				return candidate;
			}
		} while (candidate != e.lastAttr);
	}
	return null;
}
}

}

