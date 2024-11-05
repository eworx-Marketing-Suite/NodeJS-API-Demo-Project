# Node.js-API-Demo-Project
Sample implementation for consuming eworx Marketing Suite (eMS) API.

This demo project shows how to consume the eMS SOAP API, how to create and send campaigns and read statistic data.

There are several methods available and implemented for importing new subscribers, reading the available subscriber metadata, adding them to a certain subscriber group (profile), reading or updating campaigns etc.
Further descriptions of the eMS api can be found here: https://www.eworx.at/doku/api-schnittstellenbeschreibung/ (Documentation in German).

If you don't have access to the API, you can register your application here: https://www.eworx.at/doku/api-schnittstellenbeschreibung/#zugang-zur-api-anlegen

The name of the application registered is the one used for credentials of the service agent.

Here is a brief step by step example:

1. Preparation to use the API
2. Import the subscribers into eworx Marketing Suite
3. Create a campaign
4. Add content to the campaign
5. Send the campaign to the imported subscribers
6. Read campaign statistic data.

## 1. Preparation

First import the 'sendApiRequest function' and set language, security context(credentials) and service url

| Login Data    | Instructions                                           |
|---------------|--------------------------------------------------------|
| Account       | Account name (Mandant) of the eMS to login             |
| Username      | User name to use to login                              |
| Password      | The user's password                                    |
| Application   | The name of the registered application                 |

##### SendApiRequest function and set values
```js
import {sendApiRequest, setApiResponseLanguage, setApiSecurityContext, setApiServiceUrl} from './api.js'

setApiResponseLanguage('EN');
setApiSecurityContext('[Account]', '[Username]', '[Password]', '[Application]');
setApiServiceUrl('https://mailworx.marketingsuite.info/Services/JSON/ServiceAgent.svc');

//Create additional properties to use in request -> use the documentation to determine what properties
//are needed for a specific function
let additionalProperties = [
    {
        Name: 'ResponseDetail',
        Value: 5
    },
    {
        Name: 'Id',
        Value: '[CampaignId]'
    }
]

//simple api request
let response = await sendApiRequest('GetCampaigns', additionalProperties);
```

## 2. Import the subscribers

Use [importSubscribers](./examples/importSubscribers.js) to do all the necessary import steps and get a list of the imported data.

## 3. Create a campaign

Use [createCampaign](./examples/createCampaign.js) to create a campaign and get the ids for the campaign and the used template.

## 4. Add content to the campaign

In [createSection](./examples/createSection.js) you generate the content sections.
Please do note that the section definition names may vary with different ResponseLanguage settings.

## 5. Send the campaign to the imported subscribers

Create a request to send the created campaign. Use sendApiRequest to send it out to the subscribers.

After the campaign is sent, you should see the preview of the content in the campaign editor.

![Sent campaign preview](./screenshots/SentCampaignPreview.png)

## 6. Read campaign statistic data

After the campaign is sent, display the campaign statistic data.

According to the campaign you should get something like this:

![Campaign statistics](./screenshots/CampaignStatistic.png)

![Campaign click rates](./screenshots/ClickRatesStatistic.png)

Create requests to call the API methods you want to to use. Then process the data as you need.