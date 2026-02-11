require("dotenv").config();

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

import { MongoClient, ObjectId } from "mongodb";
import { getPublicPresentersPipeline } from "../../pipeline/presenters";

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CONNECTION}/`,
);

export const getPresenters = async (req, res) => {
  try {
    await client.connect();

    const result = await client
      .db("expo")
      .collection("presenters")
      .find({})
      .toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const getOnePresenter = async (req, res) => {
  try {
    await client.connect();
    const { id } = req.params;

    const result = await client
      .db("expo")
      .collection("presenters")
      .find({ _id: new ObjectId(id) })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const createPresenter = async (req, res) => {
  try {
    await client.connect();

    const result = await client
      .db("expo")
      .collection("presenters")
      .insertOne({
        ...req.body,
        createdAt: dayjs().tz("America/New_York").format(),
      });
    res.send({ status: "success", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const updatePresenter = async (req, res) => {
  try {
    await client.connect();
    const { id } = req.params;

    if (!!req.body._id) delete req.body._id;

    const result = await client
      .db("expo")
      .collection("presenters")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const getPublicPresenters = async (req, res) => {
  try {
    await client.connect();

    const result = await client
      .db("expo")
      .collection("presenters")
      .aggregate(getPublicPresentersPipeline())
      .toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: error.message });
  }
};
