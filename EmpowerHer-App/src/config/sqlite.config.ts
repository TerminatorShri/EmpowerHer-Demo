import * as SQLite from "expo-sqlite";

const dbInstance = SQLite.openDatabaseAsync("EmpowerHer.db");

const initializeDatabase = async () => {
  await (
    await dbInstance
  ).execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY NOT NULL,
      isLoggedIn INTEGER NOT NULL,
      token TEXT
    );

    CREATE TABLE IF NOT EXISTS security_screen (
      id INTEGER PRIMARY KEY NOT NULL,
      is_sos_button_enabled INTEGER NOT NULL,
      is_safety_timer_enabled INTEGER NOT NULL,
      safety_timer_time_interval TEXT NOT NULL,
      sos_button_contacts TEXT NOT NULL,
      safety_timer_contacts TEXT NOT NULL
    );
  `);
};

initializeDatabase();

export default dbInstance;
