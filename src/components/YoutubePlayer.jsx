import ReactPlayer from 'react-player'

const YoutubePlayer = ({ videoKey }) => (<ReactPlayer
  className="react-player"
  url={`https://www.youtube.com/watch?v=${videoKey}`}
  controls={true}
  playing={true}
  data-testid="youtube-player"
  width="100%"
  height="85%"
/>);

export default YoutubePlayer;