import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [attendees, setAttendees] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO Server");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO Server");
    });

    socket.on("updateAttendees", ({ eventId, count }) => {
      console.log(`✅ Attendee count updated for event ${eventId}: ${count}`);
      setAttendees((prev) => {
        const newAttendees = { ...prev, [eventId]: count };
        console.log("🔄 Updating state:", newAttendees);
        return newAttendees;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("updateAttendees");
    };
  }, []);

  useEffect(() => {
    fetchEvents();
    socket.on("eventCreated", (newEvent) =>
      setEvents((prev) => [...prev, newEvent])
    );
    socket.on("eventDeleted", (eventId) =>
      setEvents((prev) => prev.filter((event) => event._id !== eventId))
    );

    // Listen for attendee updates
    socket.on("updateAttendees", ({ eventId, count }) => {
      console.log(`✅ Attendee count updated for event ${eventId}: ${count}`);
      setAttendees((prev) => {
        const newAttendees = { ...prev, [eventId]: count };
        console.log("🔄 Updating state:", newAttendees);
        return newAttendees;
      });
    });

    return () => {
      socket.off("updateAttendees");
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(Array.isArray(res.data) ? res.data : []);
      res.data.forEach((event) => fetchAttendeeCount(event._id));
    } catch (err) {
      console.error("Error fetching events", err);
      setEvents([]);
    }
  };

  const fetchAttendeeCount = async (eventId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/event/${eventId}/attendees`
      );
      setAttendees((prev) => ({ ...prev, [eventId]: res.data.count }));
    } catch (err) {
      console.error(`Error fetching attendee count for event ${eventId}`, err);
    }
  };

  const joinEvent = (eventId) => {
    console.log(`🔵 Joining event: ${eventId}`);
    socket.emit("joinEvent", eventId);
    fetchAttendeeCount(eventId);
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="w-screen flex justify-center items-center flex-col">
      <h2 className="absolute top-0 text-xl font-semibold bg-gray-600 p-5 m-2 rounded-full text-white">
        Event Dashboard
      </h2>
      <div className="flex w-full justify-center mb-5">
        <Link to="/create-event">
          <button className="hover:-translate-x-1 transition ease-linear duration-200">
            Create Event
          </button>
        </Link>
        <input
          type="text"
          placeholder="Filter by category or date"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ul className="w-1/4">
        {Array.isArray(events) &&
          events
            .filter(
              (event) =>
                event.name.includes(filter) || event.date.includes(filter)
            )
            .map((event) => (
              <li
                className="flex flex-col gap-2 font-medium text-lg"
                key={event._id}
              >
                {event.name} - {event.date} - Attendees:
                {attendees[event._id] ?? 0}
                <br />
                <div className="flex flex-col gap-2 justify-around">
                  <button
                    className="hover:-translate-y-1 transition duration-200 ease-linear"
                    onClick={() => {
                      joinEvent(event._id);
                      console.log(attendees);
                    }}
                  >
                    Join Event
                  </button>
                  <button
                    className="hover:-translate-y-1 transition duration-200 ease-linear"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/event/${event._id}`
                      )
                    }
                  >
                    Share Event
                  </button>
                </div>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default Dashboard;
