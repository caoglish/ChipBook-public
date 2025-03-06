<!-- PlayerDialog.vue -->
<template>
	<v-dialog v-model="isOpen" max-width="500px" persistent>
		<v-card>
			<v-card-title>
				<span class="headline">{{ editingPlayer ? '编辑玩家' : '添加玩家' }}</span>
			</v-card-title>
			<v-card-text>
				<v-form ref="formRef" >
				<v-text-field v-model="player.player_name" label="玩家固定名称" :readonly="editingPlayer" :rules="nameRules"
					:color="editingPlayer ? 'grey' : 'primary'" :dense="editingPlayer" class="readonly-text-field"
					required></v-text-field>
				<v-checkbox v-if="!editingPlayer" v-model="sameName" label="玩家显示名称与玩家固定名称相同"></v-checkbox>
				<v-text-field v-if="!sameName || editingPlayer" v-model="player.player_display_name" label="玩家显示名称"
					required></v-text-field>
				<v-alert v-if="error" type="error" border="left" elevation="2" class="mt-4">{{ error }}</v-alert>
			</v-form>
			</v-card-text>

			<v-card-actions>
				<v-btn color="blue darken-1" variant="flat" @click="save">保存</v-btn>
				<v-btn color="grey darken-1" variant="outlined" @click="closeDialog">取消</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, defineModel, ref } from "vue";

const props = defineProps({
	player: Object,
	editingPlayer: Boolean,
	
});
const formRef = ref(null);
const emit = defineEmits(["save", "close"]);

const isOpen = defineModel({ default: false });
const sameName = defineModel("sameName", { default: true });
const error = defineModel("error", { default: "" });

const nameRules = [
	value => {
		if (!value ||value.trim() === "") {
						return "玩家名称不能为空或仅包含空格";
				}
				return true;
	},
]
const closeDialog = () => {
	error.value = "";
	isOpen.value = false;
	
};

const save = async () => {
	if (formRef.value) {
		const { valid } = await formRef.value.validate();
		if (!valid) return;
	}

	emit("save", props.player);

};
</script>

<style scoped>
.readonly-text-field .v-input__control {
	color: grey !important;
}
</style>