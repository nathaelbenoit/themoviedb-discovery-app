/** Genre returned by the TMDB movie genres endpoint. */
export type Genre = {
  id: number;
  name: string;
};

/** Raw response returned by the TMDB movie genres endpoint. */
export type TmdbGenresResponse = {
  genres: Genre[];
};
