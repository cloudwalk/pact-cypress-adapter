import { AliasType, PactFileType, HeaderType } from 'types';
export declare const formatAlias: (alias: AliasType) => string[];
export declare const writePact: ({ intercept, testCaseTitle, pactConfig, blocklist, omitList, autoMatching }: PactFileType) => void;
export declare const omitHeaders: (headers: HeaderType, blocklist: string[]) => import("lodash").Omit<Record<string, string | string[]>, string>;
export declare const constructPactFile: ({ intercept, testCaseTitle, pactConfig, blocklist, omitList, autoMatching, content }: PactFileType) => any;
export declare const readFileAsync: (fs: any, filename: string) => Promise<any>;
