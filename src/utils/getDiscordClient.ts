import { Client } from "discord.js";

import { IntentOptions } from "../config/IntentOptions";

export const BOT = new Client({ intents: IntentOptions }) // 32767 = all intents