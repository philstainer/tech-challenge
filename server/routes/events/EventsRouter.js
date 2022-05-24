const { Router } = require('express');
const eventsServive = require('../../services/events/EventsService');

const router = new Router();

router.get("/", async (_req, res) => {
  const sortField = _req.query?.sortField

  const events = await eventsServive.getAll(sortField);

  res.json({ events });
});

module.exports = router;
