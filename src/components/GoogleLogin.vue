<template>
  <div>
    <v-btn v-if="!user" color="primary" @click="signInWithGoogle">使用 Google 登录</v-btn>
    <v-alert
      v-if="loginUserStore.errorMessage"
      type="error"
      dismissible
      @click="clearErrorMessage"
    >{{ loginUserStore.errorMessage }}</v-alert>

    <LoginUserCard></LoginUserCard>
  </div>
</template>

<script setup lang="ts">
import { useLoginUserStore } from "@/store/LoginUserStore";
import { computed } from "vue";
import LoginUserCard from '@/components/LoginUserCard.vue'

// 使用 Pinia store
const loginUserStore = useLoginUserStore();

// 方法直接调用 store 的 action
const signInWithGoogle = () => {
  loginUserStore.signInWithGoogle();
};

const clearErrorMessage = () => {
  loginUserStore.errorMessage = null;
};

const user = computed(() => loginUserStore.user);
</script>

<style scoped>
.v-btn {
  margin: 10px;
}
</style>