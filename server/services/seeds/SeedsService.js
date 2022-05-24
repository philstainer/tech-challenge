const seedsData = require('../../database/SeedsRepository');

const SeedsService = () => ({
  getAll() {
    return seedsData.getAll();
  },
  getById(id) {
    return seedsData.getById(id)
  }
});

module.exports = SeedsService();
