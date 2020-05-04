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
  username TEXT NOT NULL,
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
  (username, password, uuid)
VALUES
  ('Jim', "$2b$10$t5hdPcGMhgiFs0WBJxU/i.jbtPP9mHiIOUZ4hvK0n44UAwzleVFKu", "1111-1111111-1111-11111");

INSERT INTO ballots
  (ballot_name, ballot_uuid, ballot_url, creator_uuid, ballot_finished)
VALUES
  ('Best artists', "0000-0000000-0000-00000", 'urlG3n3r8ted', '1111-1111111-1111-11111', 0),
  ('Films', "2222-2222222-2222222-22222", 'dzfgQNCDa', '1111-1111111-1111-11111', 0);

INSERT INTO candidates
  (candidate_name, ballot_uuid, candidate_uuid)
VALUES
  ('The Who', '0000-0000000-0000-00000', '8888-8888888-8888-88888'),
  ('Janis Joplin', '0000-0000000-0000-00000', '9999-9999999-9999-99999'),
  ('The Doors', '0000-0000000-0000-00000', '2323-2323232-2323-23232'),
  ('Matrix', '2222-2222222-2222222-22222', '3434-3434343-3434-34343'),
  ('Blade Runner', '2222-2222222-2222222-22222', '5252-5252525-5252-52525');

INSERT INTO votes
  (candidate_uuid, mention_rank, ballot_uuid)
VALUES
  ('8888-8888888-8888-88888', 0, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 1, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 3, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 2, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 2, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 2, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 2, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 2, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 2, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 4, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 5, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 2, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 3, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 1, '0000-0000000-0000-00000'),
  ('8888-8888888-8888-88888', 0, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 0, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 1, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 3, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 2, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 4, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 5, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 2, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 3, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 3, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 3, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 3, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 3, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 3, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 1, '0000-0000000-0000-00000'),
  ('9999-9999999-9999-99999', 0, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 0, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 0, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 0, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 0, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 0, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 0, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 1, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 3, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 2, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 4, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 5, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 2, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 3, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 1, '0000-0000000-0000-00000'),
  ('2323-2323232-2323-23232', 0, '0000-0000000-0000-00000');