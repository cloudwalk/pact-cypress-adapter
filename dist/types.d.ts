import { Interception } from 'cypress/types/net-stubbing';
export declare type AliasType = string | string[];
export declare type AnyObject = {
    [K in string | number]: any;
};
export declare type PactConfigType = {
    consumerName: string;
    providerName: string;
};
export declare type HeaderType = Record<string, string | string[]> | undefined;
declare type BaseXHR = {
    headers: HeaderType;
    body: any | undefined;
};
export declare type Interaction = {
    description: string;
    providerState: string;
    request: {
        method: string;
        path: string;
        query: string;
    } & BaseXHR;
    response: {
        status: string | number | undefined;
        matchingRules?: MatchingRule;
    } & BaseXHR;
};
export declare type XHRRequestAndResponse = {
    request: {
        method: string;
        url: string;
    } & BaseXHR;
    response: {
        statusCode: string | number | undefined;
        statusText: string | undefined;
    } & BaseXHR;
};
declare type Encodings = 'ascii' | 'base64' | 'binary' | 'hex' | 'latin1' | 'utf8' | 'utf-8' | 'ucs2' | 'ucs-2' | 'utf16le' | 'utf-16le' | null;
export declare type RequestOptionType = {
    auth: object;
    body: AnyObject;
    encoding: Encodings;
    followRedirect: boolean;
    form: boolean;
    gzip: boolean;
    headers: object;
    method: string;
    qs: object;
    url: string;
};
export declare type PactFileType = {
    intercept: Interception | XHRRequestAndResponse;
    testCaseTitle: string;
    pactConfig: PactConfigType;
    blocklist?: string[];
    omitList?: string[];
    autoMatching?: boolean;
    content?: any;
};
export declare type MatchingRule = {
    [key: string]: {
        match: string;
    };
};
export {};
