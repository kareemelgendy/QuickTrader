
// Save the selection in storage
function saveOptions(selection){
    chrome.storage.local.set({'fillType': selection}, function(){});
}

// Get the user's selection
function getUserSelection(){

    const options = document.querySelectorAll('input[name="option"]');
    
    let selectedValue;
    for (const selection of options){
        if(selection.checked){
            selectedValue = selection.value;
            break;
        }
    }
    // Save the selection
    saveOptions(selectedValue);
}

// Return the saved fill type 
function getSavedOption(){

    var selection;
    var promise = new Promise(function(success){
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
    return promise;
}

// Restore previous selection when popup is opened
async function restorePreviousOption(){

    // Get saved option and set button
    let userSelection = getSavedOption(); 
    userSelection.then(function(selection){
        const options = document.querySelectorAll('input[name="option"]');
        for (option of options){
            if(option.value == selection){
                option.checked = true;
                break;
            }
        }
    });
}

window.addEventListener('load', function() {

    // Popup open
    if(location.hash == '#popup'){
        restorePreviousOption();

        // Save button click
        const btn = document.getElementById('savebtn');
        btn.addEventListener('click', function() {
            getUserSelection();
            btn.blur();

            // Executing the script with updated fill type
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                if(checkPage(tabs[0].url) && optionTableStatus() != 1){
                    chrome.tabs.executeScript(null, {file: './js/foreground.js'}, () => console.log("Injecting"));
                }
            }); 
        });
    }
});