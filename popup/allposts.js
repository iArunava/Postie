$(document).ready(function() {
    console.log('ready');
    fetch_all_and_upd();
});

let posts_fetched = (obj) => {
    clear_screen();

    Object.values(obj).forEach((post_obj) => {
        let pkey = post_obj.key;
    });

}

let fetch_all_and_upd = () => {
    let get_posts = browser.storage.local.get();
    get_posts.then(posts_fetched, on_error);
}

let media_template = () => {
    let template = `
    <article class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <img src="https://bulma.io/images/placeholders/128x128.png">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
            <br>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.
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

let clear_screen = () => {
    $("#div--linkedin-posts").empty();
    $("#div--twitter-posts").empty();
}

function on_error = () => {
    console.log('Something went wrong!');
}
