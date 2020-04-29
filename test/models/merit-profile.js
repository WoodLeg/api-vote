import { expect } from 'chai';
import Candidate from '../../src/models/candidate';
import Vote from '../../src/models/vote';
import Mention from '../../src/models/mention';
import MeritProfile from '../../src/models/meritProfile';

describe('Merit profile model', () => {
  let candidate = new Candidate('Jim Morrison');
  let mentions = [
    new Mention('Excellent', 0),
    new Mention('Good', 1),
    new Mention('Pretty Good', 2),
    new Mention('Fair', 3),
    new Mention('Insufficient', 4),
    new Mention('To Reject', 5)
  ];

  let votes = [
    new Vote(candidate, mentions[0]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[5]),
    new Vote(candidate, mentions[4]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[5]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[0]),
    new Vote(candidate, mentions[0]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[5]),
    new Vote(candidate, mentions[4]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[5]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[0]),
    new Vote(candidate, mentions[0]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[5]),
    new Vote(candidate, mentions[4]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[5]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[0]),
    new Vote(candidate, mentions[0]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[5]),
    new Vote(candidate, mentions[4]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[5]),
    new Vote(candidate, mentions[1]),
    new Vote(candidate, mentions[3]),
    new Vote(candidate, mentions[2]),
    new Vote(candidate, mentions[0])
  ];

  let meritProfile = new MeritProfile();

  it('processMajorityMention() should return the merit of the candidate', () => {
    let expectedResult = { mention: new Mention('Pretty Good', 2), percent: 66.66666666666667 };
    let result = meritProfile.processMajorityMention(candidate, votes, mentions);

    expect(result).to.be.deep.equal(expectedResult);
  });
});
