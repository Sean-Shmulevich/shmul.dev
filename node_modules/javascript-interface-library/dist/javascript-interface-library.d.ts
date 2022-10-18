/**** get a reference to the "global" object ****/
export declare const global: any;
/**** Object_hasOwnProperty ****/
export declare function Object_hasOwnProperty(Value: Object, PropertyName: string): boolean;
/**** Object_isPrototypeOf ****/
export declare function Object_isPrototypeOf(Value: Object, Candidate: any): boolean;
/**** Object_propertyIsEnumerable ****/
export declare function Object_propertyIsEnumerable(Value: Object, PropertyName: string): boolean;
/**** Object_toString ****/
export declare function Object_toString(Value: Object): string;
/**** Object_toLocaleString ****/
export declare function Object_toLocaleString(Value: Object): string;
/**** Object_valueOf ****/
export declare function Object_valueOf(Value: Object): any;
/**** ObjectMergedWith ****/
export declare function ObjectMergedWith(TargetObject: object, ...otherObjectList: object[]): object;
/**** throwError - simplifies construction of named errors ****/
export declare function throwError(Message: string): never;
/**** ValueExists ****/
export declare function ValueExists(Value: any): boolean;
/**** ValueIsMissing ****/
export declare function ValueIsMissing(Value: any): boolean;
/**** ValueIsBoolean ****/
export declare function ValueIsBoolean(Value: any): boolean;
/**** ValueIsNumber ****/
export declare function ValueIsNumber(Value: any): boolean;
/**** ValueIsFiniteNumber (pure "isFinite" breaks on objects) ****/
export declare function ValueIsFiniteNumber(Value: any): boolean;
/**** ValueIsNaN (numeric, but NaN - this differs from pure "isNaN") ****/
export declare function ValueIsNaN(Value: any): boolean;
/**** ValueIsNumberInRange ****/
export declare function ValueIsNumberInRange(Value: any, minValue?: number, maxValue?: number, withMin?: boolean, withMax?: boolean): boolean;
/**** ValueIsInteger ****/
export declare function ValueIsInteger(Value: any): boolean;
/**** ValueIsIntegerInRange ****/
export declare function ValueIsIntegerInRange(Value: any, minValue?: number, maxValue?: number): boolean;
/**** ValueIsOrdinal ****/
export declare function ValueIsOrdinal(Value: any): boolean;
/**** ValueIsCardinal ****/
export declare function ValueIsCardinal(Value: any): boolean;
/**** ValueIsString ****/
export declare function ValueIsString(Value: any): boolean;
export declare function ValueIsEmptyString(Value: any): boolean;
export declare function ValueIsNonEmptyString(Value: any): boolean;
/**** ValueIsStringMatching ****/
export declare function ValueIsStringMatching(Value: any, Pattern: RegExp): boolean;
export declare function ValueIsText(Value: any): boolean;
export declare function ValueIsTextline(Value: any): boolean;
/**** ValueIsFunction ****/
export declare function ValueIsFunction(Value: any): boolean;
/**** ValueIsAnonymousFunction ****/
export declare function ValueIsAnonymousFunction(Value: any): boolean;
/**** ValueIsNamedFunction ****/
export declare function ValueIsNamedFunction(Value: any): boolean;
/**** ValueIsNativeFunction ****/
export declare function ValueIsNativeFunction(Value: any): boolean;
/**** ValueIsScriptedFunction ****/
export declare function ValueIsScriptedFunction(Value: any): boolean;
/**** ValueIsObject ****/
export declare function ValueIsObject(Value: any): boolean;
/**** ValueIsPlainObject ****/
export declare function ValueIsPlainObject(Value: any): boolean;
/**** ValueIsVanillaObject ****/
export declare function ValueIsVanillaObject(Value: any): boolean;
/**** ValueIsArray ****/
export declare let ValueIsArray: (arg: any) => arg is any[];
/**** ValueIsList ("dense" array) ****/
export declare function ValueIsList(Value: any, minLength?: number, maxLength?: number): boolean;
/**** ValueIsListSatisfying ****/
export declare function ValueIsListSatisfying(Value: any, Validator: Function, minLength?: number, maxLength?: number): boolean;
/**** ValueIsInstanceOf ****/
export declare function ValueIsInstanceOf(Value: any, Constructor: Function): boolean;
/**** ValueInheritsFrom ****/
export declare function ValueInheritsFrom(Value: any, Prototype: Object): boolean;
/**** ValueIsDate ****/
export declare function ValueIsDate(Value: any): boolean;
/**** ValueIsError ****/
export declare function ValueIsError(Value: any): boolean;
/**** ValueIsPromise ****/
export declare function ValueIsPromise(Value: any): boolean;
/**** ValueIsRegExp ****/
export declare function ValueIsRegExp(Value: any): boolean;
/**** ValueIsOneOf ****/
export declare function ValueIsOneOf(Value: any, ValueList: any[]): boolean;
/**** ValueIsColor ****/
export declare function ValueIsColor(Value: any): boolean;
export declare function ValueIsEMailAddress(Value: any): boolean;
export declare function ValueIsURL(Value: any): boolean;
export declare const rejectNil = false;
export declare const acceptNil = true;
/**** validatedArgument ****/
export declare function validatedArgument(Description: string, Argument: any, ValueIsValid: (Value: any) => boolean, NilIsAcceptable: boolean, Expectation: string): any | null | undefined;
/**** ValidatorForClassifier ****/
export declare function ValidatorForClassifier(Classifier: (Value: any) => boolean, NilIsAcceptable: boolean, Expectation: string): Function;
/**** FunctionWithName (works with older JS engines as well) ****/
export declare function FunctionWithName(originalFunction: Function, desiredName: string | String): Function;
/**** expect[ed]Value ****/
export declare function expectValue(Description: string, Argument: any): any;
export declare const expectedValue: typeof expectValue;
/**** allow/expect[ed]Boolean ****/
export declare const allowBoolean: Function, allowedBoolean: Function;
export declare const expectBoolean: Function, expectedBoolean: Function;
/**** allow/expect[ed]Number ****/
export declare const allowNumber: Function, allowedNumber: Function;
export declare const expectNumber: Function, expectedNumber: Function;
/**** allow/expect[ed]FiniteNumber ****/
export declare const allowFiniteNumber: Function, allowedFiniteNumber: Function;
export declare const expectFiniteNumber: Function, expectedFiniteNumber: Function;
/**** allow/expect[ed]NaN ****/
export declare const allowNaN: Function, allowedNaN: Function;
export declare const expectNaN: Function, expectedNaN: Function;
/**** allow[ed]NumberInRange ****/
export declare function allowNumberInRange(Description: string, Argument: any, minValue?: number, maxValue?: number, withMin?: boolean, withMax?: boolean): number | null | undefined;
export declare const allowedNumberInRange: typeof allowNumberInRange;
/**** expect[ed]NumberInRange ****/
export declare function expectNumberInRange(Description: string, Argument: any, minValue?: number, maxValue?: number, withMin?: boolean, withMax?: boolean): number;
export declare const expectedNumberInRange: typeof expectNumberInRange;
/**** allow/expect[ed]Integer ****/
export declare const allowInteger: Function, allowedInteger: Function;
export declare const expectInteger: Function, expectedInteger: Function;
/**** allow[ed]IntegerInRange ****/
export declare function allowIntegerInRange(Description: string, Argument: any, minValue?: number, maxValue?: number): number | null | undefined;
export declare const allowedIntegerInRange: typeof allowIntegerInRange;
/**** expect[ed]IntegerInRange ****/
export declare function expectIntegerInRange(Description: string, Argument: any, minValue?: number, maxValue?: number): number;
export declare const expectedIntegerInRange: typeof expectIntegerInRange;
/**** allow/expect[ed]Ordinal ****/
export declare const allowOrdinal: Function, allowedOrdinal: Function;
export declare const expectOrdinal: Function, expectedOrdinal: Function;
/**** allow/expect[ed]Cardinal ****/
export declare const allowCardinal: Function, allowedCardinal: Function;
export declare const expectCardinal: Function, expectedCardinal: Function;
/**** allow/expect[ed]String ****/
export declare const allowString: Function, allowedString: Function;
export declare const expectString: Function, expectedString: Function;
/**** allow/expect[ed]NonEmptyString ****/
export declare const allowNonEmptyString: Function, allowedNonEmptyString: Function;
export declare const expectNonEmptyString: Function, expectedNonEmptyString: Function;
/**** allow[ed]StringMatching ****/
export declare function allowStringMatching(Description: string, Argument: any, Pattern: RegExp): string | null | undefined;
export declare const allowedStringMatching: typeof allowStringMatching;
/**** expect[ed]StringMatching ****/
export declare function expectStringMatching(Description: string, Argument: any, Pattern: RegExp): string;
export declare const expectedStringMatching: typeof expectStringMatching;
/**** allow/expect[ed]Text ****/
export declare const allowText: Function, allowedText: Function;
export declare const expectText: Function, expectedText: Function;
/**** allow/expect[ed]Textline ****/
export declare const allowTextline: Function, allowedTextline: Function;
export declare const expectTextline: Function, expectedTextline: Function;
/**** allow/expect[ed]Function ****/
export declare const allowFunction: Function, allowedFunction: Function;
export declare const expectFunction: Function, expectedFunction: Function;
/**** allow/expect[ed]AnonymousFunction ****/
export declare const allowAnonymousFunction: Function, allowedAnonymousFunction: Function;
export declare const expectAnonymousFunction: Function, expectedAnonymousFunction: Function;
/**** allow/expect[ed]NamedFunction ****/
export declare const allowNamedFunction: Function, allowedNamedFunction: Function;
export declare const expectNamedFunction: Function, expectedNamedFunction: Function;
/**** allow/expect[ed]NativeFunction ****/
export declare const allowNativeFunction: Function, allowedNativeFunction: Function;
export declare const expectNativeFunction: Function, expectedNativeFunction: Function;
/**** allow/expect[ed]ScriptedFunction ****/
export declare const allowScriptedFunction: Function, allowedScriptedFunction: Function;
export declare const expectScriptedFunction: Function, expectedScriptedFunction: Function;
/**** allow/expect[ed]Object ****/
export declare const allowObject: Function, allowedObject: Function;
export declare const expectObject: Function, expectedObject: Function;
/**** allow/expect[ed]PlainObject ****/
export declare const allowPlainObject: Function, allowedPlainObject: Function;
export declare const expectPlainObject: Function, expectedPlainObject: Function;
/**** allow/expect[ed]VanillaObject ****/
export declare const allowVanillaObject: Function, allowedVanillaObject: Function;
export declare const expectVanillaObject: Function, expectedVanillaObject: Function;
/**** allow[ed]Array ****/
export declare function allowArray(Description: string, Argument: any): any[] | null | undefined;
export declare const allowedArray: typeof allowArray;
/**** expect[ed]Array ****/
export declare function expectArray(Description: string, Argument: any): any[];
export declare const expectedArray: typeof expectArray;
/**** allow[ed]List ****/
export declare function allowList(Description: string, Argument: any, Expectation?: string, minLength?: number, maxLength?: number): any[] | null | undefined;
export declare const allowedList: typeof allowList;
/**** expect[ed]List ****/
export declare function expectList(Description: string, Argument: any, Expectation?: string, minLength?: number, maxLength?: number): any[];
export declare const expectedList: typeof expectList;
/**** allow[ed]ListSatisfying ****/
export declare function allowListSatisfying(Description: string, Argument: any, Validator: (Value: any) => boolean, Expectation?: string, minLength?: number, maxLength?: number): any[] | null | undefined;
export declare const allowedListSatisfying: typeof allowListSatisfying;
/**** expect[ed]ListSatisfying ****/
export declare function expectListSatisfying(Description: string, Argument: any, Validator: (Value: any) => boolean, Expectation?: string, minLength?: number, maxLength?: number): any[];
export declare const expectedListSatisfying: typeof expectListSatisfying;
/**** allow[ed]InstanceOf ****/
export declare function allowInstanceOf(Description: string, Argument: any, constructor: Function, Expectation: string): any | null | undefined;
export declare const allowedInstanceOf: typeof allowInstanceOf;
/**** expect[ed]InstanceOf ****/
export declare function expectInstanceOf(Description: string, Argument: any, constructor: Function, Expectation: string): any;
export declare const expectedInstanceOf: typeof expectInstanceOf;
/**** allow[ed]ValueInheritingFrom ****/
export declare function allowValueInheritingFrom(Description: string, Argument: any, prototype: any, Expectation: string): any | null | undefined;
export declare const allowedValueInheritingFrom: typeof allowValueInheritingFrom;
/**** expect[ed]ValueInheritingFrom ****/
export declare function expectValueInheritingFrom(Description: string, Argument: any, prototype: any, Expectation: string): any;
export declare const expectedValueInheritingFrom: typeof expectValueInheritingFrom;
/**** allow/expect[ed]Date ****/
export declare const allowDate: Function, allowedDate: Function;
export declare const expectDate: Function, expectedDate: Function;
/**** allow/expect[ed]Error ****/
export declare const allowError: Function, allowedError: Function;
export declare const expectError: Function, expectedError: Function;
/**** allow/expect[ed]Promise ****/
export declare const allowPromise: Function, allowedPromise: Function;
export declare const expectPromise: Function, expectedPromise: Function;
/**** allow/expect[ed]RegExp ****/
export declare const allowRegExp: Function, allowedRegExp: Function;
export declare const expectRegExp: Function, expectedRegExp: Function;
/**** allow[ed]OneOf ****/
export declare function allowOneOf(Description: string, Argument: any, ValueList: any[]): any | null | undefined;
export declare const allowedOneOf: typeof allowOneOf;
/**** expect[ed]OneOf ****/
export declare function expectOneOf(Description: string, Argument: any, ValueList: any[]): any;
export declare const expectedOneOf: typeof expectOneOf;
/**** allow/expect[ed]Color ****/
export declare const allowColor: Function, allowedColor: Function;
export declare const expectColor: Function, expectedColor: Function;
/**** allow/expect[ed]EMailAddress ****/
export declare const allowEMailAddress: Function, allowedEMailAddress: Function;
export declare const expectEMailAddress: Function, expectedEMailAddress: Function;
/**** allow/expect[ed]URL ****/
export declare const allowURL: Function, allowedURL: Function;
export declare const expectURL: Function, expectedURL: Function;
/**** escaped - escapes all control characters in a given string ****/
export declare function escaped(Text: string): string;
/**** unescaped - evaluates all escape sequences in a given string ****/
export declare function unescaped(Text: string): string;
/**** quotable - makes a given string ready to be put in single/double quotes ****/
export declare function quotable(Text: string, Quote?: '"' | "'"): string;
/**** quoted ****/
export declare function quoted(Text: string, Quote?: '"' | "'"): string;
/**** HTMLsafe ****/
export declare function HTMLsafe(Argument: string, EOLReplacement?: string): string;
/**** MarkDownSafe ****/
export declare function MarkDownSafe(Argument: string, EOLReplacement?: string): string;
/**** ValuesDiffer ****/
export declare function ValuesDiffer(thisValue: any, otherValue: any, Mode?: 'by-value' | 'by-reference' | undefined): boolean;
/**** ValuesAreEqual ****/
export declare function ValuesAreEqual(thisValue: any, otherValue: any, Mode?: 'by-value' | 'by-reference' | undefined): boolean;
/**** ObjectIsEmpty ****/
export declare function ObjectIsEmpty(Candidate: any): boolean;
/**** ObjectIsNotEmpty ****/
export declare function ObjectIsNotEmpty(Candidate: any): boolean;
/**** StringIsEmpty ****/
export declare function StringIsEmpty(Candidate: string): boolean;
/**** StringIsNotEmpty ****/
export declare function StringIsNotEmpty(Candidate: string): boolean;
/**** constrained ****/
export declare function constrained(Value: number, Minimum?: number, Maximum?: number): number;
export declare const ColorSet: {
    transparent: string;
    aliceblue: string;
    lightpink: string;
    antiquewhite: string;
    lightsalmon: string;
    aqua: string;
    lightseagreen: string;
    aquamarine: string;
    lightskyblue: string;
    azure: string;
    lightslategray: string;
    beige: string;
    lightslategrey: string;
    bisque: string;
    lightsteelblue: string;
    black: string;
    lightyellow: string;
    blanchedalmond: string;
    lime: string;
    blue: string;
    limegreen: string;
    blueviolet: string;
    linen: string;
    brown: string;
    magenta: string;
    burlywood: string;
    maroon: string;
    cadetblue: string;
    mediumaquamarine: string;
    chartreuse: string;
    mediumblue: string;
    chocolate: string;
    mediumorchid: string;
    coral: string;
    mediumpurple: string;
    cornflowerblue: string;
    mediumseagreen: string;
    cornsilk: string;
    mediumslateblue: string;
    crimson: string;
    mediumspringgreen: string;
    cyan: string;
    mediumturquoise: string;
    darkblue: string;
    mediumvioletred: string;
    darkcyan: string;
    midnightblue: string;
    darkgoldenrod: string;
    mintcream: string;
    darkgray: string;
    mistyrose: string;
    darkgreen: string;
    moccasin: string;
    darkgrey: string;
    navajowhite: string;
    darkkhaki: string;
    navy: string;
    darkmagenta: string;
    oldlace: string;
    darkolivegreen: string;
    olive: string;
    darkorange: string;
    olivedrab: string;
    darkorchid: string;
    orange: string;
    darkred: string;
    orangered: string;
    darksalmon: string;
    orchid: string;
    darkseagreen: string;
    palegoldenrod: string;
    darkslateblue: string;
    palegreen: string;
    darkslategray: string;
    paleturquoise: string;
    darkslategrey: string;
    palevioletred: string;
    darkturquoise: string;
    papayawhip: string;
    darkviolet: string;
    peachpuff: string;
    deeppink: string;
    peru: string;
    deepskyblue: string;
    pink: string;
    dimgray: string;
    plum: string;
    dimgrey: string;
    powderblue: string;
    dodgerblue: string;
    purple: string;
    firebrick: string;
    red: string;
    floralwhite: string;
    rosybrown: string;
    forestgreen: string;
    royalblue: string;
    fuchsia: string;
    saddlebrown: string;
    gainsboro: string;
    salmon: string;
    ghostwhite: string;
    sandybrown: string;
    gold: string;
    seagreen: string;
    goldenrod: string;
    seashell: string;
    gray: string;
    sienna: string;
    green: string;
    silver: string;
    greenyellow: string;
    skyblue: string;
    grey: string;
    slateblue: string;
    honeydew: string;
    slategray: string;
    hotpink: string;
    slategrey: string;
    indianred: string;
    snow: string;
    indigo: string;
    springgreen: string;
    ivory: string;
    steelblue: string;
    khaki: string;
    tan: string;
    lavender: string;
    teal: string;
    lavenderblush: string;
    thistle: string;
    lawngreen: string;
    tomato: string;
    lemonchiffon: string;
    turquoise: string;
    lightblue: string;
    violet: string;
    lightcoral: string;
    wheat: string;
    lightcyan: string;
    white: string;
    lightgoldenrodyellow: string;
    whitesmoke: string;
    lightgray: string;
    yellow: string;
    lightgreen: string;
    yellowgreen: string;
    lightgrey: string;
};
/**** HexColor - converts a given color to #rrggbbaa ****/
export declare function HexColor(Color: string): string;
/**** RGBAColor - converts a given color to RGBA(r,g,b,a) ****/
export declare function RGBAColor(Color: string): string;
/**** shortHexColor - converts a given color into #RRGGBB ****/
export declare function shortHexColor(Color: string): string;
