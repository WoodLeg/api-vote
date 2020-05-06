CREATE TABLE ballots
(
  ballot_id INTEGER PRIMARY KEY NOT NULL,
  ballot_name TEXT NOT NULL,
  ballot_uuid TEXT NOT NULL UNIQUE,
  ballot_url TEXT NOT NULL,
  creator_uuid TEXT NOT NULL,
  ballot_finished INTEGER NOT NULL
);

CREATE TABLE users
(
  id INTEGER PRIMARY KEY NOT NULL,
  email TEXT NOT NULL,
  password TEXT,
  uuid TEXT NOT NULL UNIQUE
);

CREATE TABLE candidates
(
  candidate_id INTEGER PRIMARY KEY NOT NULL,
  candidate_name TEXT NOT NULL,
  ballot_uuid INTEGER NOT NULL,
  candidate_uuid TEXT NOT NULL
);

CREATE TABLE votes
(
  vote_id INTEGER PRIMARY KEY NOT NULL,
  candidate_uuid INTEGER NOT NULL,
  mention_rank INTEGER NOT NULL,
  ballot_uuid TEXT NOT NULL
);

INSERT INTO users
  (email, password, uuid)
VALUES
  ('paul@qonto.eu', "$2b$10$t5hdPcGMhgiFs0WBJxU/i.jbtPP9mHiIOUZ4hvK0n44UAwzleVFKu", "1111-1111111-1111-11111");
