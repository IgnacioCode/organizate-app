PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE [User] ("id_user" integer PRIMARY KEY,"email" text,"password" text,"nickname" text);
INSERT INTO User VALUES(1,'admin','admin','Kirman');
