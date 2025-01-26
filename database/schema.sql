CREATE TABLE user (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    name TEXT,
    email TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX user_username_unique ON user (username);
CREATE UNIQUE INDEX user_email_unique ON user (email);

CREATE TABLE question_group (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE question (
    id TEXT PRIMARY KEY NOT NULL,
    question_text TEXT NOT NULL,
    question_group_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_group_id) REFERENCES question_group(id) ON DELETE CASCADE
);

CREATE TABLE answer (
    id TEXT PRIMARY KEY NOT NULL,
    question_id TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE TABLE session (
    id TEXT PRIMARY KEY NOT NULL,
    leader_id TEXT NOT NULL,
    access_code TEXT NOT NULL UNIQUE, -- Unique 5-character code for accessing the session
    question_group_id INTEGER NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES user(id),
    FOREIGN KEY (question_group_id) REFERENCES question_group(id)
);

CREATE TABLE response (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL, -- The user who responded
    session_id TEXT NOT NULL, -- The session the response belongs to
    question_id TEXT NOT NULL, -- The question being answered
    answer_id TEXT NOT NULL, -- The answer selected by the user
    responded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answer(id) ON DELETE CASCADE
);
