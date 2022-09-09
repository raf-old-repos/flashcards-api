import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../util/db";
import { unstable_getServerSession } from "next-auth/next"
import { nextAuthOptions } from "../auth/[...nextauth]";
import { Method } from "../../../types/Method";
interface Response { }

const method: Method = "POST";

interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        readonly studySetId: string,
        readonly term: string,
        readonly definition: string
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
                const { studySetId, term, definition } = req.body;

                const card = await db.card.create({
                    data: {
                        term,
                        definition,
                        studySet: {
                            connect: {
                                id: studySetId
                            }
                        }

                    }
                })

                return res.status(200).json({ card });
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