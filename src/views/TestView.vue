<template>
  <div class="about">
    <h1>This is an test page</h1>

    <TestApp msg="test area"></TestApp>

    <h2>{{rmsg}}</h2>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import TestApp from "@/components/TestApp.vue";

// @ is an alias to /src
import  firebaseDb  from "@/Lib/FirebaseDb";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const db = firebaseDb;

const querySnapshot = await getDocs(collection(db, "posts"));

export default defineComponent({
  name: "testView",
  components: { TestApp },
  data() {
    return {
      rmsg: "start",
    };
  },
  mounted() {
    querySnapshot.forEach((doc) => {
      let post = doc.data();
      console.log(post);
      this.rmsg = post.title;
    });
  },
});
</script>