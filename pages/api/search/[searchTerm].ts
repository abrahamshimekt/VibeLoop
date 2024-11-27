import { client } from "@/utils/client";
import { searchPostsQuery } from "@/utils/queries";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { searchTerm }: any = req.query;
    const videosQuery = searchPostsQuery(searchTerm);
    const vidoes = await client.fetch(videosQuery);
    res.status(200).json(vidoes);
  }
}
