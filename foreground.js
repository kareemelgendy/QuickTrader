
/////////////// TO DO LIST /////////////////
/// 1. find a way to send security type from background to foreground
/// 2. Insert the security type into the checkCompletion function
/// 3. Code the refereshQuote() function to check for button clicks
/// 4. Make a function for the icon status on or off

// Function to get the Stock/Option Contract Quote
function getQuote(fill_type){
    // Getting the quote
    quote = document.getElementsByClassName('td-wb-trading-quote-section');
    trading_price = quote[1].innerText.split("\n")[1].split(" ");

    // Deriving the Bid, Ask & Contract Spread from the quote
    bid_price = trading_price[0].substring(1);
    ask_price = trading_price[2].substring(1);
    spread = (ask_price - bid_price).toFixed(2);
    
    // Median - Second Quartile
    middle_price = +bid_price + +(spread/2).toFixed(2);
    // First Quartile
    above_bid = +bid_price + +((middle_price - bid_price)/2).toFixed(2);
    // Third Quartile
    below_ask = +middle_price + +((ask_price - middle_price)/2).toFixed(2); 

    // Checking user's selected fill type
    if(fill_type == "bid"){
        fill_type = bid_price;
    } else if(fill_type == "upper"){
        fill_type = above_bid;
    } else if(fill_type == "middle"){
        fill_type = middle_price;
    } else if(fill_type == "lower"){
        fill_type = below_ask;
    } else if(fill_type == "ask"){
        fill_type = ask_price;
    // Deafult if nothing selected
    } else {
        fill_type = middle_price;
    }

    // This does not fill and stay
    //document.ElementById('td-wb-order-price-amount-limit-price').value = fill_type.toString();
    document.getElementsByClassName('td-wb-order-price-amount__input-limit-price ng-touched ng-dirty ng-valid').value = fill_type.toString();
}

// Checking if the all the required fields are filled 
function requiredFields(security_type){
    // Ticker Symbol - Both Stocks and Options
    ticker_symbol = document.getElementsByTagName('td-wb-symbol-lookup')[0].className;
    console.log(ticker_symbol);
    
    // If ticker_symbol == "ng-untouched ng-dirty ng-valid" then valid else not --> "ng-untouched ng-dirty ng-invalid"

    if(ticker_symbol == 'ng-untouched ng-dirty ng-valid'){ 

        // Checking the other three fields for option orders
        if(security_type == 'options'){

            // Strike Price Slot - Options Only
            strike_price = document.getElementsByClassName('td-wb-option-picker__strike-price ng-untouched ng-pristine ng-invalid').length;
            console.log("strike: " + strike_price);
            // If 1 then empty if 0 then filled
                
            // Expiry Date Slot - Options Only
            //contract_expiry = document.getElementsByClassName('td-wb-option-picker__expiry-date ng-untouched ng-valid').length;  // FILLED 
            contract_expiry = document.getElementsByClassName('td-wb-option-picker__expiry-date ng-untouched ng-pristine ng-invalid').length; // EMPTY 
            console.log(`expiry: ${contract_expiry}`);
            // If 1 then empty if 0 then filled

            // Contract Type 
            contract_type = document.getElementsByClassName('td-wb-option-picker__option-type ng-untouched ng-pristine ng-invalid').length;
            console.log(`contract Type: ${contract_type}`);
            // If 1 then empty if 0 then filled
        }

        // Price type
        if(document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-dirty').length == 1){
            price_type = document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-pristine ng-valid')[0].innerText;
            console.log(`price type: ${price_type}`);
        }
    }
}

// Function that will refresh the contract price everytime the contract price whenever the button is pressed
function refereshPrice(fill_type){
    // Listener for user clicks
    document.addEventListener("click", function(event){
        var targetElement = event.target;
        var refreshButton = document.getElementsByClassName('td-wb-icon td-wb-icon--refresh')[0];  
        
        if(targetElement == refreshButton){
            requiredFields(security_type);
            getQuote(fill_type);
            console.log("REFRESH BUTTON PRESSED")
        }  
    });
}



///////////////////////////////////////////

// 1 Get security type from background using url
security_type = 'stocks';
fill_type = 'middle';

// 2 Check if the required fields are completed
requiredFields();

// 3 
// If the security the user is trading is stocks
if(security_type == "stocks"){

    // If all the required fields are filled out on the order entry page
    if((ticker_symbol == "ng-untouched ng-dirty ng-valid") && (price_type == "Limit")){

        // Setting badge icon to indicate the extension has been activated
        chrome.browserAction.setBadgeText({text: 'ON'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});

        // Get Contract Quote
        getQuote(fill_type);

        // Refreshing the price  
        refereshPrice();
    } 

// If the security the user is trading is options
} else if(security_type == "options"){

    // If all the required fields are filled out on the order entry page
    if((ticker_symbol == "ng-untouched ng-dirty ng-valid") && (contract_type == 0) 
    && (strike_price == 0) && (contract_expiry == 0) && (price_type == "Limit")){

        // Setting badge icon to indicate the extension has been activated
        chrome.browserAction.setBadgeText({text: 'ON'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});

        // Get Contract Quote
        getQuote(fill_type);

        // Refreshing the price
        refreshPrice();
    }
}
