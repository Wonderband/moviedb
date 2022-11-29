import axios from 'axios';
import createGallery from '../templates/movies-list.hbs';

const moviesGallery = document.querySelector('.gallery');

const API_KEY = "0fd1ddf45233c721325ad47f082cd332";
const GENRES_URL = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY;
const TRENDING_URL = "https://api.themoviedb.org/3/trending/movie/week?api_key=" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";

Promise.all([getGenres(GENRES_URL), getMovies(TRENDING_URL)])
.then( res => {    
    const genresArray = res[0];
    const resultArray = res[1].data.results.map(el => {
        return {
            "poster": IMG_URL + el.poster_path,
            "title": el.title,
            "genres": el.genre_ids.map(genreId => genresArray
                .find(el => el.id === genreId).name)
                .slice(0,2),
            "date": el.release_date.slice(0, 4), 
            "id": el.id,           
        };
    });    
    return resultArray
})
.then(movies => showMovies(movies))
.catch(err => console.log(err));

function showMovies(resultArray) {
    moviesGallery.insertAdjacentHTML("beforeend", createGallery(resultArray));   
}

async function getMovies(request) {
    try {
        const responce = await axios.get(request);       
        return responce;       
    } catch (err) { 
        throw new Error(err);      
    };
}

async function getGenres(request) {
    try {        
        const responce = await axios.get(request);
        return responce.data.genres;           
    } catch (err) { 
        throw new Error(err);      
    };
}

