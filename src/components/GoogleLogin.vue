<template>
  <div>
    <v-btn color="primary" @click="signInWithGoogle">使用 Google 登录</v-btn>
    <v-alert v-if="errorMessage" type="error" dismissible @click="errorMessage = null">
      {{ errorMessage }}
    </v-alert>
  </div>
</template>

<script>
import { firebaseAuth } from "@/Lib/FirebaseDb";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default {
  name: "GoogleLogin",
  data() {
    return {
      errorMessage: null,
     
    };
  },
  methods: {
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(firebaseAuth, provider);
        const user = result.user;
		

        if (user.email.includes("cao")) {
          // 登录成功且电子邮件地址在允许的列表中
          console.log("登录成功:", user.email);
          this.$router.push({ name: "GameManagement" }); // 登录成功后重定向到主页或其他页面
        } else {
          // 用户的电子邮件地址不被允许
          this.errorMessage = "您没有权限访问此应用。";
          await firebaseAuth.signOut(); // 退出当前用户
        }
      } catch (error) {
        this.errorMessage = "登录失败，请重试。";
        console.error("Error during Google sign-in:", error);
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin: 10px;
}
</style>