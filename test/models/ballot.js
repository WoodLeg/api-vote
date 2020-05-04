import { expect } from 'chai';
import Ballot from '../../src/models/ballot';
import Candidate from '../../src/models/candidate';
import Vote from '../../src/models/vote';
import Mention from '../../src/models/mention';

describe('Ballot model', () => {
  let uuid = '2222-2222222-2222222-22222';
  let id = 1;
  let url = 'dzfgQNCDa';
  let creatorUuid = '1111-1111111-1111111-11111';
  let candidates = [new Candidate('Matrix'), new Candidate('Interstellar')];
  let votes = [];
  let finished = false;
  let ballot;

  beforeEach(() => {
    ballot = new Ballot('Films', {
      uuid,
      id,
      url,
      creatorUuid,
      candidates,
      votes,
      finished
    });
  });

  it('getMentionsByRank() should return one mention by rank given', () => {
    let mention = ballot.getMentionsByRank(0);
    expect(mention).to.not.be.undefined;

    mention = ballot.getMentionsByRank(100);
    expect(mention).to.not.be.undefined;
  });

  it('isFinished() returns the status', () => {
    expect(ballot.isFinished()).to.not.be.ok;
  });

  it('addCandidate() should add a need candidate', () => {
    expect(ballot.candidates.length).to.be.equal(2);
    ballot.addCandidate(new Candidate('Only lovers left alive'));
    expect(ballot.candidates.length).to.be.equal(3);
  });

  describe('setCandidates():', () => {
    it('should replace the candidates by the ones provided', () => {
      expect(ballot.candidates).to.be.equal(candidates);

      let newCandidates = [new Candidate('Pulp fiction'), new Candidate('Desperado')];
      ballot.setCandidates(newCandidates);

      expect(ballot.candidates).to.be.equal(newCandidates);
    });

    it('should not replace if new array is less than 2 elements', () => {
      expect(ballot.candidates).to.be.equal(candidates);

      let newCandidates = [new Candidate('Pulp fiction')];
      ballot.setCandidates(newCandidates);

      expect(ballot.candidates).to.be.equal(candidates);
    });
  });

  it('setVotes() should set the votes', () => {
    expect(ballot.votes.length).to.be.equal(0);
    let votes = [];
    for (let i = 0; i < 10; i++) {
      votes.push(new Vote(new Candidate('Matrix'), new Mention('Excellent', 0)));
    }
    ballot.setVotes(votes);
    expect(ballot.votes.length).to.be.equal(10);
  });

  describe('addVote(): ', () => {
    it('should add a vote', () => {
      expect(ballot.votes.length).to.be.equal(0);

      ballot.addVote(new Vote(new Candidate('Matrix'), new Mention('Excellent', 0)));

      expect(ballot.votes.length).to.be.equal(1);
    });

    it('should throw an error if candidate does not exist', () => {
      let err = new Error(`Can't add new vote, vote.candidate Test not found in candidates poll`);
      expect(() => ballot.addVote(new Vote(new Candidate('Test'), new Mention('Excellent', 0)))).to.throw('Test');
    });

    it('should throw an error if mention does not exist', () => {
      let err = new Error(`Can't add new vote, vote.mention Pastis not found in candidates poll`);
      expect(() => ballot.addVote(new Vote(new Candidate('Matrix'), new Mention('Pastis', 0)))).to.throw('Pastis');
    });
  });

  describe('Async functions:', () => {
    it('setFinished() should change the status of the ballot', async () => {
      expect(ballot.isFinished()).to.not.be.ok;
      await ballot.setFinished(true);
      expect(ballot.isFinished()).to.be.ok;
    });

    it('findAll() should return all the user ballot', async () => {
      let creatorUuid = '1111-1111111-1111-11111';
      const found = await Ballot.findAll({ creatorUuid });
      expect(found).to.not.be.undefined;
      expect(found).to.be.an('array');
    });

    it('findByUrl() should return the ballot', async () => {
      let queryUrl = 'dzfgQNCDa';
      const found = await Ballot.findByUrl(queryUrl);
      expect(found).to.not.be.undefined;
      expect(found.candidates).to.be.an('array');
      expect(found.candidates).to.not.be.empty;
      expect(found.votes).to.be.an('array');
      expect(found.url).to.be.equal(queryUrl);
    });
  });

  // Still proceedElection related stuff to test
});
