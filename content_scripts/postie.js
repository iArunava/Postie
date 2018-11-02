let bars_updated = [];
let postie_img_url = browser.extension.getURL("icons/postie-16.png");

$(document).ready(function() {
    console.log('ready');

    setInterval(() => {
        inject_onclicks_to_controllers();
    }, 1000);

    document.body.style.border = "5px solid red";
});
/*
$("#postie").click((this) => {
    console.log("sd");
});
*/

let inject_onclicks_to_controllers = () => {
    let feed_controllers = document.getElementsByClassName('feed-shared-social-action-bar');
    let curr_id = "";

    for (let i=0; i<feed_controllers.length; ++i) {
        curr_id = feed_controllers[i].attributes[0].nodeValue;
        if (bars_updated.includes(curr_id)) continue;
        bars_updated.push(curr_id);
        let this_social_bar = $("#" + curr_id);
        this_social_bar.append(get_postie_btn_linkedin_template(curr_id));
    }
}

let get_postie_btn_linkedin_template = (curr_id) => {
    let template = `
    <button data-control-name="like_toggle" id="postie" class="like-button button like feed-shared-social-action-bar__action-btn social-action-btn mr5 ember-view">
         <span class="like-icon svg-icon-wrap"><li-icon aria-hidden="true" type="like-icon" size="small">
         <img src='${postie_img_url}'/>
         </span>
        <span aria-hidden="true"> Postie </span>
    </button>
    `;
    return template;
}
