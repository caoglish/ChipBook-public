<template>
	<div class="about">
		<h1>About</h1>

		<envCard></envCard>
		<LoginUserCard></LoginUserCard>
		

	</div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

import LoginUserCard from '@/components/LoginUserCard.vue'
import envCard from '@/components/envCard.vue'

export default defineComponent({
	name: "testView",
	components: {  LoginUserCard,envCard },
});
</script>