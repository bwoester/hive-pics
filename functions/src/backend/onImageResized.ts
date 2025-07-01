import * as functions from "firebase-functions";
import { onCustomEventPublished } from "firebase-functions/v2/eventarc";

export const onImageResizeStart = onCustomEventPublished(
  {
    eventType: "firebase.extensions.storage-resize-images.v1.onStart",
    channel: "locations/europe-west4/channels/firebase",
    region: "europe-west4",
  },
  (event) => {
    functions.logger.info("Resize Image started", event);
    // Additional operations based on the event data can be performed here
    return Promise.resolve();
  },
);

export const onImageResizeSuccess = onCustomEventPublished(
  {
    eventType: "firebase.extensions.storage-resize-images.v1.onSuccess",
    channel: "locations/europe-west4/channels/firebase",
    region: "europe-west4",
  },

  (event) => {
    functions.logger.info("Resize Image is successful", event);
    // Additional operations based on the event data can be performed here
    return Promise.resolve();
  },
);

export const onImageResizeError = onCustomEventPublished(
  {
    eventType: "firebase.extensions.storage-resize-images.v1.onError",
    channel: "locations/europe-west4/channels/firebase",
    region: "europe-west4",
  },

  (event) => {
    functions.logger.info("Resize Image failed", event);
    // Additional operations based on the event data can be performed here
    return Promise.resolve();
  },
);

export const onImageResizeCompletion = onCustomEventPublished(
  {
    eventType: "firebase.extensions.storage-resize-images.v1.onCompletion",
    channel: "locations/europe-west4/channels/firebase",
    region: "europe-west4",
  },
  (event) => {
    functions.logger.info("Resize Image is complete", event);
    // Additional operations based on the event data can be performed here
    return Promise.resolve();
  },
);
