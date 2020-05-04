import Ballot from 'models/ballot';
import shortId from 'shortid';
import { isUndefined, isEmpty, uniqBy } from 'lodash';
import Candidate from 'models/candidate';
import Vote from 'models/vote';
import Mention from 'models/mention';
import database from 'db/database';
import uuid from 'uuid';
import User from 'models/user';

export default class BallotController {
  // Returns all created ballots from user
  static async getAll(request, response) {
    let creatorUuid = request.body.user.uuid;

    if (isUndefined(creatorUuid)) {
      response.status(401).json({ ok: false, error: { message: 'Requête refusée pour cette ressource.' } });
    }

    let ballots = [];

    try {
      ballots = await Ballot.findAll({ creatorUuid });
    } catch ({ code, message }) {
      response.status(code).json({ ok: false, error: { message } });
      return;
    }

    response.json({ ok: true, data: { ballots } });
  }

  static async createBallot(request, response) {
    let { payload } = request.body;
    let creatorUuid = request.body.user.uuid;

    if (isUndefined(payload) || isUndefined(payload.name) || payload.candidates.length < 2) {
      response.status(422).json({ ok: false, error: { message: 'Il manque des informations pour la création de votre vote.' } });
      return;
    }

    try {
      await database.open();
    } catch (error) {
      response.status(500).json({ error: { message: 'An error occuried, please retry later' } });
      return;
    }

    let candidates = payload.candidates.map(item => {
      return new Candidate(item);
    });
    let ballot = new Ballot(payload.name, { uuid: uuid.v4(), url: shortId.generate(), creatorUuid, candidates });
    let query = `INSERT INTO ballots (ballot_name, ballot_uuid, ballot_url, creator_uuid, ballot_finished) VALUES ("${
      ballot.name
    }", "${ballot.getUuid()}", "${ballot.getUrl()}", "${ballot.getCreatorUuid()}", 0)`;
    try {
      await database.run(query);
    } catch (e) {
      console.error('Ballot error insertion: ', e);
      await database.close();
      response.status(500).json({ error: { message: 'An error occuried' } });
      return;
    }

    let candidatesValues = '';
    candidates.forEach(candidate => {
      candidatesValues += `("${candidate.getName()}", "${ballot.getUuid()}", "${uuid.v4()}"),`;
    });
    candidatesValues = candidatesValues.replace(/.$/, ';');

    query = `INSERT INTO candidates (candidate_name, ballot_uuid, candidate_uuid) VALUES ${candidatesValues}`;
    try {
      await database.run(query);
    } catch (e) {
      await database.close();
      response.status(500).json(e);
      return;
    }

    await database.close();

    response.status(201).json({ ok: true, data: { ballot } });
  }

  static async getBallot(request, response) {
    let { ballotUrl } = request.params;
    if (isUndefined(ballotUrl)) {
      response.status(422).json({ ok: false, error: { message: 'No Ballot url provided' } });
      return;
    }

    let ballot;
    try {
      ballot = await Ballot.findByUrl(ballotUrl);
    } catch ({ code, message }) {
      response.status(code).json({ ok: false, error: { message } });
      return;
    }

    response.json({ ok: true, data: { ballot } }).status(200);
  }

