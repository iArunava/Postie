$(document).ready(function() {
    console.log('ready');
    fetch_all_and_upd();
});

let posts_fetched = (obj) => {
    clear_screen();

    console.log(obj);
    Object.values(obj).forEach((post_obj) => {
        console.log(post_obj.hasOwnProperty('key'));
        if (!post_obj.hasOwnProperty('key')) return;

        let pkey = post_obj.key;
        // Skipping this key if is not a post
        if (pkey[0] !== 'p') return;

        append_post(post_obj);
    });

}

let append_post = (post_obj) => {
    $("#div--linkedin-posts").append(media_template(post_obj));
}

let fetch_all_and_upd = () => {
    let get_posts = browser.storage.local.get();
    get_posts.then(posts_fetched, on_error);
}

let media_template = (post_obj) => {
    let pimgurl = url_from_background_src(post_obj.pimg);

    let template = `
    <article id="${post_obj.key}" class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img src="${pimgurl}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>${post_obj.pname}</strong> <!--<small>@johnsmith</small> <small>31m</small>-->
            <br>
                ${post_obj.pd}
            <br>
            ${post_obj.pimgs.length > 0 ?
              `<img src="${url_from_background_src(post_obj.pimgs[0])}">` :
              ``
            }

            ${post_obj.alink.length > 0 ?
              `<img src="${url_from_background_src(post_obj.atnail)}"><br/><` :
              ``
            }
          </p>
        </div>
        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-reply"></i></span>
            </a>
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-retweet"></i></span>
            </a>
            <a class="level-item">
              <span class="icon is-small"><i class="fas fa-heart"></i></span>
            </a>
          </div>
        </nav>
      </div>
      <div class="media-right">
        <button class="delete"></button>
      </div>
    </article>
    `;

    return template;
}

let url_from_background_src = (bgurl) => {
    return bgurl.substring(5, bgurl.length-2);
}

$("#id--delete-all").click(() => {
    let clear_all_posts = browser.storage.local.clear();
    clear_all_posts.then(() => {
        console.log('All posts Deleted!!')
        clear_screen();
    }, on_error);
});

let clear_screen = () => {
    $("#div--linkedin-posts").empty();
    $("#div--twitter-posts").empty();
}

let on_error = () => {
    console.log('Something went wrong!');
}
