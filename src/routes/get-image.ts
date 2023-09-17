import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import path from 'path';
import { promises as fs } from 'fs';

export async function getImageRoute(app: FastifyInstance) {
    app.get('/fileimage/:imageId', async (req, reply) => {

        const paramsSchema = z.object({
            imageId: z.string().uuid(),
        });

        const { imageId } = paramsSchema.parse(req.params);

        const imageRecord = await prisma.image.findFirst({
            where: {
                id: imageId
            }
        });

        if (!imageRecord) {
            reply.status(404).send('Image not found');
            return;
        }

        if (!imageRecord.path) {
            reply.status(500).send('Image path is missing');
            return;
        }

        const filePath = path.join(__dirname, '..', '..', 'tmp', imageRecord.path);

        try {
            const data = await fs.readFile(filePath);
            reply.type('image/jpeg').send(data);
        } catch (err) {
            reply.code(404).send('Not found');
        }
    });
}
