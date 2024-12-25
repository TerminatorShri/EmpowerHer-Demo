export type ScreenState =
  | "onboarding"
  | "welcome"
  | "login"
  | "forgotPassword"
  | "register"
  | "info"
  | "chatbot"
  | "security"
  | "home"
  | "community"
  | "settings"
  | "emergency";

export type ForgotPasswordStage = "mail" | "otp" | "changed" | "successful";

export type SecurityScreenType =
  | "features"
  | "sosBtn"
  | "safetyTimer"
  | "incidentReporting";

export interface UserSession {
  isLoggedIn: boolean;
  token: string;
}

export interface CurrentUser {
  uid: string;
  name: string;
  profilePhoto: string;
  email: string;
  contactNumber: string;
}

export interface Comment {
  id: string;
  user: User;
  comment: string;
  createdAt: string;
  postID: string;
}

export interface PostType {
  id: string;
  postedBy: string;
  title: string;
  desc: string;
  category: string;
  photoUrl: string;
}

export interface LikeResponse {
  postId: string;
  userId: string;
}

export interface CommentResponse {
  postId: string;
  comment: Comment;
}

export interface SecurityScreenData {
  safetyTimerTimeInterval: string;
  sosButtonContacts: string;
  safetyTimerContacts: string;
}

export interface SOSButtonInfomation {
  SOSButtonContacts: string[];
}

export interface IncidentReportingFormValues {
  name: string;
  description: string;
  location: string;
  contact: string;
  reportTo: "nirbhaya pathak" | "support groups" | "everyone";
  imageUrl?: string;
  status: "pending";
}

export interface SafetyTimerInformation {
  safetyTimerTimeInterval: number[];
  safetyTimerContacts: string[];
}

export interface SOSButtonReportInfomation {
  reportedBy: string;
  status: "pending";
  reportedAt: Date;
  location: string;
}
