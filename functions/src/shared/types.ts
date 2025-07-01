export interface ResizedImage {
  size: string;
  storagePath: string;
}

export interface ChallengePhoto {
  id: string;
  userId: string;
  eventId: string;
  challengeId: string;
  createdAt: Date;
  description?: string;
  storagePath: string;
  resized: ResizedImage[]
}
