import Movie from './Movie'
import '../styles/movies.scss'
import useOnScreen from "../hooks/useOnScreen";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {fetchMovies} from "../data/moviesSlice";
import {ENDPOINT_DISCOVER, ENDPOINT_SEARCH} from "../constants";

const Movies = ({viewTrailer}) => {
    const {measureRef, isIntersecting, observer} = useOnScreen();
    const dispatch = useDispatch()

    const moviesSlice = useSelector((state) => state.movies)

    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search')


    const load = useCallback((page = 1) => {
        dispatch(fetchMovies({
            apiUrl: searchQuery ? ENDPOINT_SEARCH : ENDPOINT_DISCOVER,
            params: {page, query: searchQuery}
        }))
    }, [dispatch, searchQuery]);
    //
    useEffect(() => {
        if (moviesSlice?.page === 0) {
            load()
        }
    }, []);

    useEffect(() => {
        if (isIntersecting && moviesSlice.hasMore) {
            load(moviesSlice.page + 1);
            observer?.disconnect();
        }
    }, [isIntersecting]);
    //
    useEffect(() => {
        load();
        window.scrollTo(0, 0)
    }, [searchQuery])

    console.log('test')

    return (
        <div data-testid="movies" className='movie-grid'>
            {moviesSlice.movies?.map((movie, index) => {
                return (
                    <Movie
                        movie={movie}
                        key={`${movie.id}${movie.id % 2}`}
                        viewTrailer={viewTrailer}
                        ref={moviesSlice.movies.length === (index + 1) ? measureRef : undefined}
                    />
                );
            })}
        </div>
    )
}

export default Movies
