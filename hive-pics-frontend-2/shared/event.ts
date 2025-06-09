export interface Event {
  id: string;
  title: string;
  coverImageUrl?: string;
  description: string;
  date: Date;
  challengeSetId?: string;
  quota: {
    maxGuests: number;
    maxUploads: number;
    retentionDays: number;
  };
  settings: {
    isDownloadAllowed: boolean;
  };
}
