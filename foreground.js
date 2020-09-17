
// Function to get the Stock/Option Contract Quote
function getQuote(fill_type){
    // Getting the quote
    quote = document.getElementsByClassName('td-wb-trading-quote-section');
    trading_price = quote[1].innerText.split("\n")[1].split(" ");

    // Deriving the Bid, Ask & Contract Spread from the quote
    bid = trading_price[0].substring(1);
    ask = trading_price[2].substring(1);
    spread = (ask_price - bid_price).toFixed(2);
    
    // Median - Second Quartile
    middle_price = +bid_price + +(spread/2).toFixed(2);
    // First Quartile
    first_quartile = +bid_price + +((middle_price - bid_price)/2).toFixed(2);
    // Third Quartile
    third_quartile = +middle_price + +((ask_price - middle_price)/2).toFixed(2); 

    console.log("Price types found");

    // Checking user's selected fill type
    if(fill_type == "Bid"){
        fill_type = bid;

    } else if(fill_type == "Above Bid"){
        fill_type = first_quartile;

    } else if(fill_type == "Middle Price"){
        fill_type = middle_price;

    } else if(fill_type == "Below Ask"){
        fill_type = third_quartile;

    } else if(fill_type == "Ask"){
        fill_type = ask;
        
    // Deafult if nothing selected
    } else {
        fill_type = middle_price;
    }

    console.log("Fill Type Assigned");

    // This does not fill and stay
    //document.ElementById('td-wb-order-price-amount-limit-price').value = fill_type.toString();
    document.getElementsByClassName('td-wb-order-price-amount__input-limit-price ng-touched ng-dirty ng-valid').value = fill_type.toString();

    console.log("Price Entered in Field");
}

// Checking if the all the required fields are filled 
function requiredFields(security_type){
    // Ticker Symbol - Both Stocks and Options
    ticker_symbol = document.getElementsByTagName('td-wb-symbol-lookup')[0].className;
    //console.log(`Ticker: ${ticker_symbol}`);
    
    // If ticker_symbol == "ng-untouched ng-dirty ng-valid" then valid else not --> "ng-untouched ng-dirty ng-invalid"

    if(ticker_symbol == 'ng-untouched ng-dirty ng-valid'){ 
        console.log("TICKER FILLED - 0");

        // Checking the other three fields for option orders
        if(security_type == 'options'){

            // Strike Price Slot - Options Only
            strike_price = document.getElementsByClassName('td-wb-option-picker__strike-price ng-untouched ng-pristine ng-invalid').length;
            //console.log("strike: " + strike_price);
            console.log("STRIKE FILLED - 1");
            // If 1 then empty if 0 then filled;
                
            // Expiry Date Slot - Options Only
            //contract_expiry = document.getElementsByClassName('td-wb-option-picker__expiry-date ng-untouched ng-valid').length;  // FILLED 
            contract_expiry = document.getElementsByClassName('td-wb-option-picker__expiry-date ng-untouched ng-pristine ng-invalid').length; // EMPTY 
            console.log("EXPIRY FILLED - 2");
            //console.log(`expiry: ${contract_expiry}`);
            // If 1 then empty if 0 then filled
 
            // Contract Type 
            contract_type = document.getElementsByClassName('td-wb-option-picker__option-type ng-untouched ng-pristine ng-invalid').length;
            console.log("TYPE FILLED - 3")   ;         
            //console.log(`contract Type: ${contract_type}`);
            // If 1 then empty if 0 then filled

            // Price type - Options
            options_price_type = document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-valid ng-dirty')[0].innerText ;
            console.log("PRICE TYPE FILLED - Options - 4");
            filled = true;

        } else {
            // Price type - Stocks
            if(document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-dirty').length == 1){
                stocks_price_type = document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-valid ng-dirty')[0].innerText;
                console.log(`price type: ${price_type}`);
                console.log("PRICE TYPE FILLED - Stocks - 4");
                filled = true;
            }
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
            console.log("REFRESH BUTTON PRESSED");
            requiredFields(security_type);
            getQuote(fill_type);
        }  
    });
}

///////////////////////////////////////////

// Get the security type from background
security_type = 'options';

// Get the fill type from the background
fill_type = 'middle';

// Check if all the required fields are filled
////// While on the order page 
// Watch for field changes 
// Run the requiredFields() function

requiredFields(security_type);

// While filled then 
// while(filled){
if(filled){
    // Watch for refresh button click
    refreshPrice(fill_type);

    // If the security the user is trading is stocks
    if(security_type == "stocks"){

        // If all the required fields are filled out on the order entry page
        if((ticker_symbol == "ng-untouched ng-dirty ng-valid") && (stocks_price_type == "Limit")){

            console.log('PAGE FILLED - Stocks')

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
        && (strike_price == 0) && (contract_expiry == 0) && (options_price_type == "Limit")){

            console.log('PAGE FILLED - Options')
            // Setting badge icon to indicate the extension has been activated
            chrome.browserAction.setBadgeText({text: 'ON'});
            chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});

            // Get Contract Quote
            getQuote(fill_type);

            // Refreshing the price
            refreshPrice();
        }
    }
}