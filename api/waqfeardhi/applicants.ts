require("dotenv").config();

import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/`
);

export const getApplicants = async (req, res) => {
  try {
    await client.connect();

    const applicants = await client
      .db("waqfeardhi")
      .collection("applicants")
      .find({})
      .toArray();
    res.send({ status: "success", data: applicants });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

export const getOneApplicant = async (req, res) => {
  try {
    await client.connect();

    const { id } = req.params;

    const applicants = await client
      .db("waqfeardhi")
      .collection("applicants")
      .find({ _id: new ObjectId(id) })
      .toArray();
    res.send({ status: "success", data: applicants });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};
