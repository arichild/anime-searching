const mainUrl = 'https://kitsu.io/api/edge';

window.addEventListener('load', pageLoaded);

function searchAnime(e) {
  const form = new FormData(this);
  const query = form.get('search-anime');

  e.preventDefault();

  if(query.length !== 0) {
    fetch(`${mainUrl}/anime?filter[text]=${query}`) 
    .then(res => res.json())
    .then(updDom)
    .catch(err => console.warm(err.message))
  } 
}

function updDom(res) {
  const searchResult = document.getElementById('result');
  const animeByCategories = res.data
    .reduce((acc, data) => {
        const {showType} = data.attributes;
        
        if (acc[showType] === undefined) 
        acc[showType] = [];
        acc[showType].push(data);

        return acc;
    }, {});

  searchResult.innerHTML = Object.keys(animeByCategories).map(key => {
      const animesHTML = animeByCategories[key]
        .sort((a, b) => a.attributes.id-b.attributes.id)
        .map(item => {

          if (item.attributes.episodeCount === null) {
            item.attributes.episodeCount = 0;
          }

          return `
            <div class='card'>
              <div class="img-box">
                <img src='${item.attributes.posterImage.original}'>
                <div class="rating">${Math.floor(item.attributes.averageRating * 10) / 100}</div>
              </div>
              <div class='name'>${item.attributes.titles.en_jp}</div>
              <div class='episodes'>Episodes: ${item.attributes.episodeCount}</div>
              <div class='description'>${item.attributes.synopsis}</div>
              <div class="trailer-btn">
                <a href="https://www.youtube.com/watch?v=${item.attributes.youtubeVideoId}">
                  Watch trailer
                </a>
              </div>
            </div>
          `;
      }).join('');

      return `
        <section>
            <h3>Type: ${key.toUpperCase()}</h3>
            <div class="row">${animesHTML}</div>
        </section>
      `
    }).join('');
}

function pageLoaded() {
  const form = document.getElementById('search-form');
  form.addEventListener('submit', searchAnime)
}