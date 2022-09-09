import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../util/db";
import { unstable_getServerSession } from "next-auth/next"
import { nextAuthOptions } from "../auth/[...nextauth]";
import { Method } from "../../../types/Method";
import { Prisma } from "@prisma/client";
interface Response { }

const method: Method = "PUT";

interface CardDetails extends Pick<Prisma.CardCreateInput, "definition" | "term"> { }

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        readonly id: string,
        readonly studySetId: string,
        readonly update: CardDetails
    }
}

export default async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse<Response>
) {
    try {
        const session = await unstable_getServerSession(req, res, nextAuthOptions)

        if (!session) throw new Error("Unauthenticated")

        switch (req.method) {
            case method: {
                const { id, update, studySetId } = req.body



                const updatedCard = await db.card.update({
                    where: {
                        id
                    },
                    data: {
                        ...update,
                        studySet: {
                            connect: {
                                id: studySetId
                            }
                        }
                    }
                })


                return res.status(200).json({ updatedCard });
            }
            default: {
                throw new Error(
                    `Route "${req.url}" accepts "${method}" method. Provided "${req.method}"`
                );
            }
        }
    } catch (e: any) {
        console.log(e.toString())
        return res.status(400).json({
            e: e.toString()
        });
    }
}