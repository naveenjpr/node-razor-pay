const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const server = express()
server.use(cors())

server.use(express.json()) // JSON पार्सर मिडलवेयर
server.use(express.urlencoded({ extended: true })) // URL-encoded पार्सर मिडलवेयर

server.get("/", (request, response) => {
  response.send("Server Working Fine.....")
})

require("./src/routes/frontend/orders.routes")(server)

server.get("*", (request, response) => {
  response.send("Page not found.....")
})

mongoose
  .connect(
    "mongodb+srv://naveensainijpr:Gionee123@cluster0.fdq1d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    server.listen("5000", () => {
      console.log("Database Connected!")
    })
  })
  .catch((error) => {
    console.log("Database Not Connected!" + error)
  })

//naveensainijpr
//Gionee123
