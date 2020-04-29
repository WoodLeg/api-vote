import { expect } from 'chai';
import Candidate from '../../src/models/candidate';
import Merit from '../../src/models/merit';
import Mention from '../../src/models/mention';

describe('Candidate model', () => {
  let name = 'Jimy Hendrix';
  let uuid = '1111-1111111-1111111-11111';
  let candidate = new Candidate(name, { uuid });

  it('getUuid() should return uuid', () => {
    expect(candidate.getUuid()).to.be.equal(uuid);
  });

  describe('Name:', () => {
    it('getName() should return the name', () => {
      expect(candidate.getName()).to.be.equal(name);
    });

    it('setName() should set new name', () => {
      candidate.setName('Jim Morrison');
      expect(candidate.getName()).to.not.be.equal(name);
    });
  });

  describe('Rank:', () => {
    it('getRank() should return null on instantiation', () => {
      expect(candidate.getRank()).to.be.null;
    });

    it('setRank() should set the rank', () => {
      candidate.setRank(2);
      expect(candidate.rank).to.be.equal(2);
    });

    it('getRank() should return the rank', () => {
      expect(candidate.getRank()).to.be.equal(2);
    });
  });

  describe('Merits:', () => {
    it('addMerits() should add merit', () => {
      expect(candidate.getMerits().length).to.be.equal(0);
      candidate.addMerits([new Merit(new Mention('Excellent'), 89), new Merit(new Mention('Good'), 65)]);
      expect(candidate.merits).to.not.be.undefined;
      expect(candidate.merits.length).to.be.equal(2);
    });

    it('getMerits() should return merits', () => {
      expect(candidate.getMerits().length).to.be.equal(2);
    });
  });

  it('setMedian() should set the median merit', () => {
    let merit = new Merit(new Mention('Excellent', 0), 78);
    candidate.setMedian(merit);
    expect(candidate.median).to.be.not.undefined;
    expect(candidate.median).to.be.deep.equal(merit);
  });
});
