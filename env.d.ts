declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string,
      GUILD_ID: string,
      DATABASE_URL: string,
    }
  }
}

export { }