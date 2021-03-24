import React, { useState } from 'react'
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'

export default function Interactive() {

    const [isLiked, setisLiked] = useState(false);

    const handleLike = () => {  //for liking and unliking posts
        if (!isLiked) {
            setisLiked(true)
        } else {
            setisLiked(false)
        }
    }

    return (
        <div className="interact-row d-flex ">
            <button className="comment col">
                <FontAwesomeIcon icon={faComment} />
                 &nbsp; 121k
            </button>

            <button
                className="like col"
                onClick={handleLike}
            >
                {isLiked ? (
                    <FontAwesomeIcon icon={heartSolid} className="text-danger" />
                ) : <FontAwesomeIcon icon={faHeart} />}
                    &nbsp; 302k
            </button>
        </div>
    );
}