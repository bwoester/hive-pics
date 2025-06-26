export const paths = {
  // users
  users: () => "users",

  // users/${userId}
  user: (userId: string): string => `${paths.users()}/${userId}`,

  // users/${userId}/events
  events: (userId: string): string => `${paths.user(userId)}/events`,

  // users/${userId}/events/${eventId}
  event: (userId: string, eventId: string): string =>
    `${paths.events(userId)}/${eventId}`,

  // users/${userId}/events/${eventId}/challenge-photos
  challengePhotos: (userId: string, eventId: string): string =>
    `${paths.event(userId, eventId)}/challenge-photos`,

  // users/${userId}/events/${eventId}/challenge-photos/${challengePhotoId}
  challengePhoto: (
    userId: string,
    eventId: string,
    challengePhotoId: string,
  ): string => `${paths.challengePhotos(userId, eventId)}/${challengePhotoId}`,

  // users/${userId}/events/${eventId}/challenge-photos/${challengePhotoId}
  newChallengePhoto: (
    userId: string,
    eventId: string,
    challengePhotoDocId: string,
    challengePhoto: File,
  ): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension =
      challengePhoto.name.split(".").pop()?.toLowerCase() ?? "unknown";
    const challengePhotoFileName = `${timestamp}-${challengePhotoDocId}.${extension}`;
    return paths.challengePhoto(userId, eventId, challengePhotoFileName);
  },
};
