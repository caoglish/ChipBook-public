<template>
	<div class="about">
		<h1>About</h1>
		<AppVersion />
		<envCard></envCard>
		<LoginUserCard></LoginUserCard>
	</div>
</template>


<script  setup >
import LoginUserCard from '@/components/card/LoginUserCard.vue'
import envCard from '@/components/card/envCard.vue'
import AppVersion from '@/components/card/AppVersionCard.vue';
</script>