import React, { useState } from 'react'
import '../css/App.css';
import '../css/custom.scss';
import '../css/Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment'
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet'
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons/faHeart'

export default function Interactive() {

    const [isLiked, setisLiked] = useState(false);
    const [count, setCount] = useState(0)

    const handleLike = () => {  //for liking and unliking posts
        if (!isLiked) {
            setisLiked(true)
            setCount(count + 1)
        } else {
            setisLiked(false)
            setCount("fuck off ")

        }
    }

    return (
        <div className="interact-row d-flex ">
            <button className="comment col">
                <FontAwesomeIcon icon={faComment} />&nbsp; 121k

            </button>

            <button className="retweet col">
                <FontAwesomeIcon icon={faRetweet} />
                &nbsp; 97k
            </button>

            <button
                className="like col"
                onClick={handleLike}
            >
                {isLiked ? (
                    <FontAwesomeIcon icon={heartSolid} className="text-danger" />
                ) : <FontAwesomeIcon icon={faHeart} />} &nbsp; {count}

            </button>
        </div>
    );
}