import type { ChallengePhoto } from "@shared/types";
import type { DocumentData, FirestoreDataConverter } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

function toFirestoreTimestamp(input: any): Timestamp {
  return input instanceof Timestamp
    ? input
    : Timestamp.fromDate(new Date(input));
}

export const challengePhotoConverter: FirestoreDataConverter<ChallengePhoto> = {
  toFirestore(photo: ChallengePhoto): DocumentData {
    return {
      ...photo,
      createdAt: toFirestoreTimestamp(photo.createdAt),
    };
  },
  fromFirestore(snapshot, options): ChallengePhoto {
    const data = snapshot.data(options);
    return {
      id: data.id,
      userId: data.userId,
      eventId: data.eventId,
      challengeId: data.challengeId,
      createdAt: data.createdAt,
      description: data.description,
      storagePath: data.storagePath,
      downloadUrl: data.downloadUrl,
    };
  },
};
