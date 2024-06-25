"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { BsFillMicFill } from "react-icons/bs"; // Import microphone icon
import { useAuth } from "@clerk/nextjs";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
}

interface Genre {
  name: string;
  id: number;
}

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const selectedGenreKey = "selected_genre";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId } = useAuth();
  console.log(userId);

  useEffect(() => {
    const savedPage = parseInt(localStorage.getItem("page") || "1", 10);
    setPage(savedPage);

    const savedGenre = localStorage.getItem(selectedGenreKey) || "";
    setSelectedGenre(savedGenre);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      const api_key = "97c1ec10f492d5880ccb5f65506d37e0";
      let url = "";

      if (searchTerm) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(
          searchTerm
        )}&page=${page}`;
      } else if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${selectedGenre}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data.results);
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm, page, selectedGenre]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    localStorage.setItem("page", newPage.toString());
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
    localStorage.setItem(selectedGenreKey, genre);
  };
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setPage(1);
    };

    recognition.onerror = (event: any) => {
      console.error("Error occurred in recognition: ", event.error);
    };
  };

  const genres: Genre[] = [
    { name: "Action", id: 28 },
    { name: "Adventure", id: 12 },
    { name: "Animation", id: 16 },
    { name: "Comedy", id: 35 },
    { name: "Crime", id: 80 },
    { name: "Documentary", id: 99 },
    { name: "Drama", id: 18 },
    { name: "Family", id: 10751 },
    { name: "Fantasy", id: 14 },
    { name: "History", id: 36 },
    { name: "Horror", id: 27 },
    { name: "Music", id: 10402 },
    { name: "Mystery", id: 9648 },
    { name: "Romance", id: 10749 },
    { name: "Science Fiction", id: 878 },
    { name: "TV Movie", id: 10770 },
    { name: "Thriller", id: 53 },
    { name: "War", id: 10752 },
    { name: "Western", id: 37 },
  ];

  const mov: string[] = ["trending", "trailers"];

  const getBadge = (year: number) => {
    const currentYear = new Date().getFullYear();
    if (year === currentYear) return "NEW";
    if (year === currentYear - 1) return "Presently";
    return "OLD";
  };

  return (
    <div className="min-h-screen text-base-content bg-base-200">
      {isLoading ? (
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col items-center justify-between mb-8 sm:flex-row">
            <h1 className="mb-4 text-3xl font-bold sm:mb-0">Movies</h1>
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <label className="flex items-center gap-2 input input-primary">
                <input
                  className="grow"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <button
                className="px-4 py-2 mt-2 text-white rounded-md bg-primary sm:mt-0"
                onClick={handleVoiceSearch}
              >
                <BsFillMicFill />
              </button>
              <select
                className="w-full max-w-xs select select-primary text-base-content"
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-screen text-white bg-base-200">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        </div>
      ) : (
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col items-center justify-between mb-8 sm:flex-row">
            <h1 className="mb-4 text-3xl font-bold sm:mb-0">Movies</h1>
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <label className="flex items-center gap-2 input input-primary">
                <input
                  className="grow"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <button
                className="px-4 py-2 mt-2 text-white rounded-md bg-primary sm:mt-0"
                onClick={handleVoiceSearch}
              >
                <BsFillMicFill />
              </button>
              <select
                className="w-full max-w-xs select select-primary text-base-content"
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-white rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              <GrFormPrevious className="w-6 h-6" />
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 text-white rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <MdNavigateNext className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {mov.map((category, index) => (
              <Link key={index} href={`/movies/${category}`}>
                <p className="px-4 py-2 text-center text-white rounded-md bg-primary">
                  {category}
                </p>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`}>
                <div className="block h-full overflow-hidden transition-transform duration-200 transform rounded-md shadow-md bg-base-300 hover:scale-105">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg"
                    }
                    alt={movie.title}
                    className="object-cover w-full"
                  />
                  <div className="p-4">
                    <h2 className="mb-2 text-xl font-bold">
                      {movie.title} (
                      {new Date(movie.release_date).getFullYear()})
                      <span
                        className={`ml-2 text-xs px-2 py-1 rounded-full ${
                          getBadge(
                            new Date(movie.release_date).getFullYear()
                          ) === "NEW"
                            ? "bg-green-600"
                            : getBadge(
                                new Date(movie.release_date).getFullYear()
                              ) === "Presently"
                            ? "bg-yellow-600"
                            : "bg-gray-600"
                        }`}
                      >
                        {getBadge(new Date(movie.release_date).getFullYear())}
                      </span>
                    </h2>
                    <p className="text-sm text-base-content line-clamp-3">
                      {movie.overview}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-400">
                        Rating: {movie.vote_average}
                      </span>
                      <span className="text-sm text-gray-400">Movie</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-8 gap-5">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-white rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              Previous Page
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 text-white rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
