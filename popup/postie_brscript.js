let brwsr;

const LI = 'linkedin';
const FF = "firefox";

$(document).ready(function() {
    console.log('ready');
    brwsr = navigator.sayswho.split(" ")[0].toLowerCase();
});

$('#id--all-posts-btn').click(() => {
    if (brwsr === 'firefox') {
        browser.tabs.create({
            url: './allposts.html'
        })
    } else {
        chrome.tabs.create({
            url: chrome.runtime.getURL('/popup/allposts.html')
        })
    }
});
