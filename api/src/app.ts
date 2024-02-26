require("dotenv").config()

import Fastify from "fastify"
import FastifyCors from "@fastify/cors"
import { FastifyRequest, FastifyReply } from "fastify"
import { MANGA } from "@consumet/extensions"
;(async () => {
  const PORT = Number(process.env.PORT) || 3000
  const mangasee123 = new MANGA.Mangasee123()

  // Fastify Conf
  const fastify = Fastify({
    maxParamLength: 1000,
    logger: true,
  })
  await fastify.register(FastifyCors, {
    origin: "*",
    methods: "GET",
  })

  console.log(`Starting server on port ${PORT}... 🚀`)

  try {
    // Index
    fastify.get("/", (_, rp) => {
      rp.status(200).send({
        intro: `Welcome to XO Manga`,
        routes: [":query", "info/:id", "read/:chapterId"],
      })
    })

    // Search
    fastify.get(
      "/:query",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const query = (request.params as { query: string }).query

        const res = await mangasee123.search(query)

        reply.status(200).send(res)
      }
    )

    // Details
    fastify.get(
      "/info",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const id = (request.query as { id: string }).id

        if (typeof id === "undefined")
          return reply.status(400).send({ message: "id is required" })

        try {
          const res = await mangasee123
            .fetchMangaInfo(id)
            .catch((err) => reply.status(404).send({ message: err }))

          reply.status(200).send(res)
        } catch (err) {
          reply
            .status(500)
            .send({ message: "Something went wrong. Please try again later." })
        }
      }
    )

    // Read
    fastify.get(
      "/read",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const chapterId = (request.query as { chapterId: string }).chapterId

        if (typeof chapterId === "undefined")
          return reply.status(400).send({ message: "chapterId is required" })

        try {
          const res = await mangasee123
            .fetchChapterPages(chapterId)
            .catch((err: Error) =>
              reply.status(404).send({ message: err.message })
            )

          reply.status(200).send(res)
        } catch (err) {
          reply
            .status(500)
            .send({ message: "Something went wrong. Please try again later." })
        }
      }
    )

    // Default
    fastify.get("*", (request, reply) => {
      reply.status(404).send({
        message: "",
        error: "page not found",
      })
    })

    // Server Conf
    fastify.listen({ port: PORT, host: "0.0.0.0" }, (e, address) => {
      if (e) throw e
      console.log(`server listening on ${address}`)
    })
  } catch (err: any) {
    fastify.log.error(err)
    process.exit(1)
  }
})()
