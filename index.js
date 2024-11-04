import {sendApiRequest, setApiResponseLanguage, setApiSecurityContext, setApiServiceUrl} from './api.js'
import { securityContextPrompt, campaignPrompt } from './prompts.js';
import { importSubscribers } from './examples/importSubscribers.js';
import { createCampaign } from './examples/createCampaign.js';
import {readCampaignStatistic} from './examples/readCampaignStatistic.js';
import { createSection } from './examples/createSection.js';
import { sendCampaign } from './examples/sendCampaign.js';

//please note that these examples are made for responseLanguage -> EN
setApiResponseLanguage('EN');
setApiServiceUrl('https://mailworx.marketingsuite.info/Services/JSON/ServiceAgent.svc');
let securityContext = securityContextPrompt()
setApiSecurityContext(securityContext.account, securityContext.username, securityContext.password, securityContext.source);
let campaignName = campaignPrompt(); 

let importResponse = await importSubscribers('apiTestImport');
let createCampaignResponse = await createCampaign(importResponse.profileId, campaignName);
let createSectionResponse = await createSection(createCampaignResponse.templateId, createCampaignResponse.campaignId);
let readCampaignStatisticResponse = await readCampaignStatistic(createCampaignResponse.campaignId);

if(createSectionResponse){
    await sendCampaign(createCampaignResponse.campaignId);
}

console.log('Process finished!');