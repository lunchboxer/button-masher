-- name: getAllUsers
SELECT id, username, name, email, role FROM user;

-- name: getAllUsersByRole
SELECT id, username, name, email, role FROM user WHERE role IN (/* roles */);

-- name: countUsers
SELECT COUNT(1) as count FROM user;

-- name: createUser
INSERT INTO user (id, username, name, email, password, role)
VALUES ($id, $username, $name, $email, $password, $role);

-- name: getUserByUsername
SELECT id, username, name, email, role FROM user WHERE username = ?;

-- name: getUserByUsernameWithPassword
SELECT id, username, name, email, role, password FROM user WHERE username = ?;

-- name: getUserById
SELECT id, username, name, email, role FROM user WHERE id = ?;

-- name: getUserByIdWithPassword
SELECT id, username, name, email, role, password FROM user WHERE id = ?;

-- name: updateUserById
UPDATE user SET username = $username, name = $name, email = $email, role = $role WHERE id = $id;

-- name: updateUserByIdWithPassword
UPDATE user SET username = $username, name = $name, email = $email, role = $role, password = $password WHERE id = $id;

-- name: removeUserById
DELETE FROM user WHERE id = ?;

-- name: usernameTaken
SELECT 1 FROM user WHERE username = ?;

-- name: usernameTakenExcludingId
SELECT 1 FROM user WHERE username = ? AND id != ?;

-- name: emailTaken
SELECT 1 FROM user WHERE email = ?;

-- name: emailTakenExcludingId
SELECT 1 FROM user WHERE email = ? AND id != ?;

-- name: updateUserPassword
UPDATE user SET password = ? WHERE id = ?;

-- name: questionGroupExists
SELECT 1 FROM question_group WHERE id = ?;

-- name: questionGroupExistsByName
SELECT 1 FROM question_group WHERE name = ?;

-- name: questionGroupExistsByNameExcludingId
SELECT 1 FROM question_group WHERE name = ? AND id != ?;

-- name: getAllQuestionGroups
SELECT id, name, description FROM question_group ORDER BY created_at DESC;

-- name: getQuestionGroupById
SELECT id, name, description FROM question_group WHERE id = ?;

-- name: createQuestionGroup
INSERT INTO question_group (id, name, description)
VALUES ($id, $name, $description);

-- name: updateQuestionGroupById
UPDATE question_group SET name = $name, description = $description WHERE id = $id;

-- name: updateQuestionGroupById
UPDATE question_group SET name = $name, description = $description WHERE id = $id;

-- name: removeQuestionGroupById
DELETE FROM question_group WHERE id = ?;

-- name: getAllQuestions
SELECT id, question_text, question_group_id FROM question;

-- name: getQuestionById
SELECT id, question_text, question_group_id FROM question WHERE id = ?;

-- name: getQuestionAndAnswersById
SELECT
    q.id AS id,
    q.question_text,
    q.question_group_id,
    q.created_at AS created_at,
    CASE
        WHEN COUNT(a.id) = 0 THEN JSON_ARRAY()
        ELSE JSON_GROUP_ARRAY(
            JSON_OBJECT(
                'id', a.id,
                'answer_text', a.answer_text,
                'is_correct', a.is_correct,
                'created_at', a.created_at
            )
        )
    END AS answers
FROM
    question q
LEFT JOIN
    answer a ON q.id = a.question_id
WHERE
    q.id = ?
GROUP BY
    q.id;

-- name: getQuestionsByQuestionGroupId
SELECT id, question_text, question_group_id FROM question WHERE question_group_id = ?;

-- name: removeQuestionById
DELETE FROM question WHERE id = ?;

-- name: getQuestionsByQuestionGroupId
SELECT id, question_text, question_group_id FROM question WHERE question_group_id = ?;

-- name: createQuestion
INSERT INTO question (id, question_text, question_group_id)
VALUES ($id, $question_text, $question_group_id);

-- name: updateQuestionById
UPDATE question SET question_text = $question_text, question_group_id = $question_group_id WHERE id = $id;

-- name: getAllAnswers
SELECT id, question_id, answer_text, is_correct FROM answer;

-- name: getAnswerById
SELECT id, question_id, answer_text, is_correct FROM answer WHERE id = ?;

-- name: getAnswerByQuestionIdAndText
SELECT id FROM answer WHERE question_id = ? AND answer_text = ?;

-- name: createAnswer
INSERT INTO answer (id, question_id, answer_text, is_correct)
VALUES ($id, $question_id, $answer_text, $is_correct);

-- name: updateAnswerById
UPDATE answer SET question_id = $question_id, answer_text = $answer_text, is_correct = $is_correct WHERE id = $id;

-- name: removeAnswerById
DELETE FROM answer WHERE id = ?;

-- name: getAllQuestionsByQuestionGroupId
SELECT id, question_text, question_group_id FROM question WHERE question_group_id = ?;

-- name: getAllQuestionsAndAnswers
SELECT
    q.id AS id,
    q.question_text,
    q.created_at AS created_at,
    CASE
        WHEN COUNT(a.id) = 0 THEN '[]'
        ELSE JSON_GROUP_ARRAY(
            JSON_OBJECT(
                'id', a.id,
                'answer_text', a.answer_text,
                'is_correct', a.is_correct,
                'created_at', a.created_at
            )
        )
    END AS answers
FROM
    question q
LEFT JOIN
    answer a ON q.id = a.question_id
GROUP BY
    q.id
ORDER BY
    q.created_at;

-- name: getAllQuestionsAndAnswersByQuestionGroupId
SELECT
    q.id AS id,
    q.question_text,
    q.created_at AS created_at,
    CASE
        WHEN COUNT(a.id) = 0 THEN '[]'
        ELSE JSON_GROUP_ARRAY(
            JSON_OBJECT(
                'id', a.id,
                'answer_text', a.answer_text,
                'is_correct', a.is_correct,
                'created_at', a.created_at
            )
        )
    END AS answers
FROM
    question q
LEFT JOIN
    answer a ON q.id = a.question_id
WHERE
    q.question_group_id = ?
GROUP BY
    q.id
ORDER BY
    q.created_at;

-- name: getAllAnswersByQuestionId
SELECT id, question_id, answer_text, is_correct FROM answer WHERE question_id = ?;
