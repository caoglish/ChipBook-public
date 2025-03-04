<template>
	<div class="about">
		<h1>About</h1>
		<AppVersion />
		<envCard></envCard>
		<LoginUserCard></LoginUserCard>
		<DevtoolToggleButton />
		<v-btn to="/loginUserList"  class="nav-link" color="primary">打开登陆过用户列表</v-btn>

		<VersionInfoCard />
		
				
	</div>
</template>


<script setup>
import LoginUserCard from '@/components/card/LoginUserCard.vue'
import envCard from '@/components/card/envCard.vue'
import AppVersion from '@/components/card/AppVersionCard.vue';
import VersionInfoCard from '@/components/card/VersionInfoCard.vue'
import DevtoolToggleButton from '@/components/common/DevtoolToggleButton.vue' 


const activeDevtool = () => {
	if(eruda._isInit) {
		eruda.destroy();
	} else {
		eruda.init();
	}
	
}
</script>