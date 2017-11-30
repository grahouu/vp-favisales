$(document).ready(function () {

    let timeout = 8000;

    setTimeout(function () {
        chrome.tabs.query({ active: true, highlighted: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "run" }, function (response) {
                if (response !== null) console.log('Response:', response);
                else console.log('Response is null');
            });
        });
    }, timeout);

})