import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { auth, storage } from "@/firebase/index";

export const storageService = {
  /**
   * Uploads a cover image for an event to Firebase Storage
   * @param file - The file to upload
   * @param eventId - The ID of the associated event
   * @returns Promise with the download URL of the uploaded image
   */
  async uploadEventCoverImage(file: File, eventId: string): Promise<string> {
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to upload images");
    }

    const userId = auth.currentUser.uid;
    const eventFolder = `users/${userId}/events/${eventId}`;
    const timestamp = Date.now();
    const extension = file.name.split(".").pop()?.toLowerCase() || "unknown";
    const eventCoverFileName = `cover-image_${timestamp}.${extension}`;
    const eventCoverImageRef = storageRef(
      storage,
      `${eventFolder}/${eventCoverFileName}`,
    );

    try {
      // delete old images
      await this.deleteEventCoverImages(eventId);

      // Upload the file
      const snapshot = await uploadBytes(eventCoverImageRef, file);

      // Get the download URL
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  },

  async deleteEventCoverImages(eventId: string): Promise<number> {
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to upload images");
    }

    const userId = auth.currentUser.uid;
    const eventFolder = `users/${userId}/events/${eventId}`;
    const eventFolderRef = storageRef(storage, eventFolder);

    try {
      // List all files in the event folder
      const listResult = await listAll(eventFolderRef);

      // Filter cover images
      const coverImages = listResult.items.filter((item) =>
        item.name.startsWith("cover-image"),
      );

      // Delete existing cover images
      const deletionPromises = coverImages.map((item) => deleteObject(item));

      await Promise.all(deletionPromises);

      return coverImages.length;
    } catch (error) {
      console.error("Error deleting event cover images:", error);
      throw new Error("Failed to delete event cover images");
    }
  },
};
