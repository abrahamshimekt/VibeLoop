import { createClient } from "@sanity/client";
export const client = createClient({
  projectId: "ntih0750",
  dataset: "production",
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: "2023-05-03",
  token:process.env.NEXT_PUBLIC_SANITY_TOKEN
});
