
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
    if(tickerField && tickerField.value){

        console.log('ticker valid');

        // Option Contracts
        if(securityType == 'option'){

            // Dropdown fields - Strike, Expiry, Type
            let count = 0;
            const dropdowns = document.getElementsByClassName('td-wb-dropdown-toggle__placeholder ng-star-inserted');
            if(dropdowns){

                for(field of dropdowns){
                    console.log(field.selected);
                    if(field.innerText != 'Select'){
                        count ++;
                        console.log('dropdown ' + count);
                    }
                }
            }

            // Contract Price Type
            let optionsPriceType = document.getElementById('td-wb-dropdown-order-price');
            console.log(optionsPriceType + '-------' + count + '-------' + optionsPriceType.innerText.split('\n')[1]);
            if(optionsPriceType && count <= 1 && optionsPriceType.innerText.split('\n')[1] == 'Limit'){
                console.log('option filled');
                return true;
            }

        // Stocks
        } else if(securityType == 'equity'){
            // Stocks Price Type
            let stocksPriceType = document.getElementById('td-wb-dropdown-order-price');
            console.log(stocksPriceType + '-------' + '-------' + stocksPriceType.innerText[1]);
            if(stocksPriceType && stocksPriceType.innerText.split('\n')[1] == 'Limit'){
                console.log('stocks filled');
                return true;
            }            
        }
    }
    return false;
}

// Gets the Stock/Option Contract Quote
// Returns the limit price 
function getQuote(fillType){

    // Getting the quote
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

    var fill;

    // Returning the price 
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

// Fills the limit price field
function fillField(fillType){
    // let price = parseFloat(getQuote(fillType));
    let price = getQuote(fillType);
    const priceField = document.getElementById('td-wb-order-price-amount-limit-price');
    priceField.dispatchEvent(new Event('focus'));
    priceField.value = price.toFixed(2);
    priceField.dispatchEvent(new Event('keyup'));
    priceField.dispatchEvent(new Event('blur'));
}