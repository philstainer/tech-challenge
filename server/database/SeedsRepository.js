const seedsData = require('./seeds.json');

const SeedsRepository = () => ({
  async getAll() {
    return new Promise((resolve) => resolve(seedsData));
  },
  async getById(id) {
    return new Promise(resolve => {
      const seed = seedsData.find(seed => seed.id === id)

      resolve(seed)
    })
  }
});

module.exports = SeedsRepository();
