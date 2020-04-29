export default class Vote {
  candidate;
  mention;

  constructor(candidate, mention) {
    this.candidate = candidate;
    this.mention = mention;
  }

  getCandidate() {
    return this.candidate;
  }

  setCandidate(newCandidate) {
    this.candidate = newCandidate;
    return this;
  }

  getMention() {
    return this.mention;
  }

  setMention(newMention) {
    this.mention = newMention;
    return this;
  }
}
