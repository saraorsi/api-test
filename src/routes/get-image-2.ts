import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import path from 'path';




export async function getImageRoute(app: FastifyInstance) {
    app.get('/image', async () => {
        const image = await prisma.image.findMany()
        return image
    })
}