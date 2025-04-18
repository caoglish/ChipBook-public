<template>
  <div class="player-table">
    <!-- 玩家信息表格 -->
    <v-data-table
      :headers="headersToShow"
      :items="playerList"
      :row-props="rowProps"
      :items-per-page="-1"
      :hide-default-footer="true"
      class="mt-4"
    >
      <template #item.player_display_name="{ item }">
        <span v-if="isFirstPlace(item)">
          <v-chip color="default" variant="flat">🏆{{ item.player_display_name }}</v-chip>
        </span>
        <span v-else class="text-subtitle-1 font-weight-black">
          {{ item.player_display_name }}
        </span>
      </template>
      <template #item.actions="{ item }">
        <div class="button-container">
          <div class="button-group">
            <v-btn color="primary" @click="buyIn(item)" prepend-icon="mdi-cash-plus">买入</v-btn>
            <v-btn color="primary" @click="setRemaining(item)" prepend-icon="mdi-poker-chip"
              >剩余</v-btn
            >
            <v-btn color="primary" @click="refund(item)" prepend-icon="mdi-cash-refund">退码</v-btn>
            <v-btn
              color="error"
              @click="deletePlayer(item)"
              v-if="isBuyinZero(item)"
              prepend-icon="mdi-delete"
              >删除</v-btn
            >
          </div>
          <div class="mic-button">
            <v-btn color="cyan-darken-1" @click="voiceReport(item)" size="small" icon
              ><v-icon>mdi-microphone</v-icon></v-btn
            >
          </div>
        </div>
      </template>
      <template #item.remaining_chips="{ item }">
        <span v-if="item.remaining_chips !== null">{{ item.remaining_chips }}</span>
        <v-chip v-else color="red" variant="flat">未输入</v-chip>
      </template>
      <template #item.win_loss_chips="{ item }">
        <span v-if="item.remaining_chips !== null">{{ item.win_loss_chips }}</span>
        <v-chip v-else color="red" variant="flat">未计算</v-chip>
      </template>
      <template #item.win_loss_amount="{ item }">
        <span v-if="item.remaining_chips !== null">{{ item.win_loss_amount }}</span>
        <v-chip v-else color="red" variant="flat">未计算</v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { voiceReport } from '@/composables/useVoiceReport'
// @ts-ignore
import { useGameStore } from '@/store/useGameStore' // 导入 gameStore

export default {
  name: 'PlayerTable',
  props: {
    players: {
      type: Array,
      required: true,
    },
    isExporting: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    // 根据导出状态动态生成表头
    headersToShow() {
      const headers = [
        { title: '显示名称', key: 'player_display_name' },
        { title: '买入手数', key: 'hands_bought' },
        { title: '买入筹码', key: 'chips_bought' },
        { title: '买入金额', key: 'amount_bought' },
        { title: '剩余筹码', key: 'remaining_chips' },
        { title: '收益筹码', key: 'win_loss_chips' },
        { title: '收益金额', key: 'win_loss_amount' },
      ]

      // 如果不在导出模式下，添加操作列
      if (!this.isExporting) {
        headers.push({ title: '操作', key: 'actions', sortable: false })
      }

      return headers
    },
    playerList() {
      const gameStore = useGameStore()
      if (gameStore.isWinLossCalculated) {
        gameStore.players.sort((a, b) => b.win_loss_chips - a.win_loss_chips)
      }
      return gameStore.players
    },
  },
  methods: {
    rowProps(data) {
      const player = data.item

      if (this.isFirstPlace(player)) {
        return { class: 'first-place' }
      }
      return { class: data.index % 2 === 0 ? 'odd-row' : 'even-row' }
    },
    isFirstPlace(player) {
      if (!player) return false
      const gameStore = useGameStore()
      if (!gameStore.playerWithMostChips || gameStore.playerWithMostChips.length === 0) return false

      // 检查玩家是否在最高筹码玩家列表中
      return gameStore.playerWithMostChips.some(
        (topPlayer) => topPlayer.player_id === player.player_id,
      )
    },
    isBuyinZero(player) {
      return player.chips_bought === 0
    },
    deletePlayer(player) {
      const gameStore = useGameStore()
      const confirmation = confirm(
        `您确定要玩家 ${player.player_display_name} 吗？此人在这场游戏的日志也会同时删除，此操作不可撤销。`,
      )
      if (confirmation) {
        try {
          gameStore.deletePlayer(player)
        } catch (error) {
          alert('	删除玩家失败，请稍后再试。')
          console.error(error)
        }
      }
    },
    buyIn(player) {
      const gameStore = useGameStore()
      gameStore.buyIn(player)
    },
    setRemaining(player) {
      const gameStore = useGameStore()
      gameStore.setRemaining(player)
    },
    refund(player) {
      const gameStore = useGameStore()
      gameStore.refund(player)
    },
    voiceReport(player) {
      voiceReport(player)
    },
  },
}
</script>

<style scoped>
.player-table :deep(.v-btn) {
  margin-left: 10px;
  margin-top: 10px;
}

.summary-table :deep(.v-table__wrapper tr > th),
.player-table :deep(.v-table__wrapper tr > th) {
  color: black;
  border: 1px solid #999 !important;
  background-color: #e0e0e0 !important;
  font-weight: bold !important;
  font-size: 16px; /* 移除多余分号 */
}

.player-table :deep(.v-table__wrapper td),
.player-table :deep(.v-table__wrapper th) {
  border: 1px solid #ddd !important;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}

/* 偶数行颜色 */
.player-table :deep(.even-row) {
  background-color: #f9f9f9 !important;
}

.player-table :deep(.first-place) {
  background-color: rgb(211, 211, 211) !important;
  color: black;
  font-weight: bold;
}

/* 奇数行颜色 */
.player-table :deep(.odd-row) {
  background-color: #f0f0f0 !important;
}

.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto; /* 小屏幕横向滚动防止换行 */
}
/*button*/
.button-group {
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: nowrap;
}

.mic-button {
  display: flex;
  align-items: center;
}

.mic-button v-btn {
  min-width: 48px;
  width: 48px;
  height: 48px;
}

/* 手机屏幕竖排 */
@media (max-width: 720px) {
  .button-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-grow: 1;
    align-items: stretch;
  }
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-grow: 1;
  }

  .mic-button {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
