import {MANUAL_SEND_SETTINGS_TYPE, SendType} from '../constants.js';
import {sendApiRequest} from '../api.js'

async function sendCampaign(campaignId){
    //generate properties for the send campaign request
    let additionalSendCampaignProperties = [
        {
            Name: 'CampaignId',
            Value: campaignId
        },
        {
            Name: 'IgnoreCulture',
            Value: false
        },
        {
            Name: 'SendType',
            Value: SendType.Manual
        },
        {
            Name: 'Settings',
            Value: {
                __type: MANUAL_SEND_SETTINGS_TYPE,
                SendTime: '\/Date(' + Date.parse(new Date()) + ')\/' //convert Date in format the api can handle
            }
        },
        {
            Name: 'UseIRated',
            Value: false
        },
        {
            Name: 'UseRTR',
            Value: true
        }
    ];

    await sendApiRequest('SendCampaign', additionalSendCampaignProperties);
}

export{
    sendCampaign
}
