window.addEventListener('DOMContentLoaded', () => {
  function init() {
  //   const request = new XMLHttpRequest();
  //   request.open('GET', 'https://kitsu.io/api/edge/anime');
  //   request.setRequestHeader('Content-type', 'aplication/json; charset=utf-8')
  //   request.send();

  //   request.addEventListener('readystatechange', function() {
  //     if (request.readyState === 4 && request.status === 200) {
  //       let data = JSON.parse(request.response);
        

  //     } else {
  //       console.error('чот сломалось')
  //     }
  //   })

    getResource('https://kitsu.io/api/edge/anime')
      .then(data => createCards(data))
      .catch(err =>  console.error(err))
  }

  async function getResource(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`error XD: ${url}, status ${res.status}`);
    }

    return await res.json();
  }

  function createCards(response) {
    response.data.forEach(item => {
      const card = document.createElement('div');

      card.classList.add('card');

      card.innerHTML = `
        <img src='${item.attributes.posterImage.original}'>
        <div class="name">${item.attributes.titles.en_jp}</div>
        <div class="episodes">Episodes: ${item.attributes.episodeCount}</div>
        <div class="description">${item.attributes.description}</div>
      `;

      document.querySelector('.app').appendChild(card)
    })
  }

  init();
})