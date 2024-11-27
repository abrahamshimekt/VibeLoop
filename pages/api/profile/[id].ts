import { client } from "@/utils/client";
import {
  singleUserQuery,
  userCreatedPostsQuery,
  userLikedPostsQuery,
} from "@/utils/queries";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id }: any = req.query;
    const query = singleUserQuery(id);
    const userVideosQuery = userCreatedPostsQuery(id);
    const userLikedVidoesQuery = userLikedPostsQuery(id);
    const user = await client.fetch(query);
    const userVideos = await client.fetch(userVideosQuery);
    const userLikedVideos = await client.fetch(userLikedVidoesQuery);
    res.status(200).json({user:user[0], userVideos, userLikedVideos });
  } else if (req.method === "PUT") {
    const { id }: any = req.query;
    const { username, image } = req.body;
    const user = await client
      .patch(id)
      .set({ ...(username && { username }), ...(image && {image}) })
      .commit();
    res.status(200).json(user);
  }
}
