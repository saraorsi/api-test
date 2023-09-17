import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";


export async function createPromptRoute(app: FastifyInstance) {
    app.post('/prompt', async (req) => {


        const bodySchema = z.object({
            prompt: z.string(),
        });

        const { prompt } = bodySchema.parse(req.body)


        const promptUpload = await prisma.image.create({
            data: {
                prompt
            }
        })

        return promptUpload
    })
}