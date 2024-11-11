PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE [User] ("id_user" integer PRIMARY KEY,"email" text,"password" text,"nickname" text);
INSERT INTO User VALUES(1,'admin','admin','Kirman');

DROP TABLE IF EXISTS PollVotes;
DROP TABLE IF EXISTS PollOptions;
DROP TABLE IF EXISTS Polls;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS GroupPlans;
DROP TABLE IF EXISTS GroupUsers;
DROP TABLE IF EXISTS UserPlans;
DROP TABLE IF EXISTS Groups;
DROP TABLE IF EXISTS Plans;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Plans (
    plan_id INT PRIMARY KEY AUTO_INCREMENT,
    created_by_user_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES Users(user_id)
);

CREATE TABLE Groups (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES Users(user_id)
);

CREATE TABLE UserPlans (
    user_plan_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plan_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id)
);

CREATE TABLE GroupUsers (
    group_user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    group_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id)
);

CREATE TABLE GroupPlans (
    group_plan_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT,
    plan_id INT,
    FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id)
);

-- Tabla de Comentarios
CREATE TABLE Comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    plan_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Tabla de Encuestas
CREATE TABLE Polls (
    poll_id INT PRIMARY KEY AUTO_INCREMENT,
    plan_id INT NOT NULL,
    question VARCHAR(255) NOT NULL,
    created_by_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES Users(user_id)
);

-- Tabla de Opciones de Encuestas
CREATE TABLE PollOptions (
    option_id INT PRIMARY KEY AUTO_INCREMENT,
    poll_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id) ON DELETE CASCADE
);

-- Tabla de Votos de Encuestas
CREATE TABLE PollVotes (
    vote_id INT PRIMARY KEY AUTO_INCREMENT,
    poll_id INT NOT NULL,
    option_id INT NOT NULL,
    user_id INT NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES PollOptions(option_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (poll_id, user_id)
);
