import { ICommand } from "../interfaces/command"
import { assemble } from "./assemble"
import { ping } from "./ping"

export const CommandList: ICommand[] = [ping, assemble]
