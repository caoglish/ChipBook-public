<template>
	<div>
		<!-- 添加玩家按钮 -->
		<v-btn to="/Player" color="default" variant="outlined"  prepend-icon="mdi-arrow-left">返回</v-btn>

		<v-container fluid>
			<v-row>
				<!-- 左侧可选玩家列表 -->
				<v-col cols="6">
					<v-card  class="mx-auto text-white"
					color="#26c6da">
						<v-card-title>可选玩家</v-card-title>
						<v-divider></v-divider>
						<v-list>
							<v-list-item v-for="player in forSelectPlayers" :key="player.id"    
								@dblclick="toggleAllowSelect(player)" @click="" border="sm">
								<v-list-item-title class="text-high-emphasis  font-weight-bold opacity-100">{{player.player_display_name  }}</v-list-item-title>
								<v-list-item-subtitle v-if="!isTwoNameEqual(player)" >{{ player.player_name }}</v-list-item-subtitle>
								<template v-slot:append>
									<v-icon v-if='player.star'color= 'orange darken-4' class="pointer">mdi-star</v-icon>
								</template>
							
							</v-list-item>
						</v-list>
					</v-card>
				</v-col>

				<!-- 右侧不可选玩家列表 -->
				<v-col cols="6">
					<v-card class="mx-auto text-white"
					color="#ff0000">
						<v-card-title>不可选玩家</v-card-title>
						<v-divider></v-divider>
						<v-list>
							<v-list-item v-for="player in notForSelectPlayers" :key="player.id"
								@dblclick="toggleAllowSelect(player)"   @click=""  ripple border="sm">
								<v-list-item-title class="mb-1 text-high-emphasis opacity-100">{{player.player_display_name  }}</v-list-item-title>
								<v-list-item-subtitle v-if="!isTwoNameEqual(player)">{{ player.player_name }}</v-list-item-subtitle>
								<template v-slot:append>
									<v-icon v-if='player.star'color= 'orange darken-4' class="pointer">mdi-star</v-icon>
								</template>
							</v-list-item>
						</v-list>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<br/>
		<br/>
		
		

	</div>
</template>

<script>
import { defineComponent } from "vue";
import { usePlayerStore } from "@/store/usePlayerStore";
import {sortByBooleanField } from "@/Lib/Helper.ts";

export default defineComponent({
	name: "PlayerSimplePage",

	setup() {
		const playerStore = usePlayerStore(); // 使用 Pinia store
		return {
			playerStore,
		};
	},
	computed: {
		players() {
			return this.playerStore.players;
		},
		forSelectPlayers() {
			
			return 	sortByBooleanField(this.playerStore.ForSelectPlayerList, 'star')
		},
		notForSelectPlayers() {
			
					
			return 	sortByBooleanField(this.playerStore.NotForSelectPlayerList, 'star')
		},
		filteredHeaders() {
			return this.showIdColumn ? this.headers : this.headers.filter(header => header.key !== 'id');
		}
	},
	methods: {
		async toggleAllowSelect(player) {
			this.playerStore.togglePlayerField(player.id,'allow_select')
		},
		isTwoNameEqual(player){
			return player.player_name==player.player_display_name
		}
	},
	created() {
		this.playerStore.fetchPlayers(); // 在组件创建时，从 Firebase 获取玩家数据
	},
});
</script>

<style>

</style>