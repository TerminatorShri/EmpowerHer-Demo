import dbInstance from "../../config/sqlite.config";
import { UserSession } from "../../types/types";

const insertUser = async (isLoggedIn: boolean, token: string) => {
  const result = await (
    await dbInstance
  ).runAsync(
    "INSERT INTO users (isLoggedIn, token) VALUES (?, ?)",
    isLoggedIn ? 1 : 0,
    token
  );
  console.log(result.lastInsertRowId, result.changes);
};

const updateUserSession = async (token: string) => {
  await (
    await dbInstance
  ).runAsync("UPDATE users SET token = ? WHERE isLoggedIn = ?", token, 1);
};

const deleteUserSession = async () => {
  await (
    await dbInstance
  ).runAsync(
    "UPDATE users SET isLoggedIn = ?, token = ? WHERE isLoggedIn = ?",
    0,
    "",
    1
  );
};

const checkUserSession = async (): Promise<boolean> => {
  const firstRow = await (
    await dbInstance
  ).getFirstAsync("SELECT * FROM users WHERE isLoggedIn = 1");

  return firstRow ? true : false;
};

const retrieveToken = async (): Promise<string | null> => {
  const firstRow = await (
    await dbInstance
  ).getFirstAsync("SELECT token FROM users WHERE isLoggedIn = 1");

  if (firstRow && (firstRow as UserSession).token) {
    return (firstRow as UserSession).token;
  }

  return null;
};

export {
  insertUser,
  updateUserSession,
  deleteUserSession,
  checkUserSession,
  retrieveToken,
};
