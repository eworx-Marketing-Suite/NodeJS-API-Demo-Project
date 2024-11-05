import { sendApiRequest, setApiResponseLanguage, setApiSecurityContext, setApiServiceUrl } from '../api.js'
import {
    AB_SPLIT_TEST_SEND_SETTINGS_TYPE, MANUAL_SEND_SETTINGS_TYPE, SECTION_TYPE, CAMPAIGN_TYPE, CampaignType, ProfileType, CLEAR_PROFILE_ACTION_TYPE,
    PROFILE_ADDER_ACTION_TYPE, ExecuteWith, SUBSCRIBER_TYPE, SubscriberStatus, Mailformat, TEXT_FIELD_TYPE, DATE_TIME_FIELD_TYPE, SELECTION_FIELD_TYPE,
    NUMBER_FIELD_TYPE, BOOLEAN_FIELD_TYPE, URL_FIELD_TYPE, MDB_FIELD_TYPE, GUID_FIELD_TYPE, HTML_ENCODED_TEXT_FIELD_TYPE, FieldType, TEMPLATE_TYPE
} from '../constants.js';
import fs from "fs"

//create sections for specified campaign
async function createSection(templateId, campaignId) {
    //Load all available section definitions for the given template.
    let sectionDefinitions = await loadSectionDefinition(templateId);
    let sectionCreated = false;

    //There are different types of fields which can be used. Have a look at the constants class.

    //If there are no section definitions we can't setup the campaign.
    if (sectionDefinitions !== null && sectionDefinitions.length > 0) {
        sectionCreated = true;
        //Right here we create three different sample sections for our sample campaign.

        //Load the section definition that defines an article
        //Beware that these section definition names may change if the response language of the request is set to a language other than english 
        let definitionArticle = loadSectionDefinitionByName('Article', sectionDefinitions);
        if (definitionArticle !== null) {
            let definitionArticleAdditionalProperties = [
                {
                    Name: 'Campaign',
                    Value: {
                        __type: CAMPAIGN_TYPE,
                        Guid: campaignId
                    }
                },
                {
                    Name: 'Section',
                    Value: await createArticleSection(definitionArticle)
                }
            ];

            //Create the section
            let createSectionArticleResponse = await sendApiRequest('CreateSection', definitionArticleAdditionalProperties);

            //Check if the response is valid and flag sectionCreated as true or false depending on the validity 
            sectionCreated = sectionCreated && createSectionArticleResponse !== null && createSectionArticleResponse.Guid !== null;
        }

        //Load the sector definition that defines a two column.
        let definitionTwoColumns = loadSectionDefinitionByName('Article with 2 Columns', sectionDefinitions);
        if (definitionTwoColumns !== null) {
            let additionalTwoColumnsProperties = [
                {
                    Name: 'Campaign',
                    Value: {
                        __type: CAMPAIGN_TYPE,
                        Guid: campaignId
                    }
                },
                {
                    Name: 'Section',
                    Value: await createTwoColumnSection(definitionTwoColumns)
                }
            ];

            //Create the section
            let createSectionTwoColumnsResponse = await sendApiRequest('CreateSection', additionalTwoColumnsProperties);

            //Check if the response is valid and flag sectionCreated as true or false depending on the validity 
            sectionCreated = sectionCreated && createSectionTwoColumnsResponse !== null && createSectionTwoColumnsResponse.Guid !== null;
        }

        //Load the section definition that defines an article
        let definitionBanner = loadSectionDefinitionByName('Teaser', sectionDefinitions);
        if (definitionBanner !== null) {
            let bannerAdditionalProperties = [
                {
                    Name: 'Campaign',
                    Value: {
                        __type: CAMPAIGN_TYPE,
                        Guid: campaignId
                    }
                },
                {
                    Name: 'Section',
                    Value: await createBannerSection(definitionBanner)
                }
            ];

            //Create the section
            let createBannerResponse = await sendApiRequest('CreateSection', bannerAdditionalProperties);

            //Check if the response is valid and flag sectionCreated as true or false depending on the validity 
            sectionCreated = sectionCreated && createBannerResponse !== null && createBannerResponse.Guid !== null;
        }
    }
    return sectionCreated;
}

