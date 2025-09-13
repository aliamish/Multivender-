import React, { useEffect } from "react";
import styles from "../../styles/style";
import EventCard from "./EventCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../redux/actions/event.js";
const Event = () => {
  const dispatch = useDispatch()
  const { allEvents, isLoading } = useSelector((state) => state.events);
  useEffect(() => {
    dispatch(getAllEvents()); // ✅ fetch events when component mounts
  }, [dispatch]);
  console.log(allEvents);
  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full grid">
            {
              allEvents?.length !== 0 && (
               <EventCard data={allEvents && allEvents[0]} />

              )
            }
            <h4>{
                 allEvents?.length === 0 && (
                  'No Events have!'
                 )
              }
              </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
