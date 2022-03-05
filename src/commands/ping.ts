import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"

import { ICommand } from "../interfaces"

export const ping: ICommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responds with Pong!"),
  run: async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!")
  },
}
