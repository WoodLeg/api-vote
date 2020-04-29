import { expect } from 'chai';
import Candidate from '../../src/models/candidate';
import Vote from '../../src/models/vote';
import Mention from '../../src/models/mention';

describe('Vote model', () => {
  let candidate = new Candidate('Joe Cocker');
  let mention = new Mention('Excellent', 0);

  let vote = new Vote(candidate, mention);

  describe('Candidate:', () => {
    it('getCandidate() should return the candidate', () => {
      expect(vote.getCandidate()).to.be.equal(candidate);
    });

    it('setCandidate() should set a new candidate', () => {
      let newCandidate = new Candidate('Country Joe');
      vote.setCandidate(newCandidate);
      expect(vote.candidate).to.be.equal(newCandidate);
    });
  });

  describe('Mention:', () => {
    it('getMention() should return the mention', () => {
      expect(vote.getMention()).to.be.equal(mention);
    });

    it('setMention() should set a new mention', () => {
      let newMention = new Mention('Tres bien', 1);
      vote.setMention(newMention);
      expect(vote.mention).to.be.equal(newMention);
    });
  });
});
