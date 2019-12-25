console.log('content script!');
const REGRESSION_VALUE = [
    "Yes",
    "No",
    "TBD",
    "Found by new feature testing"
];

document.addEventListener('click', function(event) {
    if(event.target.innerText === 'Link'){
        event.preventDefault();
        console.log('click');

        // send message to background.js
        const APIKey = '_N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk';
        const objectID = '353727744848';
        // 1) read discussion
        // let message = {type: 'readDiscussion', objectID: objectID, APIKey: APIKey};
        // chrome.runtime.sendMessage(message, function(response) {
        //     console.log(response);
        // });

        // 2) write discussion
        let message = {type: 'writeDiscussion', objectID: objectID, APIKey: APIKey, text: 'lihaoyayay  hahaha  test ddsvdsa按时aaaの →.'};
        chrome.runtime.sendMessage(message, function(response) {
            console.log(response);
        });


        tip(event.target.href, event.clientX, event.clientY);
    } else if(true/*REGRESSION_VALUE.includes(event.target.innerText)*/) {
        /*
         * code example
         * modify later
        */
       console.log(REGRESSION_VALUE.includes(event.target.innerText));
        
        // send message to background.js
        const APIKey = '_N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk';
        const defectID = '341373250384'/*DE152224*/;
        const fieldName = 'c_Regression';
        const fieldValue = 'No';

        // 3) update rally regression value
        let message = {type: 'updateDefectRegression', objectID: defectID, APIKey: APIKey, fieldName: fieldName, fieldValue: fieldValue};
        chrome.runtime.sendMessage(message, function(response) {
            console.log(response);
        });

        event.target.innerText = fieldValue;
    }
});

function bindEvent(){
    var oMessageBox = document.getElementById("messageBox");
    var oInput = document.getElementById("myInput");
    var oPostBtn = document.getElementById("doPost");
    var oCloseBtn = document.getElementById("doClose");
    
    oPostBtn.onclick = function(){
        if(oInput.value){
            //写入的时间

            // here call write funtion
            // writeXXX();

            var oTime = document.createElement("div");
            oTime.className = "time";
            var myDate = new  Date();
            oTime.innerHTML = myDate.toLocaleString();
            oMessageBox.appendChild(oTime);
            
            //写入内容
            var oMessageContent = document.createElement("div");
            oMessageContent.className = "message_content";
            oMessageContent.innerHTML = oInput.value;
            oInput.value = "";
            oMessageBox.appendChild(oMessageContent);
        }
    }

    oCloseBtn.onclick = function() {
        document.getElementById('Discussion').remove();
    }
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
    ele.style.background = 'grey';
	ele.style.display = 'fixed';
	ele.style.top = (10 + y) + 'px';
	ele.style.left = (10 + x) + 'px';
	ele.style.width = '200px';
    ele.style.height = '400px';
    ele.style.zIndex = 999999;
    ele.style.overflow = 'scroll';
	ele.innerHTML = `
        <div class="title">Discussion</div><br>
        <div class="title" style="word-break:break-all" >${info}</div><br>
        <div class="message_box" id="messageBox"></div>
        <div>
            <textarea id="myInput" style="color:black"></textarea><br><br>
            <button id="doPost" style="color:grey">submit</button>&nbsp
            <button id="doClose" style="color:grey">close</button>
        </div>
    `
	document.body.appendChild(ele);
    ele.classList.add('animated');

    bindEvent();
}