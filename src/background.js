function readDiscussionFromRally(objectID, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/artifact/'+ objectID + '/Discussion';
    
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.setRequestHeader('ZSESSIONID', getAPIKey());
    request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200) {
                console.log(request.response.QueryResult);
                resolve(request.response.QueryResult);
			} else {
				reject(request.status);
			}
		}
	};
    request.send();
}

function writeDiscussionToRally(objectID, text, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/conversationpost/create';
    const param = {
        ConversationPost: {
          'Text': text,
          'Artifact': objectID
        }
    };

    let request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('ZSESSIONID', getAPIKey());
    request.setRequestHeader('Content-Type', 'text/plain');

    request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200) {
                resolve(request.response);
			} else {
				reject(request.status);
			}
		}
    };
    request.send(JSON.stringify(param));
}

function updateDefectFieldValueOnRally(objectID, fieldName, fieldValue, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/defect/' + objectID;
    const param = {
        Defect: {
            '${fieldName}': fieldValue
        }
    };
    const stringifyParam = JSON.stringify(param).replace('${fieldName}', fieldName);

    let request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('ZSESSIONID', getAPIKey());
    request.setRequestHeader('Content-Type', 'text/plain');

    request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200) {
                resolve(request.response);
			} else {
				reject(request.status);
			}
		}
    };
    request.send(stringifyParam);
}

function updatePortfolioItemOnRally(objectID, APIKey, fieldName, fieldValue, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/' + objectID;
    const param = {
        PortfolioItem: {
            '${fieldName}': fieldValue
        }
    };
    const stringifyParam = JSON.stringify(param).replace('${fieldName}', fieldName);

    let request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('ZSESSIONID', APIKey);
    request.setRequestHeader('Content-Type', 'text/plain');

    request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200) {
                resolve(request.response);
			} else {
				reject(request.status);
			}
		}
    };
    request.send(stringifyParam);
}

// listen the message from content-script.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    console.log(request, sender, sendResponse);
    if(request.type === 'readDiscussion') {
        readDiscussionFromRally(request.objectID, sendResponse);
    } else if (request.type === 'writeDiscussion') {
        writeDiscussionToRally(request.objectID, request.text, sendResponse)
    } else if (request.type === 'updateDefectField') {
        updateDefectFieldValueOnRally(request.objectID, request.fieldName, request.fieldValue, sendResponse)
    } else if (request.type === 'updatePortfolioItem') {
        updatePortfolioItemOnRally(request.objectID, request.APIKey, request.fieldName, request.fieldValue, sendResponse)
    }
    return true;
});

function getAPIKey() {
  //const rallyValue = JSON.parse(localStorage.getItem(rallyKey));
  //return rallyValue.apiKey;
  return '_N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk';
}

function updateAPIKey(key) {
  let rallyValue = JSON.parse(localStorage.getItem(rallyKey));
  rallyValue.apiKey = key;
  localStorage.setItem(rallyKey, JSON.stringify(rallyValue));
}
