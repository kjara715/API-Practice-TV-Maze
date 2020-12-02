/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
// TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
async function searchShows(query) {
  
  const res = await axios.get('http://api.tvmaze.com/search/shows', {params: {
    q: query
  }})

  const shows=res.data; //array of shows
   //the res.data property contains an array of objects each with show data
  showArray=[]; //inititialized as empty array. Will push in show data for id, name, summary and image 
  for(let item of shows){
    showArray.push( {
      id: item.show.id,
      name: item.show.name,
      summary: item.show.summary,
      image: item.show.image.medium
    })
   
  }

  return showArray
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  //<img class="card-img-top" src="/path/to/image">

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src=${show.image} onerror="this.src ='https://tinyurl.com/tv-missing'">
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="episodes">Episodes</button>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodeArray=[]; //initilaize episode array for the data we want
  for(let episode of res.data){
    episodeArray.push(
      {
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number
      }
    )
    
  }

  console.log(episodeArray);
  return episodeArray
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}

async function populateEpisodes(episodeArray){
  $('#episodes-list').append('<li>')

}

$(".episodes").on("submit",  function(evt){
  evt.preventDefault();
  // let id=await searchShows(query)
  console.log('something')
  // console.log(this.parent())
})