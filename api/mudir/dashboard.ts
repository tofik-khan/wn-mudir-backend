require("dotenv").config();
import dayjs from "dayjs";

export const imageKitUsage = async (req, res) => {
  const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const endDate = dayjs().format("YYYY-MM-DD");
  const url = `https://api.imagekit.io/v1/accounts/usage?startDate=${startDate}&endDate=${endDate}`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${process.env.IMAGEKIT_API_PRIVATE_KEY}`,
    },
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const payload = {
      startDate,
      endDate,
      usage: data,
    };

    res.send({ status: "success", data: payload });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};
