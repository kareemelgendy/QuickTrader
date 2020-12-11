
// Function that executes the scripts on the order entry page
function tdScript(active_url){

    // Links to the stock and option order pages
    let option_order_page = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\#\/modal\/trading\/order-entry\/option\/edit/;
    let option_order_page_other = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\?\=\#\/modal\/trading\/order-entry\/option\/edit/;
    let stock_order_page = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\#\/modal\/trading\/order-entry\/equity\/edit/;
    let stock_order_page_other = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\?\=\#\/modal\/trading\/order-entry\/equity\/edit/;

    security_type = active_url.split("/").slice(-2)[0]; // Getting the security type

    // If the user is on the Dashboard Order Page
    if((stock_order_page.test(active_url))  || (stock_order_page_other.test(active_url)) ||
        (option_order_page.test(active_url)) || (option_order_page_other.test(active_url))){

        // Sending security type
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {security: security_type});  
        }); 

        // Executing the script
        chrome.tabs.executeScript({file: './js/foreground.js'}, () => console.log("Injecting"));
        
        // Listening for badge command
        chrome.runtime.onMessage.addListener(function(message) {
            if(message.status == "Fields Filled"){
                chrome.browserAction.setBadgeText({text: 'ON'});
                chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
            } else {
                chrome.browserAction.setBadgeText({text: ''});
            }
        });

    // If user leaves the order page 
    } else {
        chrome.browserAction.setBadgeText({text:''});
    }
}

// Listen to users current tab
chrome.tabs.onActivated.addListener(function(tab) {
    chrome.tabs.get(tab.tabId, current => {
        tdScript(current.url);
    });
});

// Listen for URL changes in user's active tab (switching between securities)
chrome.tabs.onUpdated.addListener(function(updated, tab) {
    if(tab.active && updated.url){
        tdScript(updated.url);
    }
}); 
