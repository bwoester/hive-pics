export interface ResizedImage {
  boxSize: string;
  width: number;
  height: number;
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
  width: number;
  height: number;
  resized: ResizedImage[];
}
