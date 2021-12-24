mainUrl = 'https://kitsu.io/api/edge';

function searchAnime(e) {
  e.preventDefault();

  const form = new FormData(this);
  const query = form.get('search-anime');

  if(query.length !== 0) {
    fetch(`${mainUrl}/anime?filter[text]=${query}`) 
    .then(res => res.json())
    .then(updDom)
    .catch(err => console.warm(err.message))
  } 
}

function updDom(res) {
  const searchResult = document.getElementById('result');
  
  searchResult.innerHTML = res.data
  .sort((a, b) => a.attributes.id-b.attributes.id)
  .map(item => {      
      console.log(item)

      return `
        <div class='card'>
          <img src='${item.attributes.posterImage.original}'>
          <div class='name'>${item.attributes.titles.en_jp}</div>
          <div class='episodes'>Episodes: ${item.attributes.episodeCount}</div>
          <div class='description'>${item.attributes.description}</div>
        </div>
      `;
  }).join('');
}

function pageLoaded() {
  const form = document.getElementById('search-form');
  form.addEventListener('submit', searchAnime)
}

window.addEventListener('load', pageLoaded);