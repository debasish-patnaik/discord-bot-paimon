import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"

import { ICommand } from "../interfaces"

const DOMAIN_ROTATION_IMG = "https://i.redd.it/2gbkr2y05zh81.png"

export const domain: ICommand = {
  data: new SlashCommandBuilder()
    .setName("domain")
    .setDescription("Responds with domain rotation information"),

  run: async (interaction: CommandInteraction) => {
    await interaction.reply(DOMAIN_ROTATION_IMG)
  },
}
