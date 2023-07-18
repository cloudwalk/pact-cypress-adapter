import { Interception } from 'cypress/types/net-stubbing'
import { uniqBy, reverse, omit } from 'lodash'
import { AliasType, Interaction, PactConfigType, XHRRequestAndResponse, PactFileType, HeaderType, MatchingRule } from 'types'
const pjson = require('../package.json')
export const formatAlias = (alias: AliasType) => {
  if (Array.isArray(alias)) {
    return [...alias].map((a) => `@${a}`)
  }
  return [`@${alias}`]
}

const constructFilePath = ({ consumerName, providerName }: PactConfigType) =>
  `cypress/pacts/${providerName}-${consumerName}.json`

export const writePact = ({ intercept, testCaseTitle, pactConfig, blocklist, omitList, autoMatching }: PactFileType) => {
  const filePath = constructFilePath(pactConfig)
  cy.task('readFile', filePath)
    .then((content) => {
      if (content) {
        const parsedContent = JSON.parse(content as string)
        return constructPactFile({ intercept, testCaseTitle, pactConfig, blocklist, omitList, autoMatching, content: parsedContent })
      } else {
        return constructPactFile({ intercept, testCaseTitle, pactConfig, blocklist, omitList, autoMatching })
      }
    })
    .then((data) => {
      cy.writeFile(filePath, JSON.stringify(data))
    })
    .then(() => {
      return intercept
    })
}

function omitElementsFromResponseBody(responseBody: any, elementsToOmit: string[]): any {
  function omitElement(obj: any, key: string) {
    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        omitElement(item, key);
      });
    } else if (typeof obj === "object" && obj !== null) {
      for (const objKey in obj) {
        if (objKey === key) {
          delete obj[key];
        } else {
          omitElement(obj[objKey], key);
        }
      }
    }
  }

  elementsToOmit.forEach((element) => {
    omitElement(responseBody, element);
  });

  return responseBody;
}

export const omitHeaders = (headers: HeaderType, blocklist: string[]) => {
  return omit(headers, [...blocklist])
}

const constructInteraction = (
  intercept: Interception | XHRRequestAndResponse,
  testTitle: string,
  blocklist: string[],
  omitList: string[],
  autoMatching: boolean
): Interaction => {
  const path = new URL(intercept.request.url).pathname
  const search = new URL(intercept.request.url).search
  const query = new URLSearchParams(search).toString()
  const responseBody = omitElementsFromResponseBody(intercept.response?.body, omitList);
  const generatedRules = generateMatchingRules(responseBody, "$.body");

  const interation: Interaction = {
    description: testTitle,
    providerState: '',
    request: {
      method: intercept.request.method,
      path: path,
      headers: omitHeaders(intercept.request.headers, blocklist),
      body: intercept.request.body,
      query: query
    },
    response: {
      status: intercept.response?.statusCode,
      headers: omitHeaders(intercept.response?.headers, blocklist),
      body: responseBody,
    }
  }

  if (autoMatching) { interation.response.matchingRules = generatedRules }

  return interation
}

function generateMatchingRules(responseBody: any, parentPath = "$.body"): MatchingRule {
  const matchingRules: MatchingRule = {};

  function traverseObject(obj: any, path: string = "") {
    if (typeof obj === "object" && !Array.isArray(obj)) {
      for (const key in obj) {
        const newPath = path ? `${path}.${key}` : key;
        traverseObject(obj[key], newPath);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const newPath = `${path}[${index}]`;
        traverseObject(item, newPath);
      });
    } else {
      const rulePath = `${parentPath}.${path}`;
      matchingRules[rulePath] = { match: "type" };
    }
  }

  traverseObject(responseBody);

  return matchingRules;
}

export const constructPactFile = ({ intercept, testCaseTitle, pactConfig, blocklist = [], omitList = [], autoMatching = false, content }: PactFileType) => {
  const pactSkeletonObject = {
    consumer: { name: pactConfig.consumerName },
    provider: { name: pactConfig.providerName },
    interactions: [],
    metadata: {
      pactSpecification: {
        version: '2.0.0'
      },
      client: {
        name: 'pact-cypress-adapter',
        version: pjson.version
      }
    }
  }

  if (content) {
    const interactions = [...content.interactions, constructInteraction(intercept, testCaseTitle, blocklist, omitList, autoMatching)]
    const nonDuplicatesInteractions = reverse(uniqBy(reverse(interactions), 'description'))
    const data = {
      ...pactSkeletonObject,
      ...content,
      interactions: nonDuplicatesInteractions
    }
    return data
  }

  return {
    ...pactSkeletonObject,
    interactions: [...pactSkeletonObject.interactions, constructInteraction(intercept, testCaseTitle, blocklist, omitList, autoMatching)]
  }
}

const isFileExisted = async (fs: any, filename: string) => !!(await fs.stat(filename).catch((e: any) => false))
export const readFileAsync = async (fs: any, filename: string) => {
  if (await isFileExisted(fs, filename)) {
    const data = await fs.readFile(filename, 'utf8')
    return data
  }
  return null
}
