import { isNull, isUndefined, isEmpty, sortBy } from 'lodash';
import database from 'db/database';

import Mention from './mention';
import Vote from './vote';
import MeritProfile from './meritProfile';
import Candidate from './candidate';

export default class Ballot {
  name = null;
  url = null;
  id = null;
  uuid = null;
  userUuid = null;
  finished = false;

  mentions = [];
  candidates = [];
  votes = [];
  electionResult = [];

  constructor(name, options = {}) {
    this.name = name;
    this.uuid = options.uuid || '';
    this.id = options.id || null;
    this.url = options.url || '';
    this.userUuid = options.userUuid || null;
    this.candidates = options.candidates || [];
    this.votes = options.votes || [];
    this.finished = options.finished || false;
    this.mentions = [
      new Mention('Excellent', 0),
      new Mention('Good', 1),
      new Mention('Pretty Good', 2),
      new Mention('Fair', 3),
      new Mention('Insufficient', 4),
      new Mention('To Reject', 5)
    ];
    this.electionResult = [];
  }

  getUuid() {
    return this.uuid;
  }

  getUrl() {
    return this.url;
  }

  getUserUuid() {
    return this.userUuid;
  }

  getMentions() {
    return this.mentions;
  }

  getMentionsByRank(rank) {
    return this.mentions.find(item => item.getRank() === rank) || new Mention('To Reject', 5);
  }

  getCandidates() {
    return this.candidates;
  }

  getCandidate(name) {
    let candidateFound = this.candidates.find(value => value.getName() === name);
    return candidateFound;
  }

  isFinished() {
    return this.finished;
  }

  addCandidate(candidate) {
    this.candidates.push(candidate);
    return this;
  }

  setCandidates(candidates) {
    if (candidates.length >= 2) {
      this.candidates = candidates;
    }
    return this;
  }

  getVotes() {
    return this.votes;
  }

  setVotes(votes) {
    this.votes = votes;
    return this;
  }

  getElectionResult() {
    return this.electionResult;
  }

  addElectionResult(elected) {
    this.electionResult = elected;
    return this;
  }

  addVote(vote) {
    let mentionFound = this.mentions.find(mention => mention.getLabel() === vote.mention.getLabel());
    let candidateFound = this.candidates.find(candidate => candidate.getName() === vote.candidate.getName());

    if (isUndefined(mentionFound) || isNull(mentionFound)) {
      throw new Error(`Can't add new vote, vote.mention ${vote.mention.getLabel()} not found in metions poll`);
    }

    if (isUndefined(candidateFound) || isNull(candidateFound)) {
      throw new Error(`Can't add new vote, vote.candidate ${vote.candidate.getName()} not found in candidates poll`);
    }

    this.votes.push(vote);
    return this;
  }

  proceedElection() {
    let sortedCandidates = [];

    let indexedMentions = {};
    let index = 0;

    this.mentions.forEach(mention => {
      indexedMentions[mention.getLabel()] = index;
      index++;
    });

    let votesByCandidates = this.provideVotesByCandidates();
    let sortingKeyByCandidates = this.provideSortingKeyByCandidates();

    this.votes.forEach(vote => {
      votesByCandidates[vote.getCandidate().getName()].push(vote);
    });
    votesByCandidates = this.equalizeVotesByCandidates(votesByCandidates);

    let resultElection = {};

    this.candidates.forEach(candidate => {
      let meritProfile = new MeritProfile();
      let candidateVotes = votesByCandidates[candidate.getName()];
      let candidateName = candidate.getName();
      if (!isEmpty(votesByCandidates[candidateName])) {
        let majorityMentionObject = meritProfile.processMajorityMention(candidate, candidateVotes, this.getMentions());
        resultElection[candidate.getName()] = majorityMentionObject;
      }
    });

    sortedCandidates = this.sortElectionResult(resultElection);

    // sortedCandidates.forEach(candidate => {
    //   console.log(candidate.getName());
    //   console.log(candidate.getMerits());
    //   console.log('------------');
    // });

    return sortedCandidates;

    // WIP - Still need to handle exaequo
    // https://fr.wikipedia.org/wiki/Jugement_majoritaire
  }