//Gets all section definitions of a template.
//Returns the sections definitions of the given template.
async function loadSectionDefinition(templateId) {
    let sectionDefinitionAdditionalProperties = [
        {
            Name: 'Template',
            Value: {
                __type: TEMPLATE_TYPE,
                Guid: templateId
            }
        }
    ];

    let sectionDefinitionResponse = await sendApiRequest('GetSectionDefinitions', sectionDefinitionAdditionalProperties);

    /* ### DEMONSTRATE SECTION DEFINITION STRUCTURE ###
    Here we use the console application in order to demonstrate the structure of each section definition.
    You need to know the structure in order to be able to create sections on your own.*/
    if (sectionDefinitionResponse === null) {
        return;
    }
    else {
        console.log('-------------------------------Section definitions-------------------------------');
        for (const [sectionDefinitionIndex, sectionDefinition] of sectionDefinitionResponse.SectionDefinitions.entries()) {
            console.log('++++++++++++++++++++++++++++++ Section definition ' + (sectionDefinitionIndex + 1) + ' ++++++++++++++++++++++++++++++');
            console.log('Name: ' + sectionDefinition.Name);

            if (sectionDefinition.Fields.length > 0) {
                for (const [fieldIndex, field] of sectionDefinition.Fields.entries()) {
                    let endOfType = field.__type.indexOf(':');
                    let typeName = field.__type.substring(0, endOfType);
                    console.log('******** Field ' + (fieldIndex + 1) + '********');
                    console.log('Name: ' + field.InternalName);
                    console.log('Type: ' + typeName);

                    if (typeName.toLowerCase() === 'selectionfield') {
                        console.log('');
                        console.log('Selections: ');
                        for (const selection of field.SelectionObjects) {
                            console.log('Name: ' + selection.Caption);
                            console.log('Value: ' + selection.InternalName);
                            console.log('---------')
                        }
                    }
                    console.log('************************')
                    console.log('');
                }
            }
            else {
                console.log('No fields found.')
            }
        }
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++');
        return sectionDefinitionResponse.SectionDefinitions;
    }
}

//Creates an article section
async function createArticleSection(definitionArticle) {
    let fieldsToAdd = [];

    //build the section -> add text and images to certain fields
    for (const field of definitionArticle.Fields) {
        if (field.InternalName.toLowerCase() === 'a_text') {
            fieldsToAdd.push({
                __type: TEXT_FIELD_TYPE,
                InternalName: field.InternalName,
                // Beware single quotes do not work for attributes in HTML tags.
                // If you want to use double quotes for your text, you must use them HTML-encoded.
                // A text can only be linked with <a> tags and a href attributes. E.g.: <a href=""www.mailworx.info"">go to mailworx website</a>
                UntypedValue: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy "eirmod tempor" invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et <a href="www.mailworx.info">justo</a> duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo dup dolores et ea rebum.  <a href="http://sys.mailworx.info/sys/Form.aspx?frm=4bf54eb6-97a6-4f95-a803-5013f0c62b35">Stet</a> clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
            });
        }
        else if (field.InternalName.toLowerCase() === 'a_img') {
            //Upload the file from the given path to the eMS media data base.
            let file = await uploadFile('./assets/email.png', 'email.png');
            if (file !== null) {
                fieldsToAdd.push({
                    __type: MDB_FIELD_TYPE,
                    InternalName: field.InternalName,
                    UntypedValue: file
                });
            }
        }
        else if (field.InternalName.toLowerCase() === 'a_hl') {
            fieldsToAdd.push({
                __type: TEXT_FIELD_TYPE,
                InternalName: field.InternalName,
                UntypedValue: '[%mwr:briefanrede%]'
            });
        }
    }

    return {
        __type: SECTION_TYPE,
        SectionDefinitionName: definitionArticle.Name,
        StatisticName: 'my first article',
        Fields: fieldsToAdd
    };
}

//Creates a two column section
async function createTwoColumnSection(definitionTwoColumns) {
    let fieldsToAdd = [];

    //build the section -> add text and images to certain fields
    for (const field of definitionTwoColumns.Fields) {
        if (field.InternalName.toLowerCase() === 'c2_l_img') {
            let file = await uploadFile("./assets/logo.png", "logo.png");
            if (file !== null) {
                fieldsToAdd.push({
                    __type: MDB_FIELD_TYPE,
                    InternalName: field.InternalName,
                    UntypedValue: file
                });
            }
        }
        else if (field.InternalName.toLowerCase() === 'c2_l_text') {
            fieldsToAdd.push({
                __type: TEXT_FIELD_TYPE,
                InternalName: field.InternalName,
                UntypedValue: 'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto ignissim, qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.'
            });
        }
        else if (field.InternalName.toLowerCase() === 'c2_r_img') {
            let file = await uploadFile("./assets/events.png", "events.png");
            if (file !== null) {
                fieldsToAdd.push({
                    __type: MDB_FIELD_TYPE,
                    InternalName: field.InternalName,
                    UntypedValue: file
                });
            }
        }
        else if (field.InternalName.toLowerCase() === 'c2_r_text') {
            fieldsToAdd.push({
                __type: TEXT_FIELD_TYPE,
                InternalName: field.InternalName,
                UntypedValue: 'Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, qsed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo.'
            });
        }
    }

    return {
        __type: SECTION_TYPE,
        SectionDefinitionName: definitionTwoColumns.Name,
        StatisticName: 'section with two columns.',
        Fields: fieldsToAdd,
    };
}

