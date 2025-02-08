// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

const eventAttendees = {}; // Track attendees per event

io.on('connection', (socket) => {
  console.log(`🔗 New client connected: ${socket.id}`);

  socket.on('joinEvent', (eventId) => {
    console.log(`🔵 User ${socket.id} attempting to join event ${eventId}`);

    socket.join(eventId);
    if (!eventAttendees[eventId]) {
      eventAttendees[eventId] = new Set();
    }
    eventAttendees[eventId].add(socket.id);

    const count = eventAttendees[eventId].size;

    console.log(`✅ User ${socket.id} joined event ${eventId}. Total Attendees: ${count}`);
    io.to(eventId).emit('updateAttendees', { eventId, count });
  });

  socket.on('leaveEvent', (eventId) => {
    console.log(`🟠 User ${socket.id} leaving event ${eventId}`);

    socket.leave(eventId);
    if (eventAttendees[eventId]) {
      eventAttendees[eventId].delete(socket.id);
      console.log(`⛔ User ${socket.id} left event ${eventId}. Remaining Attendees: ${eventAttendees[eventId].size}`);
      io.to(eventId).emit('updateAttendees', { eventId, count: eventAttendees[eventId].size });
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ User ${socket.id} disconnected`);
    for (const eventId in eventAttendees) {
      if (eventAttendees[eventId].has(socket.id)) {
        eventAttendees[eventId].delete(socket.id);
        io.to(eventId).emit('updateAttendees', { eventId, count: eventAttendees[eventId].size });
      }
    }
  });
});

// API endpoint to get attendee count for a specific event
app.get('/api/event/:eventId/attendees', (req, res) => {
  const { eventId } = req.params;
  const count = eventAttendees[eventId] ? eventAttendees[eventId].size : 0;
  console.log(`Attendee count for event ${eventId}: ${count}`);
  res.json({ eventId, count });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export { app, io };
