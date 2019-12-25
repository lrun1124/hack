function readDiscussionFromRally(objectID, APIKey, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/artifact/'+ objectID + '/Discussion';
    
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.setRequestHeader('ZSESSIONID', APIKey);
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

function writeDiscussionToRally(objectID, APIKey, text, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/conversationpost/create';
    const param = {
        ConversationPost: {
          'Text': text,
          'Artifact': objectID
        }
    };

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
    request.send(JSON.stringify(param));
}

function updateDefectFieldValueOnRally(objectID, APIKey, fieldName, fieldValue, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/defect/' + objectID;
    const param = {
        Defect: {
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
        readDiscussionFromRally(request.objectID, request.APIKey, sendResponse);
    } else if (request.type === 'writeDiscussion') {
        writeDiscussionToRally(request.objectID, request.APIKey, request.text, sendResponse)
    } else if (request.type === 'updateDefectField') {
        updateDefectFieldValueOnRally(request.objectID, request.APIKey, request.fieldName, request.fieldValue, sendResponse)
    }
    return true;
});
