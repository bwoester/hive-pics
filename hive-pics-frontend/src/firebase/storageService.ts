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
   * Uploads an image to Firebase Storage based on the use case
   * @param file - The file to upload
   * @param metadata - Object containing metadata for the upload (useCase, id, etc.)
   * @returns Promise with the download URL of the uploaded image
   */
  async uploadImage(
    file: File,
    metadata: {
      useCase: "event-cover" | "challenge" | "profile" | string;
      id: string;
      additionalId?: string;
    },
  ): Promise<string> {
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to upload images");
    }

    const userId = auth.currentUser.uid;
    let folderPath = "";
    let filePrefix = "";

    // Determine folder path and file prefix based on use case
    switch (metadata.useCase) {
      case "event-cover": {
        folderPath = `users/${userId}/events/${metadata.id}`;
        filePrefix = "cover-image";
        // Delete old cover images before uploading new one
        await this.deleteImages({
          useCase: "event-cover",
          id: metadata.id,
        });
        break;
      }
      case "challenge": {
        folderPath = `users/${userId}/challenges/${metadata.id}`;
        filePrefix = "challenge-photo";
        break;
      }
      case "profile": {
        folderPath = `users/${userId}/profile`;
        filePrefix = "profile-photo";
        break;
      }
      default: {
        // For custom use cases
        folderPath = `users/${userId}/${metadata.useCase}/${metadata.id}`;
        filePrefix = metadata.useCase;
        if (metadata.additionalId) {
          folderPath += `/${metadata.additionalId}`;
        }
      }
    }

    const timestamp = Date.now();
    const extension = file.name.split(".").pop()?.toLowerCase() || "unknown";
    const fileName = `${filePrefix}_${timestamp}.${extension}`;
    const imageRef = storageRef(storage, `${folderPath}/${fileName}`);

    try {
      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);

      // Get the download URL
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  },

  /**
   * Uploads a cover image for an event to Firebase Storage
   * @param file - The file to upload
   * @param eventId - The ID of the associated event
   * @returns Promise with the download URL of the uploaded image
   */
  async uploadEventCoverImage(file: File, eventId: string): Promise<string> {
    return this.uploadImage(file, {
      useCase: "event-cover",
      id: eventId,
    });
  },

  /**
   * Uploads a photo for a challenge to Firebase Storage
   * @param file - The file to upload
   * @param challengeId - The ID of the associated challenge
   * @param eventId - Optional ID of the associated event
   * @returns Promise with the download URL of the uploaded image
   */
  async uploadChallengePhoto(
    file: File,
    challengeId: string,
    eventId?: string,
  ): Promise<string> {
    return this.uploadImage(file, {
      useCase: "challenge",
      id: challengeId,
      additionalId: eventId,
    });
  },

  /**
   * Deletes images from Firebase Storage based on the use case
   * @param metadata - Object containing metadata for the deletion (useCase, id, etc.)
   * @returns Promise with the number of deleted images
   */
  async deleteImages(metadata: {
    useCase: "event-cover" | "challenge" | "profile" | string;
    id: string;
    additionalId?: string;
    filePrefix?: string;
  }): Promise<number> {
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to delete images");
    }

    const userId = auth.currentUser.uid;
    let folderPath = "";
    let filePrefix = metadata.filePrefix || "";

    // Determine folder path and file prefix based on use case
    switch (metadata.useCase) {
      case "event-cover": {
        folderPath = `users/${userId}/events/${metadata.id}`;
        filePrefix = "cover-image";
        break;
      }
      case "challenge": {
        folderPath = `users/${userId}/challenges/${metadata.id}`;
        filePrefix = "challenge-photo";
        break;
      }
      case "profile": {
        folderPath = `users/${userId}/profile`;
        filePrefix = "profile-photo";
        break;
      }
      default: {
        // For custom use cases
        folderPath = `users/${userId}/${metadata.useCase}/${metadata.id}`;
        if (metadata.additionalId) {
          folderPath += `/${metadata.additionalId}`;
        }
      }
    }

    const folderRef = storageRef(storage, folderPath);

    try {
      // List all files in the folder
      const listResult = await listAll(folderRef);

      // Filter images by prefix if provided
      const filteredImages = filePrefix
        ? listResult.items.filter((item) => item.name.startsWith(filePrefix))
        : listResult.items;

      // Delete existing images
      const deletionPromises = filteredImages.map((item) => deleteObject(item));

      await Promise.all(deletionPromises);

      return filteredImages.length;
    } catch (error) {
      console.error(`Error deleting images for ${metadata.useCase}:`, error);
      throw new Error(`Failed to delete images for ${metadata.useCase}`);
    }
  },

  /**
   * Deletes cover images for an event from Firebase Storage
   * @param eventId - The ID of the associated event
   * @returns Promise with the number of deleted images
   */
  async deleteEventCoverImages(eventId: string): Promise<number> {
    return this.deleteImages({
      useCase: "event-cover",
      id: eventId,
    });
  },
};
