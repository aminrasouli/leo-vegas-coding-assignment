import { useEffect, useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import ModalYoutubePlayer from "./components/ModalYoutubePlayer";
import './app.scss'

export const VIDEO_MODAL_STATUS = {
  CLOSED: 'CLOSED',
  LOADING: 'LOADING',
  DONE: 'DONE',
  EMPTY: 'EMPTY',
}

const defaultTrailerState = {
  videoKey: null,
  status: VIDEO_MODAL_STATUS.CLOSED,
};

const App = () => {

  const state = useSelector((state) => state)
  const { movies } = state  
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [trailer, setTrailer] = useState(defaultTrailerState)
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()
  
  const closeModal = () => setOpen(false)
  
  const closeCard = () => {

  }

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+query))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = () => {
    if (searchQuery) {
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+searchQuery))
    } else {
        dispatch(fetchMovies(ENDPOINT_DISCOVER))
    }
  }

  const viewTrailer = (movie) => {
    getMovie(movie.id)
    setOpen(true)
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
    setTrailer({
      ...defaultTrailerState,
      status: VIDEO_MODAL_STATUS.LOADING,
    })
    const videoData = await fetch(URL)
      .then((response) => response.json())

    const trailer = videoData?.videos?.results?.find?.(vid => vid.type === 'Trailer')
    const videoKey = trailer ? trailer?.key : videoData?.videos?.results?.[0]?.key
    setTrailer({
      videoKey: videoKey,
      status: videoKey ? VIDEO_MODAL_STATUS.DONE : VIDEO_MODAL_STATUS.EMPTY,
    })
  }

  const onClose = () => setTrailer(defaultTrailerState);

  useEffect(() => {
    getMovies()
  }, [])

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        <ModalYoutubePlayer videoKey={trailer?.videoKey} status={trailer?.status} onClose={onClose}/>
        <Routes>
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} closeCard={closeCard} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
