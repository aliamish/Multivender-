import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import EventCard from "../components/Events/EventCard";
import Footer from "../components/layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from  '../redux/actions/event'

const EventPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.event);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allEvents || allEvents.length === 0) {
      dispatch(getAllEvents());
    }
  }, [dispatch, allEvents]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header activeHeading={4} />
      {allEvents && allEvents.length > 0 ? (
        allEvents.map((event, index) => (
          <EventCard key={event._id || index} active={true} data={event} />
        ))
      ) : (
        <div>No events available</div>
      )}
      <Footer />
    </div>
  );
};

export default EventPage;