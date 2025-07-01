import * as functions from "firebase-functions";
import { onCustomEventPublished } from "firebase-functions/v2/eventarc";
import * as z from "zod/v4-mini";
import { HttpsError } from "firebase-functions/https";
import {getFirestore} from "firebase-admin/firestore";

const ImageResizedEvent = z.object({
  data: z.object({
    // input is an ObjectMetadata from "firebase-functions/v1/storage"
    input: z.object({
      bucket: z.string(),
      name: z.string(),
      contentType: z.string(),
      metageneration: z.string(),
      updated: z.string(),
      timeCreated: z.string(),
      storageClass: z.string(),
      size: z.string(),
      md5Hash: z.string(),
    }),
    // outputs is an array of ResizedImageResult, see
    // https://github.com/firebase/extensions/blob/2f23c5a7efa657aca8ee7b24f9809644687d5c08/storage-resize-images/functions/src/resize-image.ts#L15
    outputs: z.array(
      z.object({
        size: z.string(),
        outputFilePath: z.string(),
        success: z.boolean(),
      }),
    ),
  }),
});

export const onImageResized = onCustomEventPublished(
  {
    eventType: "firebase.extensions.storage-resize-images.v1.onSuccess",
    channel: "locations/europe-west4/channels/firebase",
    region: "europe-west4",
  },
  (event) => {
    const validation = ImageResizedEvent.safeParse(event);
    if (!validation.success) {
      throw new HttpsError("invalid-argument", validation.error.message);
    } else {
      const imageResizedEvent = validation.data;

      const db = getFirestore();
      // full file path in the bucket (absolute path, file name, file ext)
      const originalImageFilePath = imageResizedEvent.data.input.name;
      // full path in firestore (same as file path in bucket, but file ext removed)
      const docPath = originalImageFilePath.substring(0, originalImageFilePath.lastIndexOf('.'));
      const docRef = db.doc(docPath);



    }
  },
);
