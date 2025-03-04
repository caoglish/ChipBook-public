<template>
	<v-btn @click="toggleDevtool" color="primary" class="ma-2">
	  <v-icon icon="mdi-wrench" start></v-icon>
	  toggle devtool
	</v-btn>
  </template>
  
  <script setup>
  import { ref } from 'vue';

  
  const toggleDevtool = () => {
	if (eruda._isInit) {
	  eruda.destroy();

	} else {
	  eruda.init();

	}
  };
  </script>
  