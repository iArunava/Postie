let bars_updated = [];
let postie_img_url = browser.extension.getURL("icons/postie-16.png");

$(document).ready(function() {
    console.log('ready');

    setInterval(() => {
        inject_onclicks_to_controllers();
    }, 1000);

    document.addEventListener("click", () => {
        let click_id = this['activeElement']['attributes'][1]['nodeValue'];
        if (click_id.split('-')[0] !== 'postie') return;
        let feed_id = click_id.split('-')[1];
        console.log(feed_id);

        // Getting the feed url
        let feed_url = $("#" + feed_id).parent().attr('data-id');
        if (typeof feed_url === typeof undefined || feed_url === false) {
            feed_url = $("#" + feed_id).parent().parent().attr('data-id');
        }
        feed_url = "https://www.linkedin.com/feed/update/" + feed_url + "/";

        // Getting the rest of the data from the post
        let feed_children = $("#" + feed_id).children();

        console.log(feed_children);
        let poster_meta_img_link;
        let poster_link;
        let poster_meta_name;
        let post_details;

        for (let i=0; i <= feed_children.length; ++i) {
            let curr_obj = get_id_from_feed_children(feed_children[i]);
            if (curr_obj.hasClass('feed-shared-actor')) {
                let poster_meta_child = curr_obj.children();
                poster_link = get_id_from_feed_children(poster_meta_child[0]).attr('href');
                poster_meta_child = poster_meta_child.children().children().children()
                                                    .children().children();
                poster_meta_img_link = get_id_from_feed_children(poster_meta_child[0]).css('background-image');
                poster_meta_child = poster_meta_child.children();
                poster_meta_name = poster_meta_child[0]['firstChild']['data'];
            }
        }
        //console.log(feed_poster_img)
    });

    document.body.style.border = "5px solid red";
});

let get_id_from_feed_children = (feed_child) => {
    return $("#" + feed_child['attributes'].getNamedItem('id').nodeValue);
}

let inject_onclicks_to_controllers = () => {
    let feed_controllers = document.getElementsByClassName('feed-shared-social-action-bar');
    let curr_id = "";

    for (let i=0; i<feed_controllers.length; ++i) {
        curr_id = feed_controllers[i].attributes[0].nodeValue;
        if (bars_updated.includes(curr_id)) continue;
        bars_updated.push(curr_id);
        let this_social_bar = $("#" + curr_id);
        let feed_content_id = this_social_bar.parent().attr('id');
        this_social_bar.append(get_postie_btn_linkedin_template(feed_content_id));
    }
}

let get_postie_btn_linkedin_template = (id) => {
    let template = `
    <button data-control-name="like_toggle" id="postie-${id}" class="like-button button like feed-shared-social-action-bar__action-btn social-action-btn mr5 ember-view">
         <span class="like-icon svg-icon-wrap"><li-icon aria-hidden="true" type="like-icon" size="small">
         <img src='${postie_img_url}'/>
         </span>
        <span aria-hidden="true"> Postie </span>
    </button>
    `;
    return template;
}
