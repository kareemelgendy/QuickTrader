
// Function that executes the scripts on the order entry page
function runScript(active_url){

    // Links to the stock and option order pages
    var option_order_page = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\#\/modal\/trading\/order-entry\/option\/edit/;
    var option_order_page_other = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\?\=\#\/modal\/trading\/order-entry\/option\/edit/;
    var stock_order_page = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\#\/modal\/trading\/order-entry\/equity\/edit/;
    var stock_order_page_other = /^https:\/\/webbroker\.td\.com\/waw\/brk\/wb\/wbr\/static\/main\/index\.html\?\=\#\/modal\/trading\/order-entry\/equity\/edit/;

    var security_type = null;
    var current = active_url.split("/").slice(-2)[0];

    if((stock_order_page.test(active_url))  || (stock_order_page_other.test(active_url)) ||
    (option_order_page.test(active_url)) || (option_order_page_other.test(active_url))){

        if(current == 'equity'){
            security_type = 'stocks';
        } else if(current == 'option'){
            security_type = 'options'
        }

        ///// Send security_type to foreground /////

        chrome.tabs.executeScript(null, {file: './foreground.js'}, () => console.log("Injecting"));
    }
}

function getSelection(){

    console.log("Function called");
    var selection = document.getElementsByName('fill');

    console.log("Fills recieved");

    for(var i = 0; i < selection.length; i++){
        if (selection[i].checked) {
            console.log(`Selected Fill: ${selection.value}`);
            break;
        }
    }
}

// Adding Listener to get users current tab
chrome.tabs.onActivated.addListener(tab => {
    // Getting the current tab
    chrome.tabs.get(tab.tabId, current => {
        // Executing the script if order page is open
        console.log(current.url);
        getSelection();
        runScript(current.url);
    });
});

// Adding Listener to check for URL changes in user's active tab
chrome.tabs.onUpdated.addListener((tabId, updated, tab) => {
    // Checking for URL changes on active tabs
    if(tab.active && updated.url){
        // Executing the script if the order page is open
        console.log(`Updates ${updated.url}`);
        getSelection();
        runScript(updated.url);
    }
}); 

///// Check when the popup is open /////
/// Run getSelection() while its open //
///// Send the result to foregound /////