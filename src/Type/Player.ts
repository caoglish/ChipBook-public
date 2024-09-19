import {Log} from './Log'

export interface Player{
	id: string
	player_name: string
	player_display_name: string
	allow_select:boolean
}

export interface PlayerInGame extends Player {
	player_id: string
	hands_bought: number
	chips_bought: number
	amount_bought: number
	remaining_chips: number | null
	win_loss_chips: string | number
	win_loss_amount: string | number
	logs: Log[]
  }