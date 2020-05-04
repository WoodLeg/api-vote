const mentionsFixture = [
  {
    label: 'Excellent',
    rank: 0
  },
  {
    label: 'Good',
    rank: 1
  },
  {
    label: 'Pretty Good',
    rank: 2
  },
  {
    label: 'Fair',
    rank: 3
  },
  {
    label: 'Insufficient',
    rank: 4
  },
  {
    label: 'To Reject',
    rank: 5
  }
];

const ballotSuccessResponse = {
  ballot: {
    name: 'Best artists',
    uuid: '0000-0000000-0000-00000',
    id: 1,
    url: 'urlG3n3r8ted',
    creatorUuid: '1111-1111111-1111-11111',
    votes: [],
    finished: false,
    mentions: mentionsFixture,
    electionResult: [],
    candidates: [
      {
        name: 'Janis Joplin',
        uuid: '9999-9999999-9999-99999',
        rank: null,
        merits: [],
        median: null
      },
      {
        name: 'The Doors',
        uuid: '2323-2323232-2323-23232',
        rank: null,
        merits: [],
        median: null
      },
      {
        name: 'The Who',
        uuid: '8888-8888888-8888-88888',
        rank: null,
        merits: [],
        median: null
      }
    ]
  }
};

const payloadCreateBallot = {
  payload: {
    name: 'Woodstock',
    candidates: ['Joe Cocker', 'The Who', 'Joe Fish', 'Jimmy Hendrix', 'Richie Havens']
  }
};

const createVote = {
  candidates: [
    {
      name: 'The Who',
      uuid: '8888-8888888-8888-88888',
      mention: {
        label: 'Insufficient'
      }
    },
    {
      name: 'Janis Joplin',
      uuid: '9999-9999999-9999-99999',
      mention: {
        label: 'Good'
      }
    },
    {
      name: 'The Doors',
      uuid: '2323-2323232-2323-23232',
      mention: {
        label: 'Excellent'
      }
    }
  ]
};
const userToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBhdWwiLCJ1dWlkIjoiMTExMS0xMTExMTExLTExMTEtMTExMTEiLCJpYXQiOjE1NTg5NDc0MjB9.zrUokYBEvG7ynelsVe5UeO6g0g85hth-3PR-7jZkmrk';

export const electrionResult = [
  {
    name: 'The Doors',
    rank: 0,
    merits: [
      { mention: { label: 'To Reject', rank: 5 }, percent: 6.25 },
      { mention: { label: 'Insufficient', rank: 4 }, percent: 6.25 },
      { mention: { label: 'Fair', rank: 3 }, percent: 12.5 },
      { mention: { label: 'Pretty Good', rank: 2 }, percent: 12.5 },
      { mention: { label: 'Good', rank: 1 }, percent: 12.5 },
      { mention: { label: 'Excellent', rank: 0 }, percent: 50 }
    ],
    median: { mention: { label: 'Excellent', rank: 0 }, percent: 100 },
    uuid: '2323-2323232-2323-23232'
  },
  {
    name: 'The Who',
    rank: 2,
    merits: [
      { mention: { label: 'To Reject', rank: 5 }, percent: 6.25 },
      { mention: { label: 'Insufficient', rank: 4 }, percent: 12.5 },
      { mention: { label: 'Fair', rank: 3 }, percent: 12.5 },
      { mention: { label: 'Pretty Good', rank: 2 }, percent: 43.75 },
      { mention: { label: 'Good', rank: 1 }, percent: 12.5 },
      { mention: { label: 'Excellent', rank: 0 }, percent: 12.5 }
    ],
    median: { mention: { label: 'Pretty Good', rank: 2 }, percent: 75 },
    uuid: '8888-8888888-8888-88888'
  },
  {
    name: 'Janis Joplin',
    rank: 3,
    merits: [
      { mention: { label: 'To Reject', rank: 5 }, percent: 6.25 },
      { mention: { label: 'Insufficient', rank: 4 }, percent: 6.25 },
      { mention: { label: 'Fair', rank: 3 }, percent: 43.75 },
      { mention: { label: 'Pretty Good', rank: 2 }, percent: 12.5 },
      { mention: { label: 'Good', rank: 1 }, percent: 18.75 },
      { mention: { label: 'Excellent', rank: 0 }, percent: 12.5 }
    ],
    median: { mention: { label: 'Fair', rank: 3 }, percent: 56.25 },
    uuid: '9999-9999999-9999-99999'
  }
];
export const ballotPayload = ballotSuccessResponse;
export const mentions = mentionsFixture;
export const token = userToken;
export const createBallotPayload = payloadCreateBallot;
export const addVote = createVote;
