
function checkPage(URL){

    let optionOrderPage = 'https://webbroker.td.com/waw/brk/wb/wbr/static/main/index.html#/modal/trading/order-entry/option/edit';
    let stockOrderPage = 'https://webbroker.td.com/waw/brk/wb/wbr/static/main/index.html#/modal/trading/order-entry/equity/edit';
    let optionOrderPageOther = optionOrderPage.replace('#', '?=#');
    let stockOrderPageOther = stockOrderPage.replace('#', '?=#');

    if(URL == optionOrderPage || URL == stockOrderPage || URL == optionOrderPageOther || URL == stockOrderPageOther){
        return true;
    } 
    return false;
}

// Function that executes the scripts on the order entry page
function tdScript(activeURL){

    // Valid page
    if(checkPage(activeURL)){
        let securityType = activeURL.split("/").slice(-2)[0]; // Security type

        // Sending security type to script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {security: securityType}); 
        }); 

        // Executing the script
        chrome.tabs.executeScript(null, {file: './js/foreground.js'});
        
        // Listening for badge command
        chrome.runtime.onMessage.addListener(function(message) {
            if(message.status == "Order Page Complete"){
                chrome.browserAction.setBadgeText({text: 'ON'});
                chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
            } else {
                chrome.browserAction.setBadgeText({text: ''});
            }
        });

    // Order page left
    } else {
        chrome.browserAction.setBadgeText({text:''});
    }
}

// Get new tab information
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab){
        tdScript(tab.url);
    });
}); 

// Listening for changes to current tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    tdScript(tab.url, () => console.log('url change'));
}); 
