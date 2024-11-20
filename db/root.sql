-- Deshabilitar temporalmente las restricciones de clave foránea
PRAGMA foreign_keys = OFF;

-- Eliminar tablas existentes si existen
DROP TABLE IF EXISTS Polls;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS GroupUsers;
DROP TABLE IF EXISTS UserPlans;
DROP TABLE IF EXISTS Groups;
DROP TABLE IF EXISTS Plans;
DROP TABLE IF EXISTS Users;

-- Crear tabla Users
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Crear tabla Plans
CREATE TABLE Plans (
    plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    date TEXT,
    location TEXT,
    invite_key TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Crear tabla Groups
CREATE TABLE Groups (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_by_user_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (created_by_user_id) REFERENCES Users(user_id)
);

-- Crear tabla UserPlans
CREATE TABLE PlansJoined (
    join_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    plan_id INTEGER,
    joined_at TEXT DEFAULT (datetime('now')),
    UNIQUE (user_id,plan_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE
);

-- Crear tabla GroupUsers
CREATE TABLE GroupUsers (
    group_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    group_id INTEGER,
    joined_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (group_id) REFERENCES Groups(group_id)
);

-- Crear tabla Comments
CREATE TABLE Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL CHECK(LENGTH(content) <= 128),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Crear tabla Polls
CREATE TABLE Polls (
    poll_id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    options TEXT,
    votes TEXT,
    FOREIGN KEY (plan_id) REFERENCES Plans(plan_id) ON DELETE CASCADE
);


-- Habilitar nuevamente las restricciones de clave foránea
PRAGMA foreign_keys = ON;
