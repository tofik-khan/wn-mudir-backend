require("dotenv").config();
import dayjs from "dayjs";
import { MongoClient } from "mongodb";

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

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/`
);

export const getMongoDbStatus = async (req, res) => {
  try {
    await client.connect();

    const response = await client.db("mudir").stats();
    res.send({
      status: "success",
      data: {
        isOnline: response.ok === 1,
        message: response.ok === 1 ? "Online" : "Failed to Conenct to MongoDB",
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const getDigitalOceanStatus = async (req, res) => {
  try {
    const response = await fetch(
      "https://status.digitalocean.com/api/v2/status.json"
    );
    const data = await response.json();
    res.send({
      status: "success",
      data: {
        isOnline: data.status.indicator === "none",
        message: data.status.description,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  }
};

export const getDashboardNotifications = async (req, res) => {
  try {
    await client.connect();

    const result = await client
      .db("mudir")
      .collection("notifications")
      .find({ published: true })
      .toArray();
    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};
