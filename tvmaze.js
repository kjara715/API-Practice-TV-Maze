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
    let obj = {
      id: item.show.id,
      name: item.show.name,
      summary: item.show.summary,
      image: item.show.image ? item.show.image.medium : "https://tinyurl.com/tv-missing"
    }
    showArray.push(obj);
  }

  
  console.log(showArray)
  return showArray
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  //<img class="card-img-top" src="/path/to/image">
  //give images unique ids so I can reassign images
  let n=0;
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" id="${n}">
             <p class="card-text">${show.summary}</p>
           </div>
           <button class="episodes">Episodes</button>
         </div>
       </div>
      `);
      

    $showsList.append($item);

    let img = document.getElementById(`${n}`)
    

      if (show.image){
        // $(`#${n}`).attr('src', "show.image" )  
        img.src=`${show.image}`;
      } else {
        // $(`#${n}`).attr('src', "https://tinyurl.com/tv-missing" )
        img.src= "https://tinyurl.com/tv-missing";
      }
    
    n++ //n changes (0, 1, 2, 3....etc) so each image gets unique id per show
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


/** Given a show ID, return list of episodes:F
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
  console.log(episodeArray)
  return episodeArray
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}

async function populateEpisodes(episodeArray){
  const $episodesList = $('#episodes-list');
  $episodesList.empty();
  for(let episode of episodeArray){
    let item=$(
    `<li>
      ${episode.name}
    </li>`)
    $episodesList.append(item)
  }

  $("#episodes-area").show(); //will show the area (initially hidden)

}

$("#shows-list").on("click", ".episodes",  async function(evt){
  evt.preventDefault();
  console.log('clicked');
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);

  // let id=await searchShows(query)
 
  // console.log(this.parent())
})