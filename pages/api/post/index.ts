import { client } from "@/utils/client";
import { allPostsQuery } from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const query = allPostsQuery();
      const data = await client.fetch(query);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  } else if (req.method === "POST") {
    try {
      const document = req.body;
      client.create(document).then(() => res.status(201).json("video created"));
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
