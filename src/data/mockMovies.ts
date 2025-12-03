export interface Movie {
  id: string;
  title: string;
  file_link: string;
  external_link: string;
  file_size: string;
  server: string;
}

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "The Journey of Legend 01",
    external_link: "https://websiteA.com/movies/legend-01",
    file_link: "https://isatafilez.my/files/Newthi/Korea/THE_JOURNEY_OF_LEGEND_01.mp4",
    file_size: "1.2 GB",
    server: "Server 1"
  },
  {
    id: "2",
    title: "The Journey of Legend 02",
    external_link: "https://websiteA.com/movies/legend-02",
    file_link: "https://isatafilez.my/files/Newthi/Korea/THE_JOURNEY_OF_LEGEND_02.mp4",
    file_size: "1.4 GB",
    server: "Server 1"
  },
  {
    id: "3",
    title: "Dragon's Path Episode 01",
    external_link: "https://websiteA.com/movies/dragons-path-01",
    file_link: "https://isatafilez.my/files/Newthi/Korea/DRAGONS_PATH_01.mp4",
    file_size: "980 MB",
    server: "Server 2"
  }
];

// Simple in-memory store that can be modified
let movies = [...mockMovies];

export const getMovies = () => movies;

export const getMovieByLink = (externalLink: string) => 
  movies.find(m => m.external_link === externalLink);

export const addMovie = (movie: Omit<Movie, 'id'>) => {
  const newMovie = { ...movie, id: Date.now().toString() };
  movies.push(newMovie);
  return newMovie;
};

export const updateMovie = (id: string, updates: Partial<Movie>) => {
  const index = movies.findIndex(m => m.id === id);
  if (index !== -1) {
    movies[index] = { ...movies[index], ...updates };
    return movies[index];
  }
  return null;
};

export const deleteMovie = (id: string) => {
  movies = movies.filter(m => m.id !== id);
};
