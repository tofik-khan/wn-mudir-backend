import express, { Express, Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.DB_CONNECT_STRING);

const app: Express = express();
const port = process.env.PORT || 3000;

const getFAQs = async (req, res: Response) => {
  try {
    await client.connect();

    const result = await client
      .db("waqfeardhi")
      .collection("projects")
      .find({})
      .toArray();
    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

const getApplicants = async (req, res: Response) => {
  try {
    await client.connect();

    const result = await client
      .db("waqfeardhi")
      .collection("applicants")
      .find({})
      .toArray();
    res.send({ status: "success", data: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  } finally {
    await client.close();
  }
};

app.get("/", (req: Request, res: Response) => {
  res.send("Ready to run on Heroku.");
});

app.get("/waqfeardhi/projects", getFAQs);
app.get("/waqfeardhi/applicants", getApplicants);

app.listen(port, () => {
  return console.log(`[server]: Server is running on ${port}`);
});
