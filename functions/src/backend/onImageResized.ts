import { onCustomEventPublished } from "firebase-functions/v2/eventarc";
import * as z from "zod/v4-mini";
import { HttpsError } from "firebase-functions/https";
import { getFirestore } from "firebase-admin/firestore";

const ImageResizedEvent = z.looseObject({
  data: z.looseObject({
    // input is an ObjectMetadata from "firebase-functions/v1/storage"
    input: z.looseObject({
      name: z.string(),
      size: z.string(),
      md5Hash: z.string(),
    }),
    // outputs is an array of ResizedImageResult, see
    // https://github.com/firebase/extensions/blob/2f23c5a7efa657aca8ee7b24f9809644687d5c08/storage-resize-images/functions/src/resize-image.ts#L15
    outputs: z.array(
      z.looseObject({
        value: z.looseObject({
          size: z.string(),
          outputFilePath: z.string(),
          success: z.boolean(),
        }),
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
  async (event) => {
    const validation = ImageResizedEvent.safeParse(event);
    if (!validation.success) {
      const message = `Input validation failed: ${validation.error.message}, received: ${JSON.stringify(event)}`;
      console.error(message);
      throw new HttpsError("invalid-argument", message);
    } else {
      const imageResizedEvent = validation.data;
      // full file path in the bucket (absolute path, file name, file ext)
      const originalImageFilePath = imageResizedEvent.data.input.name;
      // full path in firestore (same as the file path in bucket, but file ext removed)
      const docPath = originalImageFilePath.substring(
        0,
        originalImageFilePath.lastIndexOf("."),
      );
      const db = getFirestore();
      const docRef = db.doc(docPath);

      // Check if the document exists
      const doc = await docRef.get();
      if (!doc.exists) {
        const message = `Document at path ${docPath} does not exist.`;
        console.error(message);
        throw new HttpsError("not-found", message);
      }

      const docData = doc.data();
      if (!docData) {
        const message = `Document at path ${docPath} exists but has no data.`;
        console.error(message);
        throw new HttpsError("internal", message);
      }

      // Generate information about resized images
      const resizedImagesInfo = await Promise.all(
        imageResizedEvent.data.outputs
          .filter((i) => i.value.success)
          .map((i) => {
            return {
              size: i.value.size,
              storagePath: i.value.outputFilePath,
            };
          }),
      );

      if (resizedImagesInfo.length > 0) {
        await docRef.update({
          resizedImages: resizedImagesInfo,
        });

        console.info(
          `Updated document at path ${docPath} with resized images information.`,
        );
      }
    }
  },
);
