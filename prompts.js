import promptSync from 'prompt-sync';

//assign the promt function.
let prompt = promptSync();

function securityContextPrompt() {
    //set security context.
    console.log("Please set the security context.");
    let account = prompt('Set ems account name: ');
    let username = prompt('Set ems username: ');
    let password = prompt('Set ems password: ');
    let source = prompt('Set Source: ');
    return {
        account: account,
        username: username,
        password: password,
        source: source
    };
}

function languagePrompt() {
    return prompt('Set api response language by short form (Default -> EN): ', 'EN');
}

function serviceUrlPrompt() {
    return prompt('Set api service url: ', 'https://mailworx.marketingsuite.info/Services/JSON/ServiceAgent.svc');
}

function additionalPropertiesPrompt() {
    let additionalProperties = [];
    //[{Name: 'ResponseDetail', Value: 5}, {Name:'Id', Value: '8b8b33fa-eaa4-4d29-887f-b949aa893f77'}]
    while (true) {
        let answer = prompt('Do you want to add additional Properties to the JSON request? (Y/N): ', 'N');
        answer = answer.toLocaleLowerCase().trim();
        if (answer === 'y') {
            let pos = additionalProperties.push({ Name: '', Value: '' });
            additionalProperties[pos - 1].Name = prompt('Enter proptery name: ');
            additionalProperties[pos - 1].Value = prompt('Enter property value: ');
        }
        else if (answer === 'n') {
            return additionalProperties;
        }
        else {
            console.log('----> The entered value is not valid please try again!')
        }
    }
}

function methodPrompt() {
    return prompt("Set method name: ");
}

function campaignPrompt() {
    return prompt("Enter campaign name as base for new campaign: ");
}

export {
    securityContextPrompt,
    languagePrompt,
    serviceUrlPrompt,
    additionalPropertiesPrompt,
    methodPrompt,
    campaignPrompt
}