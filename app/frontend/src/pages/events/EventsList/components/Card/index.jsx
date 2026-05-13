import { useNavigate } from "react-router-dom";
import React from "react";

import imgUrl from "../../../../../assets/no-media.jpg";

import { getDate } from "../../../../../utils/get-date";

import "./styles.scss";

function Card({ event }) {
    const navigate = useNavigate()
    let showEvent = event.startBroadcastTimestamp > new Date().toISOString();

    return (
        <React.Fragment>
            {showEvent && (
                <div className="col-lg-4">
                    <div className="event-card" onClick={() => navigate(`/remates/${event.id}`)} >
                    {event.eventType && <span className="event-type-tag">{event.eventType}</span>}
                    {event.coverImgName ? (
                        <img src={event.coverImgName} width="100%" />
                    ) : (
                        <img src={imgUrl} width="100%" />
                    )}
                    <div className="content text-center">
                        <h3 >{event.title}</h3>
                        <small>
                            {event.location && <>Lugar: {event.location}</>}
                            <br />
                            {event.organizer && <>Organiza: {event.organizer}<br /></>}
                        </small>
                        <p className="date m-auto mt-3">{getDate(event.startBroadcastTimestamp)}</p>
                        <a className="button button-dark-outline">
                            Ver más <i className="fas fa-chevron-right ms-2"></i>
                        </a>
                    </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default Card;
