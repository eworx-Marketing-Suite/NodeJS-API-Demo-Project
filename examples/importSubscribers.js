import {sendApiRequest, setApiResponseLanguage, setApiSecurityContext, setApiServiceUrl} from '../api.js'
import {
    AB_SPLIT_TEST_SEND_SETTINGS_TYPE, MANUAL_SEND_SETTINGS_TYPE, SECTION_TYPE, CAMPAIGN_TYPE, CampaignType, ProfileType, CLEAR_PROFILE_ACTION_TYPE, 
    PROFILE_ADDER_ACTION_TYPE, ExecuteWith, SUBSCRIBER_TYPE, SubscriberStatus, Mailformat, TEXT_FIELD_TYPE, DATE_TIME_FIELD_TYPE, SELECTION_FIELD_TYPE,
    NUMBER_FIELD_TYPE, BOOLEAN_FIELD_TYPE, URL_FIELD_TYPE, MDB_FIELD_TYPE, GUID_FIELD_TYPE, HTML_ENCODED_TEXT_FIELD_TYPE, FieldType, TEMPLATE_TYPE
} from '../constants.js';

//Exampe of how to import an array of Subscribers
async function importSubscribers(profileName){
    let importRequestAdditionalProperties = [];
    
    //Get the profile with the specified name -> null if it does not exist
    let profile = await loadProfile(profileName);

    //If there is already a profile with that name all current subscribers of that profile have to be removed
    if (profile) {
        //This action will take place before the import has started.
        importRequestAdditionalProperties.push({
            Name: 'BeforeImportActions',
            Value: [{
                __type: CLEAR_PROFILE_ACTION_TYPE,
                Name: profileName
            }]
        })
    }

    
    importRequestAdditionalProperties.push(
        {
            //This action will take place after the subscribers have been imported to mailworx.
            Name: 'PostSubscriberActions',
            Value: [{
                __type: PROFILE_ADDER_ACTION_TYPE,
                Name: profileName,
                ExecuteWith: ExecuteWith.Insert + ExecuteWith.Update
            }]
        },
        { 
            Name: 'DuplicateCriteria',
            Value: 'email'
        },
        { //Get subscribers to import
            Name:'Subscribers',
            Value: await getSubscribers()
        }
    );

    let response = await sendApiRequest('ImportSubscribers', importRequestAdditionalProperties);
    profile ??= await loadProfile(profileName);
    return {response: response, profileId: profile.Guid};
}

async function getSubscribers(){
    //Building a few template Subscribers, this usually is where some actual data will be used

    //If you want to know which fields are available for your account, then call the following method: 
    await getFieldsOfAcount();

    let subscriber1 = {
        __type: SUBSCRIBER_TYPE,
        Optin: true,
        Mailformat: Mailformat.Multipart,
        Language: 'EN',
        Status: SubscriberStatus.InactiveIfActive,
        Fields:[
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'email',
                UntypedValue: 'ar@mailtest.info'
            },
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'firstname',
                UntypedValue: 'mailer'
            },
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'lastname',
                UntypedValue: 'Service Mailer'
            },
            {
                __type: DATE_TIME_FIELD_TYPE,
                InternalName: 'birthdate',
                UntypedValue: new Date()
            } 
        ]
    };

    let subscriber2 = {
        __type: SUBSCRIBER_TYPE,
        Optin: false,
        Mailformat: Mailformat.Text,
        Status: SubscriberStatus.InactiveIfActive,
        Fields:[
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'email',
                UntypedValue: 'max@mustermann.at'
            },
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'firstname',
                UntypedValue: 'Max'
            },
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'lastname',
                UntypedValue: 'Mustermann'
            },
            {
                __type: NUMBER_FIELD_TYPE,
                InternalName: 'customerid',
                UntypedValue: Math.floor(Math.random() * 9999999999) + 1
            },
            {
                __type: BOOLEAN_FIELD_TYPE,
                InternalName: 'iscustomer',
                UntypedValue: true
            }  
        ]
    };

    let subscriber3 = {
        __type: SUBSCRIBER_TYPE,
        Optin: false,
        Mailformat: Mailformat.Html,
        Status: SubscriberStatus.Active,
        Fields: [
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'email',
                UntypedValue: 'musterfrau@test.at'
            },
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'firstname',
                UntypedValue: 'Anna'
            },
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'lastname',
                UntypedValue: 'Musterfrau'
            },
            {
                __type: NUMBER_FIELD_TYPE,
                InternalName: 'customerid',
                UntypedValue: 1
            },
            {
                __type: BOOLEAN_FIELD_TYPE,
                InternalName: 'iscustomer',
                UntypedValue: false
            },
            {
                __type: DATE_TIME_FIELD_TYPE,
                InternalName: 'birthdate',
                UntypedValue: new Date()
            },
        ]
    };

    let subscriber4 = {
        __type: SUBSCRIBER_TYPE,
        Optin: true,
        Mailformat: Mailformat.Html,
        Status: SubscriberStatus.Active,
        Fields:[
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'email',
                UntypedValue: 'isolde@musterfrau.at'
            },
            {
                __type: TEXT_FIELD_TYPE,
                InternalName: 'lastname',
                UntypedValue: 'Testbauer'
            },
            {
                __type: NUMBER_FIELD_TYPE,
                InternalName: 'customerid',
                UntypedValue: ''
            },
            {
                __type: BOOLEAN_FIELD_TYPE,
                InternalName: 'iscustomer',
                UntypedValue: false
            },
            {
                __type: DATE_TIME_FIELD_TYPE,
                InternalName: 'birthdate',
                UntypedValue: new Date()
            },
        ]
    };  


    return [subscriber1, subscriber2, subscriber3, subscriber4];
}

async function getFieldsOfAcount(){
    let response = await sendApiRequest('GetSubscriberFields', [
        {
            Name: 'FieldType',
            Value: FieldType.CustomInformation | FieldType.MetaInformation
        }
    ]);
    console.log('------------------Fields------------------');
    console.log(response.Fields);
    console.log('----------------Fields End----------------');
}

async function loadProfile(profileName){
    //Get all static profiles
    let response = await sendApiRequest('GetProfiles', [{Name: 'ProfileType', Value:  ProfileType.Static}]);

    //Go through every profile and compare its name to the given profileName
    for(const profile of response.Profiles){
        if(profile.Name.toLowerCase() === profileName.toLowerCase()){
            //if the profile name is the same return that profile
            return profile;
        }
    }
    
    //If no matching profile was found -> return null
    return null;
}

export{
    importSubscribers
}