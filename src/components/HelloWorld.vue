<template>
  <v-container>
	<h1>Chip Book</h1>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import  firebaseDb  from "@/Lib/FirebaseDb";

const db = firebaseDb;

export default defineComponent({
  name: 'HelloWorld',

  data () {
    return {
     
      
    }
  },
   methods: {

   },
   created() {
    // 组件创建时获取玩家信息
    
  },
})
</script>
