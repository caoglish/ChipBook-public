
<template>
	<div>
	<!-- 显示玩家列表的表格 -->
	<h3>{{title}}</h3>
	<v-data-table :headers="headers" :items="items" :items-per-page="50">
		<template #item.actions="{ item }">
			<v-btn color="primary" icon @click="editPlayer(item)" size="small">
				<v-icon>mdi-pencil</v-icon>
			</v-btn>
			<v-btn color="secondary" icon @click="toggleAllowSelect(item)" size="small">
				<v-icon>mdi-{{icon}}</v-icon>
			</v-btn>
			<v-btn color="error" icon @click="deletePlayer(item)" size="small">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
		</template>
	</v-data-table>
</div>

</template>

<script>
//example of emit object to the parent component
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
	methods: {
        editPlayer(player) {
            this.$emit("edit-player", player);
        },
        toggleAllowSelect(player) {
            this.$emit("toggle-allow-select", player);
        },
        deletePlayer(player) {
            this.$emit("delete-player", player);
        }
	}

};
</script>

<!-- <style>
.player-table .v-table__wrapper td,
.player-table .v-table__wrapper th {
    border: 1px solid #ddd !important;
    padding: 8px;
    text-align: center;
    vertical-align: middle;
    background-color: #f9f9f9;
}
</style> -->