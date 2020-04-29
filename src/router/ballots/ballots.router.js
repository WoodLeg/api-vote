import { Router } from 'express';
import BallotController from './ballots.controller';
import { isAuthenticated, identifyUser } from '../../middlewares';

const router = Router();

router.get('/', isAuthenticated, BallotController.getAll);
router.get('/:ballotUrl', BallotController.getBallot);
router.get('/:uuid/proceed', identifyUser, BallotController.proceedElection);

router.post('/', isAuthenticated, BallotController.createBallot);
router.post('/:uuid/addVote', BallotController.addVote);

export const BallotRouter = router;
