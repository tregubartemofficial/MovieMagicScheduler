import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatTimeToUTC } from "../App";
import { optionsForMovies } from "../calendarAPI";
import "../styles/MovieCard.css";

const MovieCard = ({ movie }) => {
  const [posterUrl, setPosterUrl] = useState(null);

  const searchMovie = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${movie.title}&language=en`,
        optionsForMovies
      );

      if (response.data.results && response.data.results.length > 0) {
        const movieId = response.data.results[0].id;
        const movieDetailsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=images&language=en`,
          optionsForMovies
        );
        const posterPath =
          movieDetailsResponse.data.images.posters[0].file_path;
        return `https://image.tmdb.org/t/p/original${posterPath}`;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [movie.title]);

  useEffect(() => {
    searchMovie().then((url) => {
      setPosterUrl(url);
    });
  }, [searchMovie]);

  return (
    <Link className="card" to={`/${movie.title}`}>
      <img src={posterUrl} alt={movie.title} className="card-img" />
      <div className="card-content">
        <h2 className="title-movie">{movie.title}</h2>
        <p>
          <b>+{movie.ageLimit}</b> {movie.genre}
        </p>
        <div className="wrapper-time-table">
          {movie.movieStarts.map((movieStart, i) => {
            const startTime = formatTimeToUTC(movieStart);
            return (
              <div className="time-table" key={i}>
                <div className="time">
                  <b>{startTime}</b>
                </div>
                <p className="ticket-price">{movie.ticketPrice} $</p>
              </div>
            );
          })}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
