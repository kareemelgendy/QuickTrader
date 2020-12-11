
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

// Popup
window.addEventListener('load', function() {

    if(location.hash == '#popup'){
        restorePreviousOption();

        const btn = document.getElementById('savebtn');
        btn.addEventListener('click', function() {
            getUserSelection();
            btn.blur();
        });
    }
});