import { Interaction } from "discord.js"

import { CommandList } from "../commands"

export async function onInteraction(interaction: Interaction) {
  if (interaction.isCommand()) {
    for (const command of CommandList) {
      if (interaction.commandName === command.data.name) {
        await command.run(interaction)
        break
      }
    }
  }
}
