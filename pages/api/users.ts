import { client } from "@/utils/client";
import { allUserQuery } from "@/utils/queries";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const data = await client.fetch(allUserQuery());
    if (data) {
      res.status(200).json(data);
    } else {
      res.json([]);
    }
  }
}
