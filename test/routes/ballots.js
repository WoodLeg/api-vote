import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
import app from '../../src/main';
import { expect } from 'chai';
import { ballotPayload, token, createBallotPayload, addVote, electrionResult } from '../fixtures';

var requester = chai.request(app).keepOpen();

describe('Ballots routes:', () => {
  describe('GET /ballots/:url', () => {
    it('should return 404 status code with the ballot', async () => {
      const res = await requester.get('/ballots/jsfjbc');
      expect(res).to.have.status(404);
      expect(res.body).to.be.deep.equal({ errors: [{ status: 404, detail: 'No poll found' }] });
    });

    it('should return 200 status code with ballot payload', async () => {
      const res = await requester.get('/ballots/urlG3n3r8ted');
      expect(res).to.have.status(200);
      expect(res.body).to.be.deep.equal(ballotPayload);
    });
  });

  describe('POST /ballots', () => {
    it('should return a 201 status code with ballot', async () => {
      const res = await requester
        .post('/ballots')
        .set('Authorization', token)
        .send(createBallotPayload);

      expect(res).to.have.status(201);
      let { ballot } = res.body.data;
      expect(ballot).to.haveOwnProperty('name');
      expect(ballot).to.haveOwnProperty('uuid');
      expect(ballot).to.haveOwnProperty('creatorUuid');
      expect(ballot.creatorUuid).to.be.equal('1111-1111111-1111-11111');
      expect(ballot).to.haveOwnProperty('candidates');
      expect(ballot.candidates.length).to.be.equal(5);
      expect(ballot).to.haveOwnProperty('votes');
      expect(ballot).to.haveOwnProperty('finished');
      expect(ballot.finished).to.be.not.ok;
      expect(ballot).to.haveOwnProperty('electionResult');
      expect(ballot.electionResult.length).to.be.equal(0);
    });

    it('should return 401 status code not providing a jwt token', async () => {
      const res = await requester.post('/ballots').send(createBallotPayload);

      expect(res).to.have.status(401);
    });

    it('should return 422 status code if no name provided', async () => {
      let { candidates } = createBallotPayload.payload;
      const res = await requester
        .post('/ballots')
        .set('Authorization', token)
        .send({ payload: { candidates } });

      expect(res).to.have.status(422);
      expect(res.body).to.deep.equal({ errors: [{ status: 422, detail: 'Missing parameters for creating the ballot' }] });
    });

    it('should return 422 status code if no payload provided', async () => {
      let { candidates } = createBallotPayload.payload;
      const res = await requester
        .post('/ballots')
        .set('Authorization', token)
        .send({ candidates });

      expect(res).to.have.status(422);
      expect(res.body).to.deep.equal({ errors: [{ status: 422, detail: 'Missing parameters for creating the ballot' }] });
    });

    it('should return 422 status code if candidateslength < 2', async () => {
      const res = await requester
        .post('/ballots')
        .set('Authorization', token)
        .send({ name: 'Test', candidates: ['Jack'] });

      expect(res).to.have.status(422);
      expect(res.body).to.deep.equal({ errors: [{ status: 422, detail: 'Missing parameters for creating the ballot' }] });
    });
  });

  describe('POST /:uuid/addVote', () => {
    it('should return a 422 if no vote provided', async () => {
      let ballotUuid = '0000-0000000-0000-00000';
      const res = await requester.post(`/ballots/${ballotUuid}/addVote`).send(addVote);
      expect(res).to.have.status(422);
      expect(res.body).to.deep.equal({ errors: [{ status: 422, detail: 'No vote given' }] });
    });

    it('should return a 422 if no candidates provided', async () => {
      let ballotUuid = '0000-0000000-0000-00000';
      const res = await requester.post(`/ballots/${ballotUuid}/addVote`).send({ vote: { candidates: [] } });
      expect(res).to.have.status(422);
      expect(res.body).to.deep.equal({ errors: [{ status: 422, detail: 'No candidates provided for the vote' }] });
    });

    it('should return 201 for adding a vote', async () => {
      let ballotUuid = '0000-0000000-0000-00000';
      const res = await requester.post(`/ballots/${ballotUuid}/addVote`).send({ vote: addVote });

      expect(res).to.have.status(201);
      expect(res.body.data).to.haveOwnProperty('votes');
    });

    it('should return 404 if no ballot found', async () => {
      const res = await requester.post('/ballots/khsfbhslhsfkmsf/addVote').send({ vote: addVote });
      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ errors: [{ status: 404, detail: 'No election found' }] });
    });
  });

  describe('GET /ballots', () => {
    it('should return a 401 status code if no token provided', async () => {
      const res = await requester.get('/ballots');
      expect(res).to.have.status(401);
      expect(res.body).to.deep.equal({ error: 'Missing jwt' });
    });

    it('should return a 200 status code', async () => {
      const res = await requester.get('/ballots').set('Authorization', token);

      expect(res).to.have.status(200);
      expect(res.body.data.ballots.length).to.be.at.least(2);
    });
  });

  describe('GET /:uuid/proceed', () => {
    it('should returns 200 status code and ballot not finished', async () => {
      let ballotUuid = '0000-0000000-0000-00000';
      const res = await requester.get(`/ballots/${ballotUuid}/proceed`);

      expect(res).to.have.status(200);
      let { ballot } = res.body.data;
      expect(ballot.electionResult).to.be.an('array');
      expect(ballot.electionResult.length).to.be.equal(3);
      expect(ballot.finished).to.be.not.ok;
    });

    it('should returns 200 status code and ballot finished', async () => {
      let ballotUuid = '0000-0000000-0000-00000';
      const res = await requester.get(`/ballots/${ballotUuid}/proceed`).set('Authorization', token);

      expect(res).to.have.status(200);

      expect(res.body.data.ballot.finished).to.be.true;
    });

    it('should returns 404 status code', async () => {
      const res = await requester.get('/ballots/khsfkhhkhsf/proceed');

      expect(res).to.have.status(404);
      expect(res.body).to.deep.equal({ errors: [{ status: 404, detail: 'Ballot not found' }] });
    });
  });
});
