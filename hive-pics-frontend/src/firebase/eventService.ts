import type { Event } from "@shared";
import type { Unsubscribe } from "firebase/firestore";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/index";

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
};
