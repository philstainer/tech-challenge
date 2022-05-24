const ThreatLevels = require('../../constants/ThreatLevels');
const eventsRepo = require('../../database/EventsRepository');
const seedsRepo = require('../../database/SeedsRepository');

const EventsService = () => ({
  async getAll(sortField = 'seedId') {
    const events = await eventsRepo.getAll(sortField)
    
    // Obviously in production you might want to filter rather then get all...
    const seeds = await seedsRepo.getAll()

    return events.map(event => ({
      ...event, 
      threatLevel: event.threatLevelCode ? ThreatLevels[event.threatLevelCode] : ThreatLevels[0],
      seed: seeds.find(seed => seed.id === event.seedId)
    })).sort((a,b) => a[sortField]?.localeCompare(b[sortField]))
  },
});

module.exports = EventsService();
