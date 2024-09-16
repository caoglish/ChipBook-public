import {Log} from './Log'

export interface Player{
	id: string
	player_name: string
	player_display_name: string
}

export interface PlayerInGame extends Player {
	hands_bought: number
	chips_bought: number
	amount_bought: number
	remaining_chips: number | null
	win_loss_chips: string | number
	win_loss_amount: string | number
	logs: Log[]
  }