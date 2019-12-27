console.log('content script!');
const REGRESSION_VALUE = [
    "Yes",
    "No",
    "TBD",
    "Found by new feature testing"
];

const RALLY_PROPERTIES = 'Rally';
const APIKEY = 'apiKey';
const DISCUSSION = 'DISCUSSION';
const TAG = 'TAG';
const PMSTATUS = 'PMSTATUS';
const APIKey = '_N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk';
const defaultName = 'Li Hao'; // _N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk
const defaultDate = '2019-12-28';
var objectID = '';
const tagsArray = [
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/339456604868",
        "Name": "11.2.1"
    },
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/341895064156",
        "Name": "SRANA-11.2.1"
    },
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/344806579644",
        "Name": "AT_11.2.1 Candidate"
    },
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/350019942064",
        "Name": "11.2.1 - AT Approved"
    },
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/351710850240",
        "Name": "vivi watch list_11.2.1"
    },
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/354712007868",
        "Name": "APO reviewed for 11.2.1"
    },
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/355380176620",
        "Name": "High risk for 11.2.1"
    },
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/355380179744",
        "Name": "Low risk for 11.2.1"
    },
    {
        "_ref": "https://rally1.rallydev.com/slm/webservice/v2.0/tag/356439093812",
        "Name": "11.2.1 CPO Approved"
    }
];
const statusMap = {
    'PM0 Discarded' : '1.0',
    'PM1 In Progress' : '2.0',
    'PM2 PM Approved' : '3.0',
    'PM3 TVP PM Approved' : '4.0',
    'PM4 PO Approved' : '5.0',
    'PM5 TVP P0 Approved' : '6.0'
}

const statusArr = [{
    Name: 'PM0 Discarded',
    _ref: '001'
},
{
    Name: 'PM1 In Progress',
    _ref: '002'
},
{
    Name: 'PM2 PM Approved',
    _ref: '003'
},
{
    Name: 'PM3 TVP PM Approved',
    _ref: '004'
},
{
    Name: 'PM4 PO Approved',
    _ref: '005'
},
{
    Name: 'PM5 TVP P0 Approved',
    _ref: '006'
}];

if (!localStorage.getItem(RALLY_PROPERTIES)) {
    let rallyValue = {
      apiKey: '',
      defectFields: {},
      DISCUSSION: false,
      TAG: false,
      PMSTATUS: false
    };
    localStorage.setItem(RALLY_PROPERTIES, JSON.stringify(rallyValue));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
    localStorage.setItem(RALLY_PROPERTIES, JSON.stringify(request));
});

document.addEventListener('click', function(event) {
    if(getProperty(DISCUSSION) && event.target.getAttribute('href') && event.target.getAttribute('href').endsWith('discussion')){
        window.rallyClickTarget = event.target;
        UpdateObjectID();
        event.preventDefault();
        const temp = event.target.href.split('/');
        objectID = temp[temp.length-2];
        // read discussion
        let read_message = {type: 'readDiscussion', objectID: objectID};
        chrome.runtime.sendMessage(read_message, function(response) {
            console.log(response);
            var list = response.Results;
            list.forEach( function(item){
                addComment(item);
            })
        });

        tip(event.target.href, event.clientX, event.clientY);
    } 
    // else if(REGRESSION_VALUE.includes(event.target.innerText)) {
    //     window.rallyClickTarget = event.target;
    //     /*
    //      * code example
    //      * modify later
    //     */

    //     // send message to background.js
    //     const APIKey = '_N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk';
    //     const defectID = '341373250384'/*DE152224*/;
    //     const fieldName = 'c_Regression';
    //     const fieldValue = 'No';

    //     // 3) update rally regression value
    //     let message = {type: 'updateDefectField', objectID: defectID, APIKey: APIKey, fieldName: fieldName, fieldValue: fieldValue};
    //     chrome.runtime.sendMessage(message, function(response) {
    //         console.log(response);
    //     });
    //     event.target.innerText = fieldValue;
    //} 
    //else if (getProperty(TAG) && event.target.getAttribute('ei') === '17') {
    else if (getProperty(TAG) && event.target.getAttribute('class').startsWith('r-c0-0_K')) {
        window.rallyClickTarget = event.target;
        var href = event.target.parentNode.children[1].children[0].getAttribute('href');
        const temp = href.split('/');
        objectID = temp[temp.length-1];
        TagPulldown(undefined, event.clientX, event.clientY);
    } else if (getProperty(PMSTATUS) && event.target.getAttribute('class').startsWith('r-c7-0_K')){
        window.rallyClickTarget = event.target;
        var href = event.target.parentNode.children[0].children[0].getAttribute('href');
        const temp = href.split('/');
        objectID = temp[temp.length-1];
        statusPulldown(undefined, event.clientX, event.clientY);
    }
});

