import YoutubePlayer from "./YoutubePlayer";
import React from "react";
import {VIDEO_MODAL_STATUS} from "../App";
import '../styles/video-player.scss';

const ModalYoutubePlayer = ({videoKey, status, onClose}) => {
    if (status === VIDEO_MODAL_STATUS.CLOSED) return null

    return <div className='video-player'>
        <div className="container">
            <span className="close-btn" onClick={onClose}>&times;</span>
            {status === VIDEO_MODAL_STATUS.LOADING ? <h6>Loading...</h6> :
                status === VIDEO_MODAL_STATUS.EMPTY ? <h6>No Trailer Available. Try Another Movie</h6> :
                    <YoutubePlayer videoKey={videoKey}/>}
        </div>
    </div>
}

export default ModalYoutubePlayer;