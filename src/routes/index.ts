import { server } from "../utils/getServer"
import { health } from "./health"

export function initRoutes() {

  // route for health checking
  server.get("/", health)

  const start = async () => {
    try {
      await server.listen(8080, "0.0.0.0")
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  start()
}