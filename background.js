$(document).ready(function () {

    let timeout = 6000;

    setTimeout(function () {
        chrome.tabs.query({}, function (tabs) {
            for (const tab of tabs) {
                if (tab.url.includes("https://secure.fr.vente-privee.com/ns/fr-fr/home/default/")) {
                    console.log("tabs", tab)
                    chrome.tabs.sendMessage(tab.id, { message: "run" }, function (response) {
                        if (response !== null)
                            console.log('Response:', response);
                        else
                            console.log('Response is null');
                    });
                }
            }
        });
    }, timeout);

})