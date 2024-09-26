<template>
	<div class="about">
		<h1>About</h1>
		<AppVersion />

		<envCard></envCard>

		<LoginUserCard></LoginUserCard>
		

	</div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

import LoginUserCard from '@/components/card/LoginUserCard.vue'
import envCard from '@/components/card/envCard.vue'
import AppVersion from '@/components/card/AppVersionCard.vue';
console.log(process.env);
export default defineComponent({
	name: "testView",
	components: {  LoginUserCard,envCard ,AppVersion},
});
</script>