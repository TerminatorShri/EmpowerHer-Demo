import dbInstance from "../../config/sqlite.config";
import { SecurityScreenData } from "../../types/types";

export const insertSecurityScreenData = async (
  isSOSButtonEnabled: boolean,
  isSafetyTimerEnabled: boolean,
  safetyTimerTimeInterval: number[],
  sosButtonContacts: string[],
  safetyTimerContacts: string[]
) => {
  const result = await (
    await dbInstance
  ).runAsync(
    `
    INSERT INTO security_screen (
      is_sos_button_enabled,
      is_safety_timer_enabled,
      safety_timer_time_interval,
      sos_button_contacts,
      safety_timer_contacts
    ) VALUES (?, ?, ?, ?, ?)`,
    isSOSButtonEnabled ? 1 : 0,
    isSafetyTimerEnabled ? 1 : 0,
    JSON.stringify(safetyTimerTimeInterval),
    JSON.stringify(sosButtonContacts),
    JSON.stringify(safetyTimerContacts)
  );

  console.log(
    `Inserted Row ID: ${result.lastInsertRowId}, Changes: ${result.changes}`
  );
};

// Get Security Screen Data
export const getSecurityScreenData =
  async (): Promise<SecurityScreenData | null> => {
    const firstRow = await (
      await dbInstance
    ).getFirstAsync<SecurityScreenData>("SELECT * FROM security_screen");

    if (firstRow) {
      return {
        isSOSButtonEnabled: Boolean(firstRow.isSOSButtonEnabled) ? 1 : 0,
        isSafetyTimerEnabled: Boolean(firstRow.isSafetyTimerEnabled) ? 1 : 0,
        safetyTimerTimeInterval: JSON.parse(
          firstRow.safetyTimerTimeInterval || ""
        ),
        sosButtonContacts: JSON.parse(firstRow.sosButtonContacts || ""),
        safetyTimerContacts: JSON.parse(firstRow.safetyTimerContacts || ""),
      };
    }
    return null;
  };

// Update Security Screen Data
export const updateSecurityScreenData = async (
  id: number,
  updatedData: Partial<SecurityScreenData>
) => {
  const {
    isSOSButtonEnabled,
    isSafetyTimerEnabled,
    safetyTimerTimeInterval,
    sosButtonContacts,
    safetyTimerContacts,
  } = updatedData;

  const updates: string[] = [];
  const params: any[] = [];

  if (isSOSButtonEnabled !== undefined) {
    updates.push("is_sos_button_enabled = ?");
    params.push(isSOSButtonEnabled ? 1 : 0);
  }

  if (isSafetyTimerEnabled !== undefined) {
    updates.push("is_safety_timer_enabled = ?");
    params.push(isSafetyTimerEnabled ? 1 : 0);
  }

  if (safetyTimerTimeInterval) {
    updates.push("safety_timer_time_interval = ?");
    params.push(JSON.stringify(safetyTimerTimeInterval));
  }

  if (sosButtonContacts) {
    updates.push("sos_button_contacts = ?");
    params.push(JSON.stringify(sosButtonContacts));
  }

  if (safetyTimerContacts) {
    updates.push("safety_timer_contacts = ?");
    params.push(JSON.stringify(safetyTimerContacts));
  }

  if (updates.length > 0) {
    const updateQuery = `UPDATE security_screen SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    await (await dbInstance).runAsync(updateQuery, ...params);
    console.log(`Updated row ID: ${id}`);
  } else {
    console.log("No updates to be made");
  }
};

// Delete Security Screen Data
export const deleteSecurityScreenData = async (id: number) => {
  await (
    await dbInstance
  ).runAsync("DELETE FROM security_screen WHERE id = ?", id);

  console.log(`Deleted row with ID: ${id}`);
};
