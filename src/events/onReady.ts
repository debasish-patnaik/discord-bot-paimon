import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { Client } from "discord.js"

import { CommandList } from "../commands/_CommandList"

export async function onReady(BOT: Client) {

  BOT.user?.setPresence({
    activities: [
      { name: "Dance with SahilRider", type: "STREAMING" },
      { name: "Character builds with Rakiyun", type: "WATCHING" },
      { name: "in trials with Prayas", type: "COMPETING" },
      { name: "Not an emergency food!" }
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
