export const getPublicPresentersPipeline = () => [
  {
    $lookup: {
      from: "sessions",
      let: {
        presenterIdStr: {
          $toString: "$_id",
        },
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$$presenterIdStr", "$presenters.value"],
            },
          },
        },
        {
          $unset: "presenters",
        },
      ],
      as: "sessions",
    },
  },
];