function addComment(msg, isAdd){
    var text, name, name;
    if(isAdd){
        text = msg;
        name = defaultName;
        time = defaultDate;
    } else {
        text = msg.Text;
        name = msg.User._refObjectName;
        time = msg.CreationDate.split('T')[0];
    }
    var oMessageBox = document.getElementById("messageBox");
    var oMessageContent = document.createElement("div");
    oMessageContent.className = "message_content";
    oMessageContent.innerHTML = `
    <div style="background:white; border-bottom:1px solid grey">
        <div style="padding: 5px 5px">
            <div>
                <span style="font-weight:bold">${name}</span>
                <span style="padding-left:5px">${time}</span>
            </div>

            <div>${text}</div>
        </div>
    </div>
    `;
    oMessageBox.insertBefore(oMessageContent, oMessageBox.children[0]);
}

function bindEvent(){
    var oPostBtn = document.getElementById("doPost");
    var oCloseBtn = document.getElementById("doClose");
    var oInput = document.getElementById("myInput");
    
    oPostBtn.onclick = function(){
        if(oInput.value){          
            addComment(oInput.value, true);
            writeToRally(objectID, oInput.value);
            oInput.value = "";
        }
    }

    oCloseBtn.onclick = function() {
        document.getElementById('Discussion').remove();
    }
}


function bindTagEvent(){
    var oCloseBtn = document.getElementById("TagdoClose");
    var oPostBtn = document.getElementById("TagdoPost");
    var oAddBtn = document.getElementById("TagdoAdd");
    var currentTag = document.getElementById("current_tag");
    oAddBtn.onclick = function(){
        var input = document.getElementById("select_input");
        currentTag.value = currentTag.value + ',' + input.value;
    }
    oPostBtn.onclick = function(){
        if(window.rallyClickTarget) {
            const defectTagList = currentTag.value.split(',');
            const tagList = tagsArray.filter(function(item) {
                if(defectTagList.includes(item.Name))
                    return item._ref;
            });
            addDefectTagsWithKey(tagList, function(response) {
                window.rallyClickTarget.innerText = currentTag.value;
                document.getElementById('TagPulldown').remove();
            });
        }
    }
    oCloseBtn.onclick = function() {
        document.getElementById('TagPulldown').remove();
    }
}

function bindStatusEvent(){
    var oCloseBtn = document.getElementById("statusdoClose");
    var oPostBtn = document.getElementById("statusdoPost");
    var currentStatus = document.getElementById("select_input");
    oPostBtn.onclick = function(){
        if(window.rallyClickTarget) {
            writePMStatueToRally(objectID, APIKey, currentStatus.value)
            window.rallyClickTarget.innerText = statusMap[currentStatus.value];
            document.getElementById('statusPulldown').remove();
        }
    }
    oCloseBtn.onclick = function() {
        document.getElementById('statusPulldown').remove();
    }
}

