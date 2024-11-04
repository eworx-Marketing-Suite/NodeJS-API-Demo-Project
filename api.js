import axios from 'axios';

const apiSettings = { 
    url: 'https://mailworx.marketingsuite.info/Services/JSON/ServiceAgent.svc',
    securityContext:{
        Account:'',
        Username:'',
        Password:'',
        Source:''
    },
    language:'EN',
}

function setApiSecurityContext(account = '',username = '', password = '', source = ''){
    apiSettings.securityContext.Account = account;
    apiSettings.securityContext.Username = username;
    apiSettings.securityContext.Password = password;
    apiSettings.securityContext.Source = source;
}

function setApiResponseLanguage(language){
    if (language){
        apiSettings.language = language;
    }
}

function setApiServiceUrl(apiUrl){
    if(apiUrl){
        apiSettings.url = apiUrl;
    }
}

function generateRequestJSON(additionalProperties){
    //check if additionalProperties is of Type -> Array 
    if(!(additionalProperties instanceof Array)){
        console.log('additionalProperties parameter was not of type Array');
        return;
    }

    //create object with base structure of the JSON request.
    var requestJSON = {
        request:{
            Language: apiSettings.language,
            SecurityContext: apiSettings.securityContext,
        }
        
    }

    //add additional properties to the object.
    additionalProperties.forEach(property => {
        requestJSON.request[property.Name] = property.Value;
    });

    return requestJSON;
}

async function sendApiRequest(method, additionalProperties, log = false){
    //use the given additionalProperties to generate RequestJSON object.
    let requestData = generateRequestJSON(additionalProperties);
    //  console.log(JSON.stringify(requestData));
    //build request url by combining the api url and the given method
    let requestURL = apiSettings.url + '/' + method;

    let response;
    try{
        //send request and wait for response. ("axios" is used here but any way to send a post request is fine)
        response = await axios.post(requestURL, requestData);
    }
    catch(err){
        console.log(method +': '+ err.code + ': ' + err.message);
        console.log('with request: ' + JSON.stringify(requestData))
        return err;
    }
    return response.data;
}

export {
    sendApiRequest,
    setApiResponseLanguage,
    setApiSecurityContext,
    setApiServiceUrl,
}

