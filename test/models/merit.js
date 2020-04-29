import { expect } from 'chai';
import Mention from '../../src/models/mention';
import Merit from '../../src/models/merit';

describe('Merit model', () => {
  let mention = new Mention('Excellent', 0);
  let percent = 67;

  let merit = new Merit(mention, percent);

  it('getMention() return the mention', () => {
    expect(merit.getMention()).to.be.equal(mention);
  });

  it('setMention() should set a new mention', () => {
    let newMention = new Mention('Tres bien', 1);
    merit.setMention(newMention);
    expect(merit.mention).to.be.equal(newMention);
    expect(merit.mention).to.not.be.equal(mention);
  });

  it('getPercent() should return the percentage', () => {
    expect(merit.getPercent()).to.be.equal(percent);
  });

  it('setPercent() should set the new percentage', () => {
    let newPercent = 89;
    merit.setPercent(newPercent);
    expect(merit.percent).to.be.equal(newPercent);
    expect(merit.percent).to.not.be.equal(percent);
  });
});