function TagPulldown(list, x, y) {
    var eleId = 'TagPulldown';
    if(document.getElementById(eleId)) {
        document.getElementById(eleId).remove();
    }
	list = list || tagsArray;
    var ele = document.createElement('div');
    ele.id = eleId;
    ele.className = 'chrome-plugin-simple-tip';
    ele.style.background = '#e6e6e6';
	ele.style.position = 'fixed';
	ele.style.top = (10 + y) + 'px';
	ele.style.left = (10 + x) + 'px';
    ele.style.zIndex = 999999;
    ele.style.padding = '10px';
    ele.style.border= "1.5px solid #a1a1a1";
    ele.style.borderRadius ='5px';

	ele.innerHTML = `
        <div>
            <span style="color:#222;font-weight:bold">Tag</span>
            <span id="TagdoClose" class="icon-cancel" style="padding-left:150px"></span>
        </div>
        <div class="select-content">
            <input type="hidden" name="newMachineId">
            <input type="text" name="select_input" id="current_tag" style="width:200px; margin-top:10px"/>
            <button id="TagdoPost" style="color:black;font-weight:bold;float:right;margin:10px 0">submit</button>
            <input type="text" name="select_input" id="select_input" class="select-input" value="" autocomplete="off" placeholder="Search" />
            <button id="TagdoAdd" style="color:black;font-weight:bold;float:right;margin:10px 0">add</button>
            <div id="search_select" class="search-select">
                <ul id="select_ul" class="select-ul"> 
            </ul>
        </div>
    </div>
    `
	document.body.appendChild(ele);
    document.getElementById('current_tag').value = window.rallyClickTarget.innerText;
    searchInput(tagsArray);
    bindTagEvent();
}

function statusPulldown(list, x, y) {
    var eleId = 'statusPulldown';
    if(document.getElementById(eleId)) {
        document.getElementById(eleId).remove();
    }
    var ele = document.createElement('div');
    ele.id = eleId;
    ele.className = 'chrome-plugin-simple-tip';
    ele.style.background = '#e6e6e6';
	ele.style.position = 'fixed';
	ele.style.top = (10 + y) + 'px';
	ele.style.left = (10 + x) + 'px';
    ele.style.zIndex = 999999;
    ele.style.padding = '10px';
    ele.style.border= "1.5px solid #a1a1a1";
    ele.style.borderRadius ='5px';

	ele.innerHTML = `
        <div>
            <span style="color:#222;font-weight:bold">PM STATUS</span>
            <span id="statusdoClose" class="icon-cancel" style="padding-left:100px"></span>
        </div>
        <div class="select-content">
            <input type="hidden" name="newMachineId">
            <input type="text" name="select_input" id="select_input" style="margin-top:10px" class="select-input" value="" autocomplete="off" placeholder="Search" />
            <button id="statusdoPost" style="color:black;font-weight:bold;float:right;margin:10px 0">submit</button>
            <div id="search_select" class="search-select" style="top:40px">
                <ul id="select_ul" class="select-ul"> 
            </ul>
        </div>
    </div>
    `
	document.body.appendChild(ele);
    searchInput(statusArr);
    bindStatusEvent();
}


function newOptions(tempArr){
    var listArr = [];
    for(var i=0;i<tempArr.length;i++){
        if(tempArr[i].Name.indexOf($('#select_input').val()) > -1){
            listArr.push(tempArr[i]);
        }
    }
    var options = '';
    for(var i = 0; i < listArr.length; i++) {
        opt = '<li class="li-select" data-newMachineId="' + listArr[i]._ref + '">' + listArr[i].Name + '</li>';
        options += opt;
    }
    if(options == ''){
        $('#search_select').hide();
    }else{
        $('#search_select').show();
        $('#select_ul').html('').append(options);
    }
}

