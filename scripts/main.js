const CARD = 'card';
const IMG_BOX = 'img-box';
const RATING = 'rating';
const NAME = 'name';
const EPISODES = 'episodes';
const DESCRIPTION = 'description';
const TRAILER_BTN = 'trailer-btn';
const TYPE = 'type';
const ROW = 'row';

const searchResult = document.getElementById('result');
const mainUrl = 'https://kitsu.io/api/edge';

window.addEventListener('load', pageLoaded);

function searchAnime(e) {
  let form = new FormData(this);
  let query = form.get('search-anime');

  e.preventDefault();

  if(query.length !== 0) {
    fetch(`${mainUrl}/anime?filter[text]=${query}`) 
    .then(res => res.json())
    .then(updDom)
    .catch(err => console.warm(err.message))
  } 
}

function updDom(res) {
  searchResult.innerHTML = '';

  let animeByCategories = res.data
    .reduce((acc, data) => {
        let {showType} = data.attributes;
        
        if (acc[showType] === undefined) 
        acc[showType] = [];
        acc[showType].push(data);

        return acc;
    }, {});

    Object.keys(animeByCategories).map(key => {
      let animesHTML = animeByCategories[key]
        .sort((a, b) => a.attributes.id-b.attributes.id)
        .map(item => {
          return createCard(item)
        }).join('');
          return createSection(key, animesHTML)
    }).join('');
}

function createSection(key, animesHTML) {
  let section = document.createElement('section');
  let type = document.createElement('h3');
  let row = document.createElement('div');
  
  section.classList.add(`${key.toLowerCase()}`);
  type.classList.add(TYPE);
  row.classList.add(ROW);
  
  type.innerHTML = key.toUpperCase();
  row.innerHTML = animesHTML;
  
  searchResult.append(section);
  section.append(type, row);
}

function createCard(item) {
  let card = document.createElement('div');
  let imgBox = document.createElement('div');
  let img = document.createElement('img');
  let rating = document.createElement('div');
  let name = document.createElement('div');
  let episodes = document.createElement('div');
  let description = document.createElement('div')
  let trailerBtn = document.createElement('div');
  let trailer = document.createElement('a');

  if (item.attributes.episodeCount === null) {
    item.attributes.episodeCount = 0;
  }
  
  card.classList.add(CARD);
  imgBox.classList.add(IMG_BOX);
  rating.classList.add(RATING);
  name.classList.add(NAME);
  episodes.classList.add(EPISODES);
  description.classList.add(DESCRIPTION);
  trailerBtn.classList.add(TRAILER_BTN);
  
  img.src = `${item.attributes.posterImage.original}`
  rating.innerHTML = Math.floor(item.attributes.averageRating * 10) / 100;
  name.innerHTML = item.attributes.titles.en_jp;
  episodes.innerHTML = `Episodes: ${item.attributes.episodeCount}`;
  description.innerHTML = item.attributes.synopsis;
  trailer.innerHTML = 'Watch trailer';
  trailer.href = `https://www.youtube.com/watch?v=${item.attributes.youtubeVideoId}`;
  
  card.append(imgBox, name, episodes, description, trailerBtn);
  imgBox.append(img, rating);
  trailerBtn.append(trailer);

  return card.outerHTML
}

function pageLoaded() {
  let form = document.getElementById('search-form');
  form.addEventListener('submit', searchAnime)
}