const express = require('express'); // import express
const eventsRouter = require("./EventsRouter"); //import file we are testing
const request = require("supertest"); // supertest is a framework that allows to easily test web apis
const eventsRepo = require('../../database/EventsRepository');
const seedsRepo = require('../../database/SeedsRepository');
const ThreatLevels = require('../../constants/ThreatLevels');

const app = express(); //an instance of an express app, a 'fake' express app
app.use("/api/events", eventsRouter); //routes

describe('EventRouter', () => {
  describe('GET:/events', () => {
    let getAllEventsSpy;
    let getAllSeedsSpy;
    let events;
    let seeds;
    beforeEach(() => {
      getAllEventsSpy = jest.spyOn(eventsRepo, 'getAll');
      getAllSeedsSpy =jest.spyOn(seedsRepo, 'getAll');

      events = events = [
        {
          id: 1,
          seedId: "1",
          type: 'email',
          description: "Email event on seed 1",
          threatLevelCode: 0,
          createdDateTime: "2023-01-01T00:00:00.000Z"
        },
        {
          id: 2,
          seedId: "2",
          type: 'email',
          description: "Email event on seed 2",
          threatLevelCode: 2,
          createdDateTime: "2022-01-01T00:00:00.000Z"
        },
        {
          id: 3,
          seedId: "1",
          type: 'email',
          description: "Email event on seed 1",
          threatLevelCode: 1,
          createdDateTime: "2021-01-01T00:00:00.000Z"
        }
      ];

      seeds = [
        {
          id: "1",
          name: "elyssa-yawning-moccasin",
          domain: "tiwwmaawnc.co.uk"
        },
        {
          id: "2",
          "name": "glenda-rapid-maroon",
          "domain": "iwradttiofdaam.com"
        },
      ];
    });
    afterEach(() => {
      getAllEventsSpy.mockReset();
      getAllSeedsSpy.mockReset();
    }) 
    it('should return array sorted ASCENDING by seedId field from /api/events GET', async () => {
      getAllEventsSpy.mockResolvedValue(events)
      getAllSeedsSpy.mockResolvedValue(seeds);

      const expectedEvents = [
        {
          ...events[0],
          threatLevel: ThreatLevels[events[0].threatLevelCode],
          seed: {
            ...seeds[0]
          }
        },
        {
          ...events[2],
          threatLevel: ThreatLevels[events[2].threatLevelCode],
          seed: {
            ...seeds[0]
          }
        },
        {
          ...events[1],
          threatLevel: ThreatLevels[events[1].threatLevelCode],
          seed: {
            ...seeds[1]
          }
        },
      ];

      const { status, body } = await request(app).get("/api/events");

      expect(status).toEqual(200);
      expect(getAllEventsSpy).toHaveBeenCalledTimes(1);
      expect(body).toEqual({ events: expectedEvents });

      const { events: returnedEvents } = body;
      expect(returnedEvents).toEqual(expectedEvents);

    });

    it('should return array sorted DESCENDING by createdDateTime field from /api/events?sortField=createdDateTime GET', async () => {
      getAllEventsSpy.mockResolvedValue(events)
      getAllSeedsSpy.mockResolvedValue(seeds);

      const expectedEventsOrder = [ events[2].id, events[1].id, events[0].id];

      const { status, body } = await request(app).get("/api/events?sortField=createdDateTime");

      expect(status).toEqual(200);

      const { events: returnedEvents } = body;
      expect(returnedEvents.map(re => re.id)).toEqual(expectedEventsOrder);

    });
  });
})