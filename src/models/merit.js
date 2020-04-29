export default class Merit {
  mention = null;
  percent = null;

  constructor(mention, percent = 0) {
    this.mention = mention;
    this.percent = percent;
  }

  getMention() {
    return this.mention;
  }

  setMention(mention) {
    this.mention = mention;
    return this;
  }

  getPercent() {
    return this.percent;
  }

  setPercent(percent) {
    this.percent = percent;
    return this;
  }
}
