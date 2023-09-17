import { FastifyInstance } from "fastify";
import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { promisify } from "util";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const pump = promisify(require("stream").pipeline);

export async function uploadImageRoute(app: FastifyInstance) {

    app.post('/image/:imageId/path', async (req, reply) => {

        const paramsSchema = z.object({
            imageId: z.string().uuid(),
        })

        const { imageId } = paramsSchema.parse(req.params)


        const bodySchema = z.object({
            imageUrl: z.string(),
        });

        const { imageUrl } = bodySchema.parse(req.body)

        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');

            const currentDir = path.dirname(fileURLToPath(import.meta.url));
            const imageName = `${Date.now()}.jpg`;
            const imagePath = path.join(currentDir, '..', '..', 'tmp', imageName);

            // Ensure the tmp directory exists
            await fs.mkdir(path.join(currentDir, 'tmp'), { recursive: true });

            // Save the image to the tmp directory
            await fs.writeFile(imagePath, imageBuffer);


            await prisma.image.update({
                where: {
                    id: imageId
                },
                data: {
                    path: imageName
                }
            })


            reply.send({ message: 'Image downloaded!', path: imagePath });


        } catch (error) {
            reply.status(500).send({ error: 'Failed to download the image.' });
        }
    });
}
