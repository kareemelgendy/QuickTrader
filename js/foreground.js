
// Returns the user's fill selection
function getFillType(){

    var selection;
    var fillType = new Promise(function(success){
        chrome.storage.local.get(['fillType'], function(result) {

            // If nothing is saved, use default
            if(result.fillType == undefined){
                selection = 'Middle Price';
                chrome.storage.local.set({'fillType': selection});
            } else{
                selection = result.fillType;
            }
            success(selection);
        });
    });
    return fillType;
}

// Check if the all the required fields are filled 
function requiredFields(securityType){

    // Ticker Symbol
    const tickerField = document.getElementById('selectedSymbol');

    // Valid ticker entered
    if(tickerField && tickerField.value){

        // Option Contracts
        if(securityType == 'option'){

            // Dropdown fields - Strike, Expiry, Type
            let count = 0;
            const dropdowns = document.getElementsByClassName('td-wb-dropdown-toggle__placeholder ng-star-inserted');
            if(dropdowns){
                for(field of dropdowns){
                    if(field.innerText != 'Select'){
                        count ++;
                    }
                }
            }
            let optionsPriceType = document.getElementById('td-wb-dropdown-order-price');

            // Order page completed
            if(optionsPriceType && count <= 1 && optionsPriceType.innerText.split('\n')[1] == 'Limit'){
                return true;
            }

        // Stocks
        } else if(securityType == 'equity'){
            let stocksPriceType = document.getElementById('td-wb-dropdown-order-price');

            // Order page completed
            if(stocksPriceType && stocksPriceType.innerText.split('\n')[1] == 'Limit'){
                return true;
            }            
        }
    }
    return false;
}

// Gets the Stock/Option Contract Quote
// Returns the limit price 
function getQuote(fillType){

    let quoteSection = document.getElementsByClassName('td-wb-trading-quote-option-ticker');

    if(quoteSection){

        quote = document.getElementsByClassName('td-wb-trading-quote-section'); 
        tradingPrice = quote[1].innerText.split("\n")[1].split(" ");

        // Deriving the bid, ask & security's spread from the quote
        let bid = tradingPrice[0].substring(1).replace(",", "");
        let ask = tradingPrice[2].substring(1).replace(",", "");
        let spread = (ask - bid).toFixed(2);

        // Calculating the median and first & third quartiles
        let median = +bid + +(spread/2).toFixed(2);
        let lowerQuartile = +bid + +((median - bid)/2).toFixed(2);
        let upperQuartile = +median + +((ask - median)/2).toFixed(2); 

        // Returning the price 
        var fill;
        switch(fillType){
            case 'Bid':
                fill = bid;
                break;
            case 'Above Bid':
                fill = lowerQuartile;
                break;
            case 'Middle Price':
                fill = median;
                break;
            case 'Below Ask':
                fill = upperQuartile;
                break;
            case 'Ask':
                fill = ask;
                break;
            default:
                fill = median;
        }
        return fill;
    }
    return null;
}

// Fills the limit price field
function fillField(fillType){
    let price = getQuote(fillType);
    const priceField = document.getElementById('td-wb-order-price-amount-limit-price');
    priceField.value = price.toFixed(2);
    priceField.dispatchEvent(new Event('keyup'));
}

// Getting the security type
var securityType;
chrome.runtime.onMessage.addListener(function (response) {
    securityType = response.security;
});

// Get the fill type
var fill = getFillType();
fill.then(function(fillType){
    document.addEventListener('click', function(event){

        // Order page elements
        if(event.target.id == 'selectedSymbol' // Ticker field
        || event.target.id == 'selectedSymbolsearch-button' // Ticker search button
        || event.target.className == 'td-wb-dropdown-toggle__data' // Dropdown
        || event.target.className == 'td-wb-dropdown-item__data' // Dropdown items
        || event.target.id == 'td-wb-number-spinner-order-quantity' // Quantity
        || event.target.id == 'td-wb-order-price-amount-limit-price' // Price Field
        || event.target.className == 'td-wb-icon td-wb-icon--refresh'){ // Refresh button
                        
            // Order page status
            if(requiredFields(securityType)){
                chrome.extension.sendMessage({status: 'Order Page Complete'});
                fillField(fillType);
            } else {
                chrome.extension.sendMessage({status: 'Order Page Incomplete'});
            }
        }
    });
})