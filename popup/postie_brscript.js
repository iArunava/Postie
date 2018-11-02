$(document).ready(function() {
    console.log('ready');
});

$('#id--all-posts-btn').click(() => {
    browser.tabs.create({
        url: './allposts.html'
    })
});
