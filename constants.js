const CampaignType = {
    InWork: 1,
    Sent: 2,
    eventDependent: 4,
}

const SendType = {
    Manual: 0,
    AbSplit: 1,
    eventDependent: 2,
}

const ProfileType = {
    Dynamic: 1,
    Static: 2,
}

const ExecuteWith = {
    Insert: 1,
    Update: 2
}

const Mailformat = {
    Text: 0,
    Html: 1,
    Multipart: 2
}

const FieldType = {
    MetaInformation: 1,
    CustomInformation: 2
}

const SubscriberStatus = {
    Active: 0,
    Inactive: 1,
    ActiveIfManualInactive: 2,
    InactiveIfActive: 3
}

const CLEAR_PROFILE_ACTION_TYPE = 'ClearProfileAction:#Eworx.Mailworx.ServiceInterfaces.Subscribers.SubscriberImport';
const PROFILE_ADDER_ACTION_TYPE = 'ProfileAdderAction:#Eworx.Mailworx.ServiceInterfaces.Subscribers.SubscriberImport';

const SUBSCRIBER_TYPE = 'Subscriber:#Eworx.Mailworx.ServiceInterfaces.Subscribers';
const TEMPLATE_TYPE = 'Template:#Eworx.Mailworx.ServiceInterfaces.Templates';

const TEXT_FIELD_TYPE = 'TextField:#Eworx.Mailworx.ServiceInterfaces';
const DATE_TIME_FIELD_TYPE = 'DateTimeField:#Eworx.Mailworx.ServiceInterfaces';
const SELECTION_FIELD_TYPE = 'SelectionField:#Eworx.Mailworx.ServiceInterfaces';
const NUMBER_FIELD_TYPE = 'NumberField:#Eworx.Mailworx.ServiceInterfaces';
const BOOLEAN_FIELD_TYPE = 'BooleanField:#Eworx.Mailworx.ServiceInterfaces';
const URL_FIELD_TYPE = 'UrlField:#Eworx.Mailworx.ServiceInterfaces';
const MDB_FIELD_TYPE = 'MdbField:#Eworx.Mailworx.ServiceInterfaces';
const GUID_FIELD_TYPE = 'GuidField:#Eworx.Mailworx.ServiceInterfaces';
const HTML_ENCODED_TEXT_FIELD_TYPE = 'HtmlEncodedTextField:#Eworx.Mailworx.ServiceInterfaces';

const CAMPAIGN_TYPE = 'Campaign:#Eworx.Mailworx.ServiceInterfaces.Campaigns';
const SECTION_TYPE = 'Section:#Eworx.Mailworx.ServiceInterfaces.Campaigns';
const MANUAL_SEND_SETTINGS_TYPE = 'ManualSendSettings:#Eworx.Mailworx.ServiceInterfaces.Campaigns';
const AB_SPLIT_TEST_SEND_SETTINGS_TYPE = 'ABSplitTestSendSettings:#Eworx.Mailworx.ServiceInterfaces.Campaigns';

export {
    AB_SPLIT_TEST_SEND_SETTINGS_TYPE,
    MANUAL_SEND_SETTINGS_TYPE,
    SECTION_TYPE,
    CAMPAIGN_TYPE,
    CampaignType,
    ProfileType,
    CLEAR_PROFILE_ACTION_TYPE,
    PROFILE_ADDER_ACTION_TYPE,
    ExecuteWith,
    SUBSCRIBER_TYPE,
    SubscriberStatus,
    Mailformat,
    TEXT_FIELD_TYPE,
    DATE_TIME_FIELD_TYPE,
    SELECTION_FIELD_TYPE,
    NUMBER_FIELD_TYPE,
    BOOLEAN_FIELD_TYPE,
    URL_FIELD_TYPE,
    MDB_FIELD_TYPE,
    GUID_FIELD_TYPE,
    HTML_ENCODED_TEXT_FIELD_TYPE,
    FieldType,
    TEMPLATE_TYPE,
    SendType
}