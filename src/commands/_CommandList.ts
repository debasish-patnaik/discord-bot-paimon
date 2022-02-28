import { ICommand } from "../interfaces/command"
import { assemble } from "./assemble"
import { ping } from "./ping"
import { reset } from "./reset"
import { resin } from "./resin"

export const CommandList: ICommand[] = [ping, assemble, reset, resin]
