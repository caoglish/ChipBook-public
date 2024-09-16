<template>
  <v-app>
    <v-main>
      <nav>
        <!-- 显示 Home 链接，始终可见 -->
        <router-link to="/">Home</router-link> |
        
        <!-- 仅在用户已登录时显示以下链接 -->
        <template v-if="isAuthenticated">
          <router-link to="/game">Game</router-link> |
          <router-link to="/history">History</router-link> |
          <router-link to="/player">Player</router-link> |
          <router-link to="/about">About</router-link>
        </template>
      </nav>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed,onMounted } from "vue";
import { useLoginUserStore } from "@/store/LoginUserStore";// 导入 Pinia store

export default defineComponent({
  name: "App",

  setup() {
    const loginUserStore = useLoginUserStore(); // 获取登录用户 store

    // 计算属性，检查用户是否已登录
    const isAuthenticated = computed(() => !!loginUserStore.user);

	onMounted(() => {
      loginUserStore.checkAuthState(); // 检查用户登录状态
    });

    return {
      isAuthenticated,
	  //loginUserStore
    };
  },
});
</script>
