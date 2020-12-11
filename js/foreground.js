
// Check if the all the required fields are filled 
function requiredFields(securityType){

    // Ticker Symbol - Both Stocks and Options
    if(document.getElementsByTagName('td-wb-symbol-lookup')[0].className != undefined){
        tickerField = document.getElementsByTagName('td-wb-symbol-lookup')[0].className;
    }
    if(tickerField == 'ng-untouched ng-dirty ng-valid'){ 
        if(securityType == "option"){
            var strikePrice = document.getElementsByClassName('td-wb-option-picker__strike-price ng-untouched ng-pristine ng-invalid').length; 
            var contractExpiry = document.getElementsByClassName('td-wb-option-picker__expiry-date ng-untouched ng-pristine ng-invalid').length; 
            var contractType = document.getElementsByClassName('td-wb-option-picker__option-type ng-untouched ng-pristine ng-invalid').length; 
            
            if(document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-valid ng-dirty').length == 0){
                optionsPriceType = document.getElementsByClassName('ng-star-inserted')[184].innerText;
            } else {
                optionsPriceType = document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-valid ng-dirty')[0].innerText.split('\n')[1]; 
            }
            // All required fields for options are filled
            if(strikePrice == 0 && contractExpiry == 0 && contractType == 0 && optionsPriceType == 'Limit'){
                return true;
            }
        // Checking the final required field for stocks
        } else if (securityType == 'equity'){
            if(document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-dirty').length == 1){
                stocksPriceType = document.getElementsByClassName('td-wb-dropdown-order-price ng-untouched ng-valid ng-dirty')[0].innerText.split('\n')[1]; 
                if(stocksPriceType == 'Limit'){
                    return true;
                }
            }
        }
    } 
    return false;
}

// Function to get the Stock/Option Contract Quote
function getQuote(fillType){

    // Getting the quote
    quote = document.getElementsByClassName('td-wb-trading-quote-section'); // change to .querySelector
    tradingPrice = quote[1].innerText.split("\n")[1].split(" ");

    // Deriving the Bid, Ask & Underlying Security's Spread from the quote
    let bid = tradingPrice[0].substring(1).replace(",", "");
    let ask = tradingPrice[2].substring(1).replace(",", "");
    let spread = (ask - bid).toFixed(2);
    // Calculating Median and First & Third Quartiles
    let median = +bid + +(spread/2).toFixed(2);
    let lowerQuartile = +bid + +((median - bid)/2).toFixed(2);
    let upperQuartile = +median + +((ask - median)/2).toFixed(2); 

    var fill;
    // Checking user's selected fill type and passing the corresponding price
    if(fillType == "Bid"){
        fill = bid;
    } else if(fillType == "Above Bid"){
        fill = lowerQuartile;
    } else if(fillType == "Middle Price"){
        fill = median;
    } else if(fillType == "Below Ask"){
        fill = upperQuartile;
    } else if(fillType == "Ask"){
        fill = ask;
    }
    return fill;
}

// Filling field
function fillField(fillType){
    let price = parseFloat(getQuote(fillType));
    const priceField = document.getElementById('td-wb-order-price-amount-limit-price');
    priceField.dispatchEvent(new Event('focus'));
    priceField.dispatchEvent(new Event('input'));
    priceField.value = price.toFixed(2);
    priceField.dispatchEvent(new Event('keyup'));
    priceField.dispatchEvent(new Event('change'), {bubbles: true});
    priceField.dispatchEvent(new Event('blur'));
}