  static async addVote(request, response) {
    let { uuid } = request.params;
    let { vote } = request.body;
    let votesToAdd = [];

    if (isUndefined(vote)) {
      response.status(422).json({ ok: false, error: { message: 'Aucun vote fourni.' } });
      return;
    }

    if (isEmpty(vote.candidates)) {
      response.status(422).json({ ok: false, error: { message: 'Auncun candidates fourni pour le vote' } });
      return;
    }

    let candidatesToProcess = vote.candidates;
    let ballotMentions = [];

    try {
      await database.open();
    } catch (error) {
      console.error(error);
      response.status(500).json({ ok: false, error: { message: 'An error occuried' } });
      return;
    }

    let query = `SELECT * FROM ballots WHERE ballot_uuid="${uuid}"`;
    let capsule = {};
    try {
      capsule = await database.get(query);
    } catch (error) {
      await database.close();
      response.status(500).json(error);
      return;
    }

    let ballotCapsule = capsule.data;

    if (isUndefined(ballotCapsule)) {
      response.status(404).json({ ok: false, error: { message: 'Aucune élection trouvée.' } });
      return;
    }

    let ballot = new Ballot(ballotCapsule.ballot_name, {
      uuid: ballotCapsule.ballot_uuid,
      id: ballotCapsule.ballot_id,
      creatorUuid: ballotCapsule.creator_uuid,
      url: ballotCapsule.ballot_url
    });

    ballotMentions = ballot.getMentions();

    let items = candidatesToProcess.map(item => {
      return {
        candidate: { name: item.name, uuid: item.uuid },
        mention: item.mention
      };
    });

    try {
      votesToAdd = items.map(item => {
        let candidate = new Candidate(item.candidate.name, { uuid: item.candidate.uuid });
        let mentionToAdd = ballotMentions.find(m => m.label === item.mention.label);
        if (isUndefined(mentionToAdd)) {
          mentionToAdd = new Mention('To Reject', 5);
        }
        return new Vote(candidate, mentionToAdd);
      });
    } catch (error) {
      response.status(422).json({ ok: false, error: { message: 'Parametres manquants pour voter', body: error } });
      return;
    }

    let voteQueryInsert = ``;

    votesToAdd.forEach(vote => {
      voteQueryInsert += `("${vote.getCandidate().getUuid()}", "${vote.getMention().getRank()}", "${ballot.getUuid()}"),`;
    });
    voteQueryInsert = voteQueryInsert.replace(/.$/, ';');

    let finalInsertQuery = `INSERT INTO votes (candidate_uuid, mention_rank, ballot_uuid) VALUES ${voteQueryInsert}`;

    try {
      await database.run(finalInsertQuery);
    } catch (error) {
      await database.close();
      response.status(500).json({ ok: false, error: { message: 'Insert votes in database failed', body: error } });
      return;
    }

    await database.close();
    response.status(201).json({ ok: true, data: { votes: votesToAdd }, message: 'Vote ajouté' });
    return;
  }

  static async proceedElection(request, response) {
    let { uuid } = request.params;
    let creatorUuid = undefined;

    if (request.body.user) {
      creatorUuid = request.body.user.uuid;
    }

    try {
      await database.open();
    } catch (e) {
      console.error('Database connection failed');
      response.status(500).json({ error: { message: 'An error has occuried' } });
    }

    let query = `SELECT * FROM ballots INNER JOIN votes ON votes.ballot_uuid = ballots.ballot_uuid INNER JOIN candidates ON candidates.candidate_uuid = votes.candidate_uuid WHERE votes.ballot_uuid="${uuid}"`;

    let capsule = {};
    try {
      capsule = await database.all(query);
    } catch (error) {
      console.log(error);
      await database.close();
      response.status(500).json(error);
      return;
    }

    let tmp = capsule.data[0];

    if (isUndefined(tmp)) {
      response.status(404).json({ error: { message: 'Ballot not found' } });
      return;
    }

    // TO BE REFACT in ballot instantiation
    let candidates = capsule.data.map(item => {
      return new Candidate(item.candidate_name, {
        uuid: item.candidate_uuid
      });
    });

    let candidatesUnified = uniqBy(candidates, 'uuid');

    let ballot = new Ballot(tmp.ballot_name, {
      id: tmp.ballot_id,
      uuid: tmp.ballot_uuid,
      url: tmp.ballot_url,
      creatorUuid: tmp.creator_uuid,
      finished: tmp.ballot_finished ? true : false,
      candidates: candidatesUnified
    });

    // TO BE REFACT in ballot instantiation
    let votes = capsule.data.map(item => {
      return new Vote(new Candidate(item.candidate_name, { uuid: item.candidate_uuid }), ballot.getMentionsByRank(item.mention_rank));
    });

    ballot.setVotes(votes);

    if (!isUndefined(creatorUuid)) {
      let userCapsule = {};
      try {
        userCapsule = await database.get(`SELECT * FROM users where users.uuid ="${creatorUuid}"`);
      } catch (error) {
        response.status(500).json({ error: { message: 'Error user GET database', body: error } });
        return;
      }

      let user = new User(userCapsule.data.username, userCapsule.data.password, { uuid: userCapsule.data.uuid });
      let isOwner = ballot.getCreatorUuid() === user.uuid;

      if (isOwner) {
        try {
          await ballot.setFinished(true);
        } catch ({ code, message }) {
          response.status(code).json({ ok: false, error: { message } });
        }
      }
    }

    let electionResult = ballot.proceedElection();

    ballot.addElectionResult(electionResult);

    response.status(200).json({ ok: true, data: { ballot } });
  }
}
