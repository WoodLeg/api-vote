export default class Candidate {
  name = null;
  rank = null;
  merits = null;
  median = null;
  uuid = null;

  constructor(name, options = {}) {
    this.name = name;
    this.rank = null;
    this.merits = [];
    this.median = null;
    this.uuid = options.uuid || '';
  }

  getUuid() {
    return this.uuid;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  getRank() {
    return this.rank;
  }

  setRank(rank) {
    this.rank = rank;
    return this;
  }

  getMerits() {
    return this.merits;
  }

  addMerits(merits) {
    this.merits = merits;
    return this;
  }

  setMedian(merit) {
    this.median = merit;
    return this;
  }
}
