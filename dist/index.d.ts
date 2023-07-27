import { AliasType, AnyObject, PactConfigType } from 'types';
declare global {
    namespace Cypress {
        interface Chainable {
            usePactWait: (alias: AliasType, omitList?: string[], autoMatching?: boolean) => Chainable;
            usePactRequest: (option: AnyObject, alias: string) => Chainable;
            usePactGet: (alias: string, pactConfig: PactConfigType) => Chainable;
            setupPact: (consumerName: string, providerName: string) => Chainable<null>;
            setupPactHeaderBlocklist: (headers: string[]) => Chainable<null>;
        }
    }
}
