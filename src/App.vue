<template>

  <v-app>
    <v-main>
		<nav>
			<router-link to="/">Home</router-link> |
			<router-link to="/about">About</router-link> | 
			<router-link to="/test">Test</router-link> | 
			<router-link to="/player">Player</router-link>
		</nav>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>


