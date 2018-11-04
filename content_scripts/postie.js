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

        let poster_meta_img_link;
        let poster_link;
        let poster_meta_name;
        let post_details = "";
        let article_shared_link = "";
        let article_tnail = "";
        let post_images = [];
        let post_vid_link = "";
        let post_vid_thumbnail_link = "";

        console.log(feed_children.length);
        console.log(feed_children);

        let jqobj = true;
        for (let i=0; i < feed_children.length; ++i) {
            jqobj = true;
            let curr_obj = get_id_from_feed_children(feed_children[i]);
            if (curr_obj == false) {
                curr_obj = feed_children[i];
                jqobj = false;
            }

            if (jqobj !== false && curr_obj.hasClass('feed-shared-actor')) {
                let poster_meta_child = curr_obj.children();
                poster_link = get_id_from_feed_children(poster_meta_child[0]).attr('href');
                poster_meta_child = poster_meta_child.children().children().children()
                                                    .children().children();
                poster_meta_img_link = get_id_from_feed_children(poster_meta_child[0]).css('background-image');
                poster_meta_child = poster_meta_child.children();
                poster_meta_name = poster_meta_child[0]['firstChild']['data'];

            } else if (jqobj !== false && curr_obj.hasClass('feed-shared-update-v2__description')) {
                let pdetail_child = curr_obj.children().children().children().children();

                for (let i = 0; i < pdetail_child.length; ++i) {
                    if (pdetail_child[i]['nodeName'].toLowerCase() == 'span') {
                        post_details += pdetail_child[i]['innerText'];
                     } else if (pdetail_child[i]['nodeName'].toLowerCase() == 'a') {
                        post_details += pdetail_child[i]['href'];
                    }
                }
                post_details = post_details.replace(/hashtag/g, "");

            } else if (jqobj === false && curr_obj['classList'].contains('feed-shared-article')) {
                //TODO
                let particle_child = curr_obj.children().children();
                article_shared_link = particle_child[0]['href'];

            } else if (jqobj !== false && curr_obj.hasClass('feed-shared-image')) {
                let pimages = curr_obj.children().children().children();
                for (let i = 0; i < pimages.length; ++i) {
                    let curr_img_obj = get_id_from_feed_children(pimages[i]);
                    let curr_img_link = curr_img_obj.children().children()
                                                .children().css('background-image');
                    post_images.push(curr_img_link);
                }

            } else if (jqobj !== false && curr_obj.hasClass('feed-shared-linkedin-video')) {
                let pvid_children = curr_obj.children().children().children().children();
                post_vid_thumbnail_link = pvid_children.children()[1]['currentSrc'];
                //TODO get the video link
            }
        }

        console.log('Out of the loop');

        // 'p' is for post
        // Next 4 letters is the first letters for the social media platform
        // Next is the unique number key
        let uid = browser.storage.local.get({'linkedin': 0});
        let key;
        let curr_post_details;

        uid.then((lkey) => {
            key = 'p-link-' + (lkey['linkedin'] + 1).toString();

            curr_post_details = {
                furl: feed_url,
                pname: poster_meta_name,
                pimg: poster_meta_img_link,
                plink: poster_link,
                pd: post_details,
                alink: article_shared_link,
                atnail: article_tnail,
                pimgs: post_images,
                ptnail: post_vid_thumbnail_link,
                pvlink: post_vid_link,
                key: key,
            }

            let saving = browser.storage.local.set({[key]: curr_post_details});
            saving.then(() => {
                console.log('Successfully saved post!');
            });
        });


    });

    document.body.style.border = "5px solid red";
});

let get_id_from_feed_children = (feed_child) => {
    if (feed_child['id'] === "") return false;
    return $("#" + feed_child['id']);
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
