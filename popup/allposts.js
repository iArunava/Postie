let brwsr;

const LI = 'linkedin';
const FF = "firefox";

$(document).ready(function() {
    console.log('ready');
    brwsr = navigator.sayswho.split(" ")[0].toLowerCase();
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
    let get_posts;
    if (brwsr === 'firefox') {
        get_posts = browser.storage.local.get();
        get_posts.then(posts_fetched, on_error);
    } else {
        let get_posts = chrome.storage.local.get(null, (posts_obj) => {
            posts_fetched(posts_obj);
        });
    }
}

let media_template = (post_obj) => {
    let pimgurl = url_from_background_src(post_obj.pimg);

    let template = `
    <div class="center--content">
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
              `
              <div>
                  <a href="${post_obj.alink}" target="_blank"><img src="${url_from_background_src(post_obj.atnail)}"></a><br/>
                  <h3> ${post_obj.aname} </h3>
                  <h4> ${post_obj.asite} >/h4>
              </div>
              ` :
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
    </div>
    <hr/>
    `;

    return template;
}

let url_from_background_src = (bgurl) => {
    return bgurl.substring(5, bgurl.length-2);
}

$("#id--delete-all").click(() => {
    if (brwsr === 'firefox') {
        let clear_all_posts = browser.storage.local.clear();
        clear_all_posts.then(after_delete_all_posts, on_error);
    } else {
        let clear_all_posts = chrome.storage.local.clear(after_delete_all_posts);
    }
});

let after_delete_all_posts = () => {
    console.log('All posts Deleted!!')
    clear_screen();
}

let clear_screen = () => {
    $("#div--linkedin-posts").empty();
    $("#div--twitter-posts").empty();
}

let on_error = () => {
    console.log('Something went wrong!');
}

/* https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser */
navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

/*
$("id--delete-all").click(() => {
    swal({
        title: "Are you sure?",
        text: "You will not be able to redo it",
        icon: "warning",
        buttons: ["Cancel", "Confirm"],
    })
});
*/
