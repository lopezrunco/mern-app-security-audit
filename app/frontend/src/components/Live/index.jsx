import { useEffect, useState } from "react";

import { Renderer } from "./Renderer"

export const Live = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date().toJSON())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toJSON())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const filteredEvents = events.filter(event => {
    let setEventDuration = event.duration ? event.duration : 12;
    let finishDate = new Date(
      new Date(event.startBroadcastTimestamp).setHours(
        new Date(event.startBroadcastTimestamp).getHours() + setEventDuration)
    ).toJSON()

    return event.startBroadcastTimestamp < currentDate && finishDate > currentDate
  })

  return <Renderer events={filteredEvents} />
};
