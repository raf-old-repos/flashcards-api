import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../util/db";
import { unstable_getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../auth/[...nextauth]";
import { Prisma } from "@prisma/client";
import { Method } from "../../../types/Method";

interface Response {}

const method: Method = "POST";

type ToComplete = "admin" | "firstName" | "lastName";

interface UserDetails extends Pick<Prisma.UserCreateInput, ToComplete> {}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    readonly id: string;
    readonly details: UserDetails;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const session = await unstable_getServerSession(req, res, nextAuthOptions);

    if (!session) throw new Error("Unauthenticated");

    const { id, details } = req.body;

    switch (req.method) {
      case method: {
        const completedProfile = await db.user.update({
          where: {
            id,
          },
          data: {
            admin: details.admin,
            profileComplete: true,
            firstName: details.firstName,
            lastName: details.lastName,
          },
        });

        return res.status(200).json({
          completedProfile,
        });
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