//Create banner section
async function createBannerSection(definitionBanner) {
    let fieldsToAdd = [];
    for (const field of definitionBanner.Fields) {
        if (field.InternalName.toLowerCase() === 't_img') {
            let file = await uploadFile("./assets/logo.png", "eMS-logo.png");
            if (file !== null) {
                fieldsToAdd.push({
                    __type: MDB_FIELD_TYPE,
                    InternalName: field.InternalName,
                    UntypedValue: file
                });
            }
        }
        else if (field.InternalName.toLowerCase() === 't_text') {
            fieldsToAdd.push({
                __type: TEXT_FIELD_TYPE,
                InternalName: field.InternalName,
                UntypedValue: 'Developed in the <a href="https://www.eworx.at/marketing-suite/produkte/mailworx/">mailworx</a> laboratory the intelligent and auto-adaptive algorithm <a href="https://www.eworx.at/doku/so-funktioniert-irated/>iRated®</a> brings real progress to your email marketing. It is more than a target group oriented approach. iRated® sorts the sections of your emails automatically depending on the current preferences of every single subscriber. This helps you send individual emails even when you don\'t know much about the person behind the email address.'
            });
        }
    }
    return {
        __type: SECTION_TYPE,
        SectionDefinitionName: definitionBanner.Name,
        StatisticName: 'Teaser',
        Fields: fieldsToAdd
    };
}

//Description: Loads the section definitions for the given template id.
//Returnes the section definition if it finds one with the according sectionDefinitionName.
function loadSectionDefinitionByName(sectionDefinitionName, sectionDefinitions) {
    for (const sectionDefinition of sectionDefinitions) {
        if (sectionDefinition.Name.toLowerCase() === sectionDefinitionName.toLowerCase()) {
            return sectionDefinition;
        }
    }
    return null;
}

//Searches a file by its name.
//Returnes the id of the file if its found.
function getFileIdByName(fileName, files) {
    for (const file of files) {
        if (file.Name.toLowerCase() === fileName.toLowerCase()) {
            return file.Id;
        }
    }
    return null;
}

//Uploads a file to the eMS media data base.
//Parameter path: The path where the file to upload is located.
//Parameter fileName: Name of the file to upload.
//Returnes the id of the uploaded file.
async function uploadFile(path, fileName) {
    let mdbFilesAdditionalProperties = [{
        Name: 'Path',
        Value: 'NodeJS_API_Test'
    }];
    //check if target directory already exists, create it if not
    await sendApiRequest('CreateMDBDirectory', mdbFilesAdditionalProperties);

    let getMdbFilesResponse = await sendApiRequest('GetMDBFiles', mdbFilesAdditionalProperties);

    //if the file doesn't already exists upload the file to the MDB, otherwise return the existing files id
    if (getMdbFilesResponse === null || getFileIdByName(fileName, getMdbFilesResponse["<Files>k__BackingField"]) === null) {
        //get the image as a buffer
        let contents = fs.readFileSync(path, null).buffer;

        let uploadFileAdditionalProperties = [
            {
                Name: 'File',
                Value: Array.from(new Uint8Array(contents)) //convert the buffer to an Array so the api can handle it

            },
            {
                Name: 'Path',
                Value: 'NodeJS_API_Test'
            },
            {
                Name: 'Name',
                Value: fileName
            }
        ];

        let fileUploadResponse = await sendApiRequest('UploadFileToMDB', uploadFileAdditionalProperties);

        if (fileUploadResponse !== null) {
            return fileUploadResponse['<FileId>k__BackingField'];
        }
        else {
            return null;
        }
    }
    else {
        return getFileIdByName(fileName, getMdbFilesResponse['<Files>k__BackingField']);
    }
}


export {
    createSection
}