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
    postRequest(url, JSON.stringify(param), resolve, reject);
}

function updateDefectFieldValueOnRally(objectID, fieldName, fieldValue, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/defect/' + objectID;
    const param = {
        Defect: {
            '${fieldName}': fieldValue
        }
    };
    const stringifyParam = JSON.stringify(param).replace('${fieldName}', fieldName);
    postRequest(url, stringifyParam, resolve, reject);
}

function updatePortfolioItemOnRally(objectID, APIKey, fieldName, fieldValue, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/' + objectID;
    const param = {
        PortfolioItem: {
            '${fieldName}': fieldValue
        }
    };
    const stringifyParam = JSON.stringify(param).replace('${fieldName}', fieldName);
    postRequest(url, stringifyParam, resolve, reject);
}

function addDefectTagsOnRally(objectID, tagList, resolve, reject) {
    /*
        tagList is Array.
        tagList = [
            {
                "Name": "New_Tag_Name"                                                          // for adding new tag
            },
            {
                "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/294687977200"      // for adding existed tag
            },
            ......
        ]
    */
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/defect/' + objectID + '/tags/add?fetch=Name';
    const param = {
        CollectionItems: tagList
    };
    postRequest(url, JSON.stringify(param), resolve, reject);
}

function removeDefectTagsOnRally(objectID, tagList, resolve, reject) {
    /*
        tagList is Array.
        tagList = [
            {
                "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/294687977200"      // for removing existed tag
            },
            ......
        ]
    */
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/defect/' + objectID + '/tags/remove';
    const param = {
        CollectionItems: tagList
    };
    postRequest(url, JSON.stringify(param), resolve, reject);
}

function queryTagsOnRally(queryValue, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/tag?query=(Name Contains "${query_value}")&start=1&pagesize=2000'
                .replace('${query_value}', queryValue);
    
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.setRequestHeader('ZSESSIONID', getAPIKey());
    request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200) {
                console.log(request.response.QueryResult.Results);
                resolve(request.response.QueryResult.Results);
			} else {
				reject(request.status);
			}
		}
	};
    request.send();
}

function getDefectTagsOnRally(objectID, resolve, reject) {
    const url = 'https://rally1.rallydev.com/slm/webservice/v2.0/artifact/' + objectID + '/Tags';
    
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.setRequestHeader('ZSESSIONID', getAPIKey());
    request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200) {
                console.log(request.response.QueryResult.Results);
                resolve(request.response.QueryResult.Results);
			} else {
				reject(request.status);
			}
		}
	};
    request.send();
}

// listen the message from content-script.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    console.log(request, sender, sendResponse);
    if(request.type === 'readDiscussion') {
        readDiscussionFromRally(request.objectID, sendResponse);
    } else if (request.type === 'writeDiscussion') {
        writeDiscussionToRally(request.objectID, request.text, sendResponse);
    } else if (request.type === 'updateDefectField') {
        updateDefectFieldValueOnRally(request.objectID, request.fieldName, request.fieldValue, sendResponse);
    } else if (request.type === 'updatePortfolioItem') {
        updatePortfolioItemOnRally(request.objectID, request.APIKey, request.fieldName, request.fieldValue, sendResponse);
    } else if (request.type === 'addDefectTags') {
        addDefectTagsOnRally(request.objectID, request.tagList, sendResponse);
    } else if (request.type === 'removeDefectTags') {
        removeDefectTagsOnRally(request.objectID, request.tagList, sendResponse);
    }
    return true;
});

function postRequest(url, param, resolve, reject) {
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
    request.send(param);
}

function getAPIKey() {
    const rallyKey = 'Rally';
    const rallyValue = JSON.parse(localStorage.getItem(rallyKey));
    return rallyValue.apiKey;
}

function updateAPIKey(key) {
    const rallyKey = 'Rally';
    let rallyValue = JSON.parse(localStorage.getItem(rallyKey));
    rallyValue.apiKey = key;
    localStorage.setItem(rallyKey, JSON.stringify(rallyValue));
}
