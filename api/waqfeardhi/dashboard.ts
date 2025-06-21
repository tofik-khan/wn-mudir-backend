require("dotenv").config();
import { MongoClient } from "mongodb";
import dayjs from "dayjs";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/`
);

export const getApplicationCount = async (req, res) => {
  try {
    await client.connect();

    const applicationsCount = await client
      .db("waqfeardhi")
      .collection("applicants")
      .countDocuments({});
    res.send({ status: "success", data: applicationsCount });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const getProjectCount = async (req, res) => {
  try {
    await client.connect();

    const projectCount = await client
      .db("waqfeardhi")
      .collection("projects")
      .countDocuments({});
    res.send({ status: "success", data: projectCount });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const getCompletedApplicationsCount = async (req, res) => {
  try {
    await client.connect();

    const result = await client
      .db("waqfeardhi")
      .collection("applicants")
      .countDocuments({ status: "completed" });
    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const getApplicationsByAuxiliary = async (req, res) => {
  try {
    await client.connect();

    const result = await client
      .db("waqfeardhi")
      .collection("applicants")
      .aggregate([
        { $group: { _id: "$auxiliary", count: { $sum: 1 } } },
        { $project: { _id: 0, label: "$_id", value: "$count" } },
      ])
      .toArray();

    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};
