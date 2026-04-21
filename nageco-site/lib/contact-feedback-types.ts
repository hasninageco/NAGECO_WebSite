export type ContactFeedbackRecord = {
  id: string;
  submittedAt: string;
  fullName: string;
  email: string;
  company?: string;
  topic?: string;
  message: string;
};

