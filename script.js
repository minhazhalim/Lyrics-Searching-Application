const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const apiURL = 'https://api.lyrics.ovh';
async function searchSongs(term){
     const response = await fetch(`${apiURL}/suggest/${term}`);
     const data = await response.json();
     showData(data);
}
function showData(data){
     result.innerHTML = `
          <ul class="songs">
               ${data.data.map(song => `
                    <li>
                         <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                         <button class="button" data-artist="${song.artist.name}" data-songTitle="${song.title}">get lyrics</button>
                    </li>
               `).join('')}
          </ul>
     `;
     if(data.previous || data.next){
          more.innerHTML = `
               ${data.previous ? `<button class="button" onclick="getMoreSongs('${data.previous}')">previous</button>` : ''}
               ${data.next ? `<button class="button" onclick="getMoreSongs('${data.next}')">next</button>` : ''}
          `;
     }else{
          more.innerHTML = "";
     }
}
async function getMoreSongs(url){
     const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
     const data = await response.json();
     showData(data);
}
async function getLyrics(artist,songTitle){
     const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
     const data = await response.json();
     if(data.error){
          result.innerHTML = data.error;
     }else{
          const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>');
          result.innerHTML = `
               <h2><strong>${artist}</strong> - ${songTitle}</h2>
               <span>${lyrics}</span>
          `;
     }
     more.innerHTML = "";
}
form.addEventListener('submit',event => {
     event.preventDefault();
     const searchTerm = search.value.trim();
     if(!searchTerm){
          alert('Please Type in a Search Term');
     }else{
          searchSongs(searchTerm);
     }
});
result.addEventListener('click',event => {
     const clicked = event.target;
     if(clicked.tagName === 'BUTTON'){
          const artist = clicked.getAttribute('data-artist');
          const songTitle = clicked.getAttribute('data-songTitle');
          getLyrics(artist,songTitle);
     }
});