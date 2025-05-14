export const createUpdatePayload = (existingDoc, incomingUpdate) => {
  const updatePayload = {};

  // Loop through each key in the incoming update
  for (const key in incomingUpdate) {
    // Skip _id and other irrelevant fields (optional)
    if (key === "_id") continue;

    // If the value has changed or is new, add to the update payload
    if (existingDoc[key] !== incomingUpdate[key]) {
      updatePayload[key] = incomingUpdate[key];
    }
  }

  return updatePayload;
}