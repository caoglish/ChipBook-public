<template>
  <v-col cols="12" md="2">
    <v-card variant="outlined" title="Version">
      <v-card-text> Version: {{ version }} </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'AppVersionCard',
  data() {
    return {
      version: import.meta.env.VITE_APP_VERSION || '未定义',
    }
  },
}
</script>

<style>
.app-version {
  font-size: 14px;
  color: #666;
}
</style>
