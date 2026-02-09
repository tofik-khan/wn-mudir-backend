export const getPublicSessionPipeline = (date) => [
  {
    $match: {
      date,
    },
  },
  {
    $addFields: {
      presenterIds: {
        $map: {
          input: "$presenters",
          as: "p",
          in: {
            $toObjectId: "$$p.value",
          },
        },
      },
    },
  },
  {
    $lookup: {
      from: "presenters",
      localField: "presenterIds",
      foreignField: "_id",
      as: "presenterDetails",
    },
  },
  {
    $set: {
      presenters: "$presenterDetails",
    },
  },
  {
    $unset: ["presenterDetails", "presenterIds"],
  },
  {
    $group: {
      _id: "$startTime",
      sessions: {
        $push: "$$ROOT",
      },
    },
  },
];
