<template>
	<div>
		<!-- 显示玩家列表的表格 -->
		<h3>{{ title }}</h3>
		<v-data-table :headers="headers" :items="sortedItems" :items-per-page="50">
			<template #item.actions="{ item }">
				<v-icon :color="item.star ? 'orange darken-4' : 'grey lighten-1'" class="pointer"
					@click="toggleStar(item)">
					{{ item.star ? 'mdi-star' : 'mdi-star-outline' }}
				</v-icon>
				<v-btn color="primary" icon @click="editPlayer(item)" size="small">
					<v-icon>mdi-pencil</v-icon>
				</v-btn>
				<v-btn color="secondary" icon @click="toggleAllowSelect(item)" size="small">
					<v-icon>mdi-{{ icon }}</v-icon>
				</v-btn>
				<v-btn color="error" icon @click="deletePlayer(item)" size="small">
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</template>
		</v-data-table>
	</div>

</template>

<script>
import {sortByBooleanField } from "@/Lib/Helper.ts";
export default {
	name: "PlayerTable",
	props: {
		title: {
			type: String,
			required: true,
		},
		headers: {
			type: Array,
			required: true,
		},
		items: {
			type: Array,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},

	},
	computed: {
		sortedItems(){	
			
			return sortByBooleanField(this.items, 'star');
		}// computed properties
	},
	methods: {
		editPlayer(player) {
			this.$emit("edit-player", player);
		},
		toggleAllowSelect(player) {
			this.$emit("toggle-allow-select", player);
		},
		deletePlayer(player) {
			this.$emit("delete-player", player);
		},
		toggleStar(player) {
			this.$emit("toggle-star", player);
		}

	}

};
</script>