function searchInput(tempArr){
    $('select-content .sanjiao').on('click',function(){
        $('#select_input').focus();
    });
    $('#select_input').on('keyup',function(){
        newOptions(tempArr);
    });
    $('#select_input').on('focus',function(){
        $('#search_select').show();
        newOptions(tempArr);
    });
    $('#select_ul .li-disabled').on('click',function(){
        $('#search_select').show();
    });
    $('#search_select').on('mouseover',function(){
        $(this).addClass('ul-hover');
    });
    $('#search_select').on('mouseout',function(){
        $(this).removeClass('ul-hover');
    });
    $('#select_input').on('blur',function(){
        if($('#search_select').hasClass('ul-hover')){
            $('#search_select').show();
        }else{
            $('#search_select').hide();
        }
    });
    $('#select_ul').delegate('.li-select', 'click',function(){
        $('#select_ul .li-select').removeClass('li-hover');
        var selectText = $(this).html();
        var newMachineIdVal = $($(this)[0]).attr("data-newMachineId");
        $('#select_input').val(selectText);
        $('#search_select').hide();
        $("input[name='newMachineId']").val(newMachineIdVal);
//          console.log($("input[name='newMachineId']").val())
    });
    $('#select_ul').delegate('.li-select', 'mouseover',function(){
        $('#select_ul .li-select').removeClass('li-hover');
        $(this).addClass('li-hover');
    });
}

function tip(info, x, y) {
    var eleId = 'Discussion';
    if(document.getElementById(eleId)) {
        document.getElementById(eleId).remove();
    }
	info = info || '';
    var ele = document.createElement('div');
    ele.id = eleId
    ele.className = 'chrome-plugin-simple-tip';
    ele.style.background = '#e6e6e6';
	ele.style.position = 'fixed';
	ele.style.top = (10 + y) + 'px';
	ele.style.left = (10 + x) + 'px';
	ele.style.width = '425px';
    ele.style.height = '350px';
    ele.style.zIndex = 999999;
    ele.style.padding = '10px';
    ele.style.border= "1.5px solid #a1a1a1";
    ele.style.borderRadius ='5px';
	ele.innerHTML = `
        <div>
            <span style="color:#222;font-weight:bold">Discussion</span>
            <span id="doClose" class="icon-cancel" style="padding-left:300px"></span>
        </div>
        <div style="padding:10px 0">
            <input id="myInput" class="x4-form-field x4-form-text" style="width:346px;height:25px"></input>
            <button id="doPost" style="color:black;font-weight:bold;border:'2px solid #a1a1a1';borderRadius:'5px'">post</button>
        </div>
        <div class="message_box" id="messageBox" style="overflow:scroll;max-height:260px"></div>
    `
	document.body.appendChild(ele);
    ele.classList.add('animated');

    bindEvent();
}


function writeToRally(ObjectID, text) {
    let write_message = {type: 'writeDiscussion', objectID: ObjectID, text: text};
    chrome.runtime.sendMessage(write_message, function(response) {
        console.log(response);
    });
}

function writePMStatueToRally(ObjectID, APIKey, text) {
    const fieldName = 'c_PMStatus';

    let message = {type: 'updatePortfolioItem', objectID: ObjectID, APIKey: APIKey, fieldName: fieldName, fieldValue: text};
    chrome.runtime.sendMessage(message, function(response) {
        console.log(response);
    });
}

function clearTarget() {
    window.rallyClickTarget = undefined;
}

function UpdateObjectID() {
    // var current = window.rallyClickTarget;
    // return current.parentNode.children[3].innerText;
    //objectID = '292227692176';
}

function getProperty (key) {
    if(!localStorage.getItem(RALLY_PROPERTIES)) return false;
    const rallyValue = JSON.parse(localStorage.getItem(RALLY_PROPERTIES));
    return rallyValue[key];
}

// ------------------------ BEGIN (TAG messages send to background) ------------------------
function addDefectTagsWithKey(tagList, callback) {
    let message = {type: 'addDefectTags', objectID: objectID, tagList: tagList};
    chrome.runtime.sendMessage(message, function(response) {
        callback(response);
    });
}

function removeDefectTagsWithKey(tagList, callback) {
    message = {type: 'removeDefectTags', objectID: objectID, tagList: tagList};
    chrome.runtime.sendMessage(message, function(response) {
        callback(response);
    });
}
// ------------------------ End   (TAG messages send to background) ------------------------