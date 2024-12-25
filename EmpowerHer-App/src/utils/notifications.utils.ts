import { BACKEND_URL } from "@env";

const sendSmsWithLocation = async (
  phoneNumber: string,
  username: string,
  location: string,
  type: string
) => {
  try {
    const SOSMessage = `Urgent: An SOS alert has been triggered by ${username}. Please find the emergency location here: ${location}. Kindly reach out immediately to assist.`;
    const SafetyTimerMessage = `Safety was not confirmed within the set timer by ${username}. The current location is: ${location}. Please take appropriate action to ensure their safety.`;
    1;
    const EmergencyMessage = `Urgent: Regarding SOS alert has been triggered by ${username}. Current location is: ${location}`;

    console.log(
      "Sending SMS:",
      type === "sos" ? SOSMessage : SafetyTimerMessage
    );
    const msg = "Safety Timer Working";

    const response = await fetch(`${BACKEND_URL}/send-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: type === "sos" ? SOSMessage : SafetyTimerMessage,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.result;
    } else {
      throw new Error("Failed to send SMS");
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};

export { sendSmsWithLocation };
