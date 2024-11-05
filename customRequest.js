import { sendApiRequest, setApiResponseLanguage, setApiSecurityContext, setApiServiceUrl } from './api.js'
import { securityContextPrompt, languagePrompt, serviceUrlPrompt, additionalPropertiesPrompt, methodPrompt } from './prompts.js';

//set language -> if nothing is entered the dafault value will be chosen.
let language = languagePrompt();
setApiResponseLanguage(language ?? null);

//set api service url -> if nothing is entered the dafault value will be chosen.
let serviceUrl = serviceUrlPrompt();
setApiServiceUrl(serviceUrl ?? null);

//set security context
let securityContext = securityContextPrompt();
setApiSecurityContext(securityContext.account, securityContext.username, securityContext.password, securityContext.source);

//set name of method that should be executed by the api.
let methodName = methodPrompt();

//set additional properties
let additionalProperties = additionalPropertiesPrompt();
let response = await sendApiRequest(methodName, additionalProperties);
console.log(response);
