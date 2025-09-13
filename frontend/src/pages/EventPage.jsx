import React from "react";
import Header from "../components/layout/Header";
import EventCard from "../components/Events/EventCard";
import Footer from "../components/layout/Footer";

const EventPage = () => {
  return (
    <div>
      <Header activeHeading={4} />
      <EventCard active={true} className="mb-0" />
      
       <Footer/>
    </div>
  );
};

export default EventPage;
