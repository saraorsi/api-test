import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { uploadImageRoute } from './routes/upload-image'
import { createPromptRoute } from './routes/create-prompt'
import { getImageRoute } from './routes/get-image'



const app = fastify()

app.register(fastifyCors, {
    origin: '*'
})



app.register(createPromptRoute)
app.register(uploadImageRoute)
app.register(getImageRoute)


app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('HTTP Server Running!')
})