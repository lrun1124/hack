console.log('content script!');

document.addEventListener('click', function(event) {
    if(event.target.innerText === 'Link'){
        event.preventDefault();
        console.log('click');

        // send message to background.js
        readFromRally('yayaya');
        const APIKey = '_N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk';// _N4lmXxoDRnamXQ7lldXDF1VvEpkPUyGjfoVqqodIUk
        const objectID = '353727744848';
        // 1) read discussion
        // let message = {type: 'readDiscussion', objectID: objectID, APIKey: APIKey};
        // chrome.runtime.sendMessage(message, function(response) {
        //     console.log(response);
        // });

        // 2) write discussion
        let message = {type: 'writeDiscussion', objectID: objectID, APIKey: APIKey, text: 'lihaoyayay  hahaha  test ddsvds.'};
        chrome.runtime.sendMessage(message, function(response) {
            console.log(response);
        });


        tip(event.target.href, event.clientX, event.clientY);
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
            writeToRally();
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

function readFromRally(ObjectID) {
    //todo
}

function writeToRally(ObjectID) {
    //todo
}