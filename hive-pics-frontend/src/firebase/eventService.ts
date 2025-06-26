import type { ChallengePhoto, Event } from "@shared";
import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Unsubscribe,
} from "firebase/firestore";
import { paths } from "@shared";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { challengePhotoConverter } from "@/firebase/converters.ts";
import { db, storage } from "@/firebase/index";

export const eventService = {
  /**
   * Subscribe to all events for a user
   * @param userId - The ID of the authenticated user
   * @param onEventsUpdate - Callback function that receives the updated events array
   * @returns Unsubscribe function
   */
  subscribeToEvents(
    userId: string,
    onEventsUpdate: (events: Event[]) => void,
  ): Unsubscribe {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const eventsCollection = collection(db, `users/${userId}/events`);
    const q = query(eventsCollection);

    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          date: data.date?.toDate(), // Convert Timestamp to Date
          id: doc.id,
        };
      }) as Event[];
      onEventsUpdate(events);
    });
  },

  createNewEvent(userId: string): Event {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const eventRef = doc(collection(db, `users/${userId}/events`));
    const eventId: string = eventRef.id;

    return {
      id: eventId,
      title: "",
      description: "",
      date: new Date(),
      coverImageUrl: "",
      quota: {
        maxGuests: 5,
        maxUploads: 15,
        retentionDays: 3,
      },
      settings: {
        isDownloadAllowed: false,
      },
    };
  },

  /**
   * Creates or updates an event in Firestore
   * @param userId - The ID of the authenticated user
   * @param event - The event data to save
   * @returns The saved event with its ID
   */
  async saveEvent(userId: string, event: Event): Promise<Event> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const eventsCollection = collection(db, `users/${userId}/events`);

    const eventDoc = event.id
      ? doc(eventsCollection, event.id)
      : doc(eventsCollection);

    const eventToSave: Event = {
      ...event,
      id: eventDoc.id,
    };

    // Remove coverImageUrl if it's undefined
    if (eventToSave.coverImageUrl === undefined) {
      delete eventToSave.coverImageUrl;
    }

    await setDoc(eventDoc, eventToSave);

    return eventToSave;
  },

  /**
   * Deletes an event
   * @param userId - The ID of the authenticated user
   * @param eventId - The ID of the event to delete
   */
  async deleteEvent(userId: string, eventId: string): Promise<void> {
    if (!userId || !eventId) {
      throw new Error("User ID and Event ID are required");
    }

    const eventDoc = doc(db, `users/${userId}/events/${eventId}`);
    await deleteDoc(eventDoc);
  },

  challengePhotosCollection(
    userId: string,
    eventId: string,
  ): CollectionReference<ChallengePhoto, DocumentData> {
    return collection(db, paths.challengePhotos(userId, eventId)).withConverter(
      challengePhotoConverter,
    );
  },

  async addChallengePhoto(
    userId: string,
    eventId: string,
    challengeId: string,
    challengePhoto: File,
    description?: string,
  ): Promise<ChallengePhoto> {
    if (!challengePhoto) {
      throw new Error("Challenge photo is required");
    }
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    // Add a new document with a generated id
    const challengePhotoDocRef: DocumentReference<
      ChallengePhoto,
      DocumentData
    > = doc(this.challengePhotosCollection(userId, eventId));
    const challengePhotoId = challengePhotoDocRef.id;

    // upload image to storage
    const challengePhotoFilePath = paths.newChallengePhoto(
      userId,
      eventId,
      challengePhotoId,
      challengePhoto,
    );
    const challengePhotoStorageRef = storageRef(
      storage,
      challengePhotoFilePath,
    );
    let challengePhotoDownloadURL: string;
    try {
      const snapshot = await uploadBytes(
        challengePhotoStorageRef,
        challengePhoto,
      );
      challengePhotoDownloadURL = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }

    // write document
    const challengePhotoDoc: ChallengePhoto = {
      id: challengePhotoId,
      userId,
      eventId,
      challengeId,
      createdAt: new Date(),
      description,
      storagePath: challengePhotoFilePath,
      downloadUrl: challengePhotoDownloadURL,
    };

    try {
      await setDoc(challengePhotoDocRef, challengePhotoDoc);
    } catch (error) {
      console.error("Error storing challengePhotoDoc:", error);
      throw new Error("Failed to store challengePhotoDoc");
    }

    return challengePhotoDoc;
  },
};
