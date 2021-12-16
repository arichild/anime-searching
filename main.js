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
  res.data.sort((a, b) => a.attributes.userCount-b.attributes.userCount).forEach(item => {
    console.log(item)
    const card = document.createElement('div');

      card.classList.add('card');

      card.innerHTML = `
        <img src='${item.attributes.posterImage.original}'>
        <div class="name">${item.attributes.titles.en_jp}</div>
        <div class="episodes">Episodes: ${item.attributes.episodeCount}</div>
        <div class="description">${item.attributes.description}</div>
      `;

      document.querySelector('.app').appendChild(card)
  });
}

function pageLoaded() {
  const form = document.getElementById('search-form');
  form.addEventListener('submit', searchAnime)
}

  window.addEventListener('load', pageLoaded);