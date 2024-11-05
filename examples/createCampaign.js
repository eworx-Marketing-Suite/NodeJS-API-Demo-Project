import { sendApiRequest, setApiResponseLanguage, setApiSecurityContext, setApiServiceUrl } from '../api.js'
import {
    AB_SPLIT_TEST_SEND_SETTINGS_TYPE, MANUAL_SEND_SETTINGS_TYPE, SECTION_TYPE, CAMPAIGN_TYPE, CampaignType, ProfileType, CLEAR_PROFILE_ACTION_TYPE,
    PROFILE_ADDER_ACTION_TYPE, ExecuteWith, SUBSCRIBER_TYPE, SubscriberStatus, Mailformat, TEXT_FIELD_TYPE, DATE_TIME_FIELD_TYPE, SELECTION_FIELD_TYPE,
    NUMBER_FIELD_TYPE, BOOLEAN_FIELD_TYPE, URL_FIELD_TYPE, MDB_FIELD_TYPE, GUID_FIELD_TYPE, HTML_ENCODED_TEXT_FIELD_TYPE, FieldType, TEMPLATE_TYPE
} from '../constants.js';

//create a campaign based on a existing campaign
async function createCampaign(profileId, campaignName) {
    if (!profileId) {
        throw new Error('profileId is null or undefined');
    }
    // Load the original campaign.
    let originalCampaign = await loadCampaign(campaignName);
    let data = null;

    if (originalCampaign !== null) {

        //Copy the original campaign
        let campaignCopy = await copyCampaign(originalCampaign.Guid);

        //Update the sender, profile, ....
        if (await updateCampaign(campaignCopy, profileId, campaignName)) {
            data = {
                campaignId: campaignCopy.Guid,
                templateId: campaignCopy.TemplateGuid
            };
        }
    }

    return data;
}

// Updates the given campaign (name, senderAddress, senderName, subject...)
// Returns true if the update is succesfull.
async function updateCampaign(campaignToUpdate, profileId, campaignName) {
    let additionalProperties = [
        {
            Name: 'CampaignGuid',
            Value: campaignToUpdate.Guid
        },
        {
            Name: 'ProfileGuid',
            Value: profileId
        },
        {
            Name: 'Name',
            Value: 'Copy of ' + campaignName
        },
        {
            Name: 'SenderAddress',
            Value: 'service@mailworx.info'
        },
        {
            Name: 'SenderName',
            Value: 'mailworx Service Crew'
        },
        {
            Name: 'Subject',
            Value: 'My first newsletter'
        }
    ];

    return (await sendApiRequest('UpdateCampaign', additionalProperties) !== null);
}

//Copies a campaign.
// Returns a copy of the given campaign.
async function copyCampaign(campaignId) {
    let additionalProperties = [
        {
            Name: 'CampaignToCopy',
            Value: campaignId
        }
    ];

    let copyCampaignResponse = await sendApiRequest('CopyCampaign', additionalProperties);

    if (copyCampaignResponse === null) {
        return null;
    }
    else {
        return loadCampaign(null, copyCampaignResponse.NewCampaignGuid);
    }
}

// Loads the campaign with the specified id.
// Returns the campaign according to the campaign name.
async function loadCampaign(campaignName, campaignId = null) {
    let additionalProperties = [{ Name: 'Type', Value: CampaignType.InWork }];
    let campaignResponse;
    let existingCampaign = null;

    if (campaignId === null) { //If there is no campaign id given, then load the campaign by its name.
        campaignResponse = (await sendApiRequest('GetCampaigns', additionalProperties));
        for (const campaign of campaignResponse.Campaigns) {
            if (campaign.Name.toLowerCase() === campaignName.toLowerCase()) {
                existingCampaign = campaign;
                break;
            }
        }

    }
    else { //If there is a campaign id given, then load the campaign by its id.
        additionalProperties.push({ Name: 'Id', Value: campaignId });
        campaignResponse = (await sendApiRequest('GetCampaigns', additionalProperties));

        if (campaignResponse === null || campaignResponse.Campaigns.length === 0) {
            return null;
        }
        else {
            return campaignResponse.Campaigns[0];
        }
    }

    return existingCampaign;
}

export {
    createCampaign
}