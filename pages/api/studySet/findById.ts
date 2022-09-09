import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../util/db";
import { unstable_getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../auth/[...nextauth]";

interface Response {}

const method = "GET";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    console.log(session);
    if (!session) throw new Error("Unauthenticated");

    switch (req.method) {
      case method: {
        const { id } = req.body;

        const studySet = await db.studySet.findUniqueOrThrow({
          where: {
            id,
          },
          include: {
            cards: true
          }
        });
        return res.status(200).json({ studySet });
      }
      
      default: {
        throw new Error(
          `Route "${req.url}" accepts "${method}" method. Provided "${req.method}"`
        );
      }
    }
  } catch (e: any) {
    console.log(e.toString());
    return res.status(400).json({
      e: e.toString(),
    });
  }
}
