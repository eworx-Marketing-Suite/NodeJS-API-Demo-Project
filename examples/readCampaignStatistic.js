import {sendApiRequest, setApiResponseLanguage, setApiSecurityContext, setApiServiceUrl} from '../api.js'
 

//Prints campaign statistics to the console.
async function readCampaignStatistic(campaingId){
    let getCampaignsRequestAdditionalProperties = [
        {
            Name: 'Id',
            Value: campaingId
        },
        {
            Name: 'ResponseDetail',
            Value: 1
        }
    ];

    // ResponseDetail = CampaignResponseDetailInfo.BasicInformation -> Get almost all details of the campaign type (without links and sections).
    // ResponseDetail = CampaignResponseDetailInfo.Sections -> Also gets the sections of the campaign.
    // ResponseDetail = CampaignResponseDetailInfo.Links -> Also gets the links of the campaign.
    // ResponseDetail = CampaignResponseDetailInfo.SectionProfiles -> Also gets info about which sections are restricted to which target groups.

    let campaignResponse = await sendApiRequest('GetCampaigns', getCampaignsRequestAdditionalProperties);
    let campaign = campaignResponse.Campaigns[0];

    displayGeneralCampaignInfo(campaign);
    await displayStatistics(campaign);
    await displayBouncesInfo(campaign);
    await displayClickratesInfo(campaign);
    await displayOpeningRatesInfo(campaign);
}

//Prints the campaign info to the console.
function displayGeneralCampaignInfo(campaign){
    let dateString = campaign.Created.substr(6);
    let date = new Date(parseInt(dateString));

    console.log('General info of "' + campaign.Name + '" created on "' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + '"');
    console.log('******************************************************************');
    console.log('Subject: ' + campaign.Subject);
    console.log('Sender: ' + campaign.SenderAdress);
    console.log('Profile name: ' + campaign.ProfileName);
    console.log('Culture: ' + campaign.Culture);
    console.log('Notify address: ' +campaign.NotifyAdress)
    console.log('******************************************************************');
    console.log('');
}

//Prints the campaign statistics to the console.
async function displayStatistics(campaign){
    let statisticsRequestAdditionalProperties = [
        {
            Name: 'CampaignGuid',
            Value: campaign.Guid
        }
    ];
    let statisticsResponse = await sendApiRequest('GetCampaignStatistics', statisticsRequestAdditionalProperties);
    
    console.log('Statistics of ' + campaign.Name)
    console.log('******************************************************************');
    console.log('Sent mails: ' + statisticsResponse.TotalMails);
    console.log('Opened mails: ' + statisticsResponse.OpenedMails);
    console.log('Bounce mails: ' + statisticsResponse.BounceMails);
    console.log('Amount of clicks: ' + statisticsResponse.Clicks);
    console.log('******************************************************************');
    console.log('');
}

//Prints the bounce infos to the console.
async function displayBouncesInfo(campaign) {
    let bouncesAdditionalProperties = [
        {
            Name: 'CampaignGuid',
            Value: campaign.Guid
        }
    ];

    let bounceInfo = await sendApiRequest('GetBouncesOfCampaign', bouncesAdditionalProperties);

    console.log('Bounces statistics of ' + campaign.Name);
    console.log('******************************************************************');
    console.log('Subscribers:');
    for(const subscriber of bounceInfo.Subscribers){
        console.log('Guid of Subscriber: ' + subscriber.Guid);
    }
    console.log('******************************************************************');
    console.log('');
}

//Prints the click rates info to the console.
async function  displayClickratesInfo(campaign){
    let clickratesAdditionalProperties = [
        {
            Name: 'CampaignGuid',
            Value: campaign.Guid
        }
    ];

    let clickratesInfo = await sendApiRequest('GetClickRatesOfCampaign', clickratesAdditionalProperties);

    console.log('Click rates statistics of ' + campaign.Name);
    console.log('******************************************************************');
    console.log('Clicked links:');
    console.log('');
    for(const statisticLink of clickratesInfo.ClickedLinks){
        console.log('Linkname: ' + statisticLink.LinkName);
        console.log('Clicks: ' + statisticLink.Clicks);
        console.log('Url: ' + statisticLink.Url);
        console.log('-------------------------------------------------------------------');
        console.log('');
    }
    console.log('******************************************************************');
    console.log('');
}

//Prints the opening rates to the console.
async function displayOpeningRatesInfo(campaign){
    let openingRatesAdditionalProperties = [
        {
            Name: 'CampaignGuid',
            Value: campaign.Guid
        }
    ];

    let openingRatesInfo = await sendApiRequest('GetOpeningRatesOfCampaign', openingRatesAdditionalProperties);

    console.log('Opening rates statistics of ' + campaign.Name); 
    console.log('******************************************************************');
    console.log('Openend maiils:');
    for(const openedMailInfo of openingRatesInfo.Openings){
        console.log('State:' + openedMailInfo.ReadingState);
        console.log('Opened at: ' + openedMailInfo.OpenedAt);
        console.log('Reading state specified: ' + openedMailInfo.ReadingStateSpecified);
        console.log('-------------------------------------------------------------------');
    }
    console.log('******************************************************************');
    console.log('');
}
export{
    readCampaignStatistic
}