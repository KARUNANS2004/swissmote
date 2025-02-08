import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Event from '../models/Event.js';
import { io } from '../app.js';

const router = express.Router();

// Create an Event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, date, time } = req.body;
    const newEvent = new Event({ name, description, date, time, owner: req.user.id });
    await newEvent.save();

    io.emit('eventCreated', newEvent); // Real-time update

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Could not create event' });
  }
});

// Get All Events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('owner', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch events' });
  }
});

// Delete an Event (only owner can delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await event.remove();
    io.emit('eventDeleted', req.params.id); // Real-time update

    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete event' });
  }
});

export default router;
