import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"

import { ICommand } from "../interfaces"
import { getClient } from "../utils"

const DOMAIN_ENTITY_NAME = "domain-rotation-image"
export const domain: ICommand = {
  data: new SlashCommandBuilder()
    .setName("domain")
    .setDescription("Responds with domain rotation information")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Update domain rotation image url")
    ),

  run: async (interaction: CommandInteraction) => {
    await interaction.deferReply()

    // await interaction.reply(DOMAIN_ROTATION_IMG)
    const client = getClient()

    const newUrl = interaction.options.getString("url")

    if (newUrl) {
      try {
        await client.entity.upsert({
          where: {
            name: DOMAIN_ENTITY_NAME
          },
          update: {
            url: newUrl
          },
          create: {
            name: DOMAIN_ENTITY_NAME,
            url: newUrl
          }
        })
        await interaction.editReply({
          content: "Successfully updated the domain url"
        })
      } catch (error) {
        console.error(`Could not update the url to ${newUrl}`)
      }
    } else {
      try {
        const domainEntity = await client.entity.findUnique({
          where: {
            name: DOMAIN_ENTITY_NAME
          }
        })
        if (domainEntity) {
          await interaction.editReply({
            content: domainEntity.url
          })
        } else {
          await interaction.editReply({
            content: `Url entry not found. Please update the url by passing the optional url param.`
          })
        }
      } catch (error) {
        console.error(`Could not fetch the domain url`)
      }
    }
  },
}
