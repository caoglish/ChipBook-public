<template>

	<h1>{{ msg }}</h1>

</template>


<script lang="ts">
import { defineComponent } from 'vue';
//import HelloWorld from '@/components/HelloWorld.vue'; 

export default defineComponent({
	name: "testApp",
	props: {
		msg: String,
	},
});
</script>