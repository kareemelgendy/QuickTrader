// Function that executes the scripts on the order entry page
function executeScript(active_url){
    // Links to the stock and option order pages
    var option_order_page = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\#\/modal\/trading\/order-entry\/option\/edit/;
    var option_order_page_other = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\?\=\#\/modal\/trading\/order-entry\/option\/edit/;
    var stock_order_page = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\#\/modal\/trading\/order-entry\/equity\/edit/;
    var stock_order_page_other = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\?\=\#\/modal\/trading\/order-entry\/equity\/edit/;

    // Checking if the user is on the order page
    if((stock_order_page.test(active_url))  || (stock_order_page_other.test(active_url))){   
        security_type = "stocks";
        chrome.tabs.executeScript(null, {file: './foreground.js'}, () => console.log("Injecting"));

    } else if((option_order_page.test(active_url)) || (option_order_page_other.test(active_url))){
        security_type = "options";
        chrome.tabs.executeScript(null, {file: './foreground.js'}, () => console.log("Injecting"));
    }
}

// Adding Listener to get users current tab
chrome.tabs.onActivated.addListener(tab => {
    // Getting the current tab
    chrome.tabs.get(tab.tabId, current => {
        // Executing the script if order page is open
        console.log(current.url);
        executeScript(current.url);
    });
});

// Adding Listener to check for URL changes in user's active tab
chrome.tabs.onUpdated.addListener((tabId, updated, tab) => {
    // Checking for URL changes on active tabs
    if(tab.active && updated.url){
        // Executing the script if the order page is open
        console.log(updated.url);
        executeScript(updated.url);
    }
}); 
