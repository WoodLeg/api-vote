export default class Mention {
  label = null;
  rank = null;

  constructor(label, rank) {
    this.label = label || '';
    if (rank === 0) {
      this.rank = 0;
    } else {
      this.rank = rank || 99;
    }
  }

  getLabel() {
    return this.label;
  }

  getRank() {
    return this.rank;
  }

  setLabel(newLabel) {
    this.label = newLabel;
    return this;
  }
}
