import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { Client } from "discord.js"

import { CommandList } from "../commands"

export async function onReady(BOT: Client) {

  BOT.user?.setPresence({
    activities: [
      { name: "Not an emergency food!", type: "STREAMING" }
    ],
  })

  const rest = new REST({ version: "9" }).setToken(
    process.env.BOT_TOKEN,
  )

  const commandData = CommandList.map((command) => command.data.toJSON())

  await rest.put(
    Routes.applicationGuildCommands(
      BOT.user?.id || "missing id",
      process.env.GUILD_ID
    ),
    {
      body: commandData,
    },
  )

  console.log("Discord ready!")
}
