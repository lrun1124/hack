console.log('content script!');


const APIKey = '_N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk';
const defaultName = 'Li Hao'; // _N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk
const defaultDate = '2019-12-28';
var objectID = '';

document.addEventListener('click', function(event) {
    if(event.target.innerText === 'Link' &&  window.openDiscussion !== false){
        event.preventDefault();
        console.log('click');

        // send message to background.js
        const temp = event.target.href.split('/');
        objectID = temp[temp.length-1];
        // read discussion
        let read_message = {type: 'readDiscussion', objectID: objectID, APIKey: APIKey};
        chrome.runtime.sendMessage(read_message, function(response) {
            console.log(response);
            var list = response.Results;
            list.forEach( function(item){
                addComment(item);
            })
        });

        tip(event.target.href, event.clientX, event.clientY);
    }
});

function bindEvent(){
    var oPostBtn = document.getElementById("doPost");
    var oCloseBtn = document.getElementById("doClose");
    var oInput = document.getElementById("myInput");
    
    oPostBtn.onclick = function(){
        if(oInput.value){          
            addComment(oInput.value, true);
            writeToRally(objectID, window.APIKey || APIKey, oInput.value);
            oInput.value = "";
        }
    }

    oCloseBtn.onclick = function() {
        document.getElementById('Discussion').remove();
    }
}

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

	ele.innerHTML = `
        <div class="">
            <span style="color:#222;font-weight:bold">Discussion</span>
            <span id="doClose" class="icon-cancel" style="padding-left:300px"></span>
        </div>
        <div style="padding:10px 0">
            <input id="myInput" class="x4-form-field x4-form-text" style="width:346px;height:25px"></input>
            <button id="doPost" style="color:black;font-weight:bold">post</button>
        </div>
        <div class="message_box" id="messageBox" style="overflow:scroll;max-height:260px"></div>
    `
	document.body.appendChild(ele);
    ele.classList.add('animated');

    bindEvent();
}


function writeToRally(ObjectID, APIKey, text) {
    let write_message = {type: 'writeDiscussion', objectID: ObjectID, APIKey: APIKey, text: text};
    chrome.runtime.sendMessage(write_message, function(response) {
        console.log(response);
    });
}