  static async findAll({ userUuid }) {
    return new Promise(async (resolve, reject) => {
      try {
        await database.open();
      } catch (error) {
        console.log('Database connection failed');
        reject({ code: 500, message: ' An error occuried' });
        return;
      }

      let capsule;
      let query = `SELECT * FROM ballots WHERE user_uuid="${userUuid}"`;
      try {
        capsule = await database.all(query);
      } catch (error) {
        database.close();
        console.error(error);
        reject({ code: 500, message: 'An error occuried' });
      }
      database.close();

      let ballots = capsule.data.map(item => {
        return new Ballot(item.ballot_name, {
          userUuid,
          url: item.ballot_url,
          id: item.ballot_id,
          finished: item.ballot_finished ? true : false
        });
      });

      resolve(ballots);
    });
  }

  static async findByUrl(url) {
    return new Promise(async (resolve, reject) => {
      try {
        await database.open();
      } catch (error) {
        console.error('Database connection failed');
        reject({ code: 500, message: 'An error occuried' });
        return;
      }

      let capsule = {};
      let query = `SELECT * FROM ballots LEFT JOIN candidates ON candidates.ballot_uuid = ballots.ballot_uuid WHERE ballot_url="${url}"`;
      try {
        capsule = await database.all(query);
      } catch (e) {
        console.error(e);
        await database.close();
        reject({ code: 500, message: 'No Ballot found' });
        return;
      }
      await database.close();

      if (isEmpty(capsule.data)) {
        reject({ code: 404, message: 'No poll found' });
        return;
      }

      let ballotCapsule = capsule.data[0];

      let candidates = capsule.data
        .map(item => {
          return new Candidate(item.candidate_name, { uuid: item.candidate_uuid });
        })
        .filter(item => {
          return item.getName() !== null;
        });

      let ballot = new Ballot(ballotCapsule.ballot_name, {
        uuid: ballotCapsule.ballot_uuid,
        userUuid: ballotCapsule.user_uuid,
        id: ballotCapsule.ballot_id,
        url: ballotCapsule.ballot_url,
        finished: ballotCapsule.ballot_finished ? true : false,
        candidates
      });

      resolve(ballot);
    });
  }

  async setFinished(value = true) {
    return new Promise(async (resolve, reject) => {
      let valueInsert = value ? 1 : 0;
      try {
        await database.open();
      } catch (error) {
        console.error(error);
        reject({ code: 500, message: 'An error occuried' });
        return;
      }

      let query = `UPDATE ballots SET ballot_finished = ${valueInsert} WHERE ballot_uuid="${this.uuid}"`;

      try {
        await database.run(query);
      } catch (error) {
        console.error(error);
        database.close();
        reject({ code: 500, message: 'An error occuried' });
        return;
      }

      database.close();
      this.finished = value;
      resolve(this);
    });
  }

  sortElectionResult(resultElection) {
    let sortedCandidatesByMention = [];
    for (const key in resultElection) {
      if (resultElection.hasOwnProperty(key)) {
        let result = resultElection[key];
        let candidate = this.getCandidate(key);

        if (isUndefined(candidate)) {
          throw new Error('Candidate not found during sorting');
        }

        candidate.setRank(result.mention.rank);
        sortedCandidatesByMention.push(candidate);
      }
    }

    sortedCandidatesByMention = sortBy(sortedCandidatesByMention, candidate => candidate.getRank());

    return sortedCandidatesByMention;
  }

  provideVotesByCandidates() {
    let votesByCandidates = {};
    this.candidates.forEach(candidate => {
      votesByCandidates[candidate.getName()] = [];
    });

    return votesByCandidates;
  }

  provideSortingKeyByCandidates() {
    let sortingKeyByCandidates = {};
    this.candidates.forEach(candidate => {
      sortingKeyByCandidates[candidate.getName()] = '';
    });

    return sortingKeyByCandidates;
  }

  equalizeVotesByCandidates(votesByCandidates) {
    let maxVotes = 0;
    for (const key in votesByCandidates) {
      if (votesByCandidates.hasOwnProperty(key)) {
        let nbOfVotes = votesByCandidates[key].length;
        if (nbOfVotes > maxVotes) {
          maxVotes = nbOfVotes;
        }
      }
    }

    for (const key in votesByCandidates) {
      if (votesByCandidates.hasOwnProperty(key)) {
        let nbVotes = votesByCandidates[key].length;
        if (nbVotes < maxVotes) {
          let diff = maxVotes - nbVotes;
          for (let i = 0; i < diff; i++) {
            let candidate = this.getCandidate(key);
            if (isUndefined(candidate)) {
              break;
            }
            let vote = new Vote(candidate, new Mention('To Reject'));
            votesByCandidates[key].push(vote);
            this.addVote(vote);
          }
        }
      }
    }
    return votesByCandidates;
  }
}
