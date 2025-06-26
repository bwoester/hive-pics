import type { ChallengePhoto } from "@shared/types";
import type { DocumentData, FirestoreDataConverter } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

export const challengePhotoConverter: FirestoreDataConverter<ChallengePhoto> = {
  toFirestore(photo: ChallengePhoto): DocumentData {
    return {
      ...photo,
      createdAt: Timestamp.fromDate(photo.createdAt),
    };
  },
  fromFirestore(snapshot, options): ChallengePhoto {
    const data = snapshot.data(options);
    return {
      id: data.id,
      userId: data.userId,
      eventId: data.eventId,
      challengeId: data.challengeId,
      createdAt: data.createdAt.toDate(),
      description: data.description,
      storagePath: data.storagePath,
      downloadUrl: data.downloadUrl,
    };
  },
};
