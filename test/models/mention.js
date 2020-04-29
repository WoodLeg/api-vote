import { expect } from 'chai';
import Mention from '../../src/models/mention';

describe('Mention model', () => {
  let label = 'Bien';
  let rank = 1;

  let mention = new Mention(label, rank);

  it('getLabel() should return the label', () => {
    expect(mention.getLabel()).to.be.equal(label);
  });

  it('getRank() should return the rank', () => {
    expect(mention.getRank()).to.be.equal(rank);
  });

  it('setLabel() should set a new label', () => {
    let newLabel = 'Passable';
    mention.setLabel(newLabel);
    expect(mention.label).to.be.equal(newLabel);
    expect(mention.label).to.not.be.equal(label);
  });
});
