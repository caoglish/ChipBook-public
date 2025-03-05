<template>
	<v-container>
	  <h2 class="mb-4">Login Users</h2>
	  <v-btn color="primary" @click="fetchUsers">刷新用户列表</v-btn>
	  
	  <v-data-table 
      v-if="store.users.length"
      :headers="headers"
      :items="store.users"
      item-value="uid"
      class="elevation-1"
	  :items-per-page="100"
    >
    
    </v-data-table>
  
	  <p v-else class="text-muted">暂无用户数据</p>
	</v-container>
  </template>
  
  <script setup>
  import { onMounted,computed } from 'vue'
  import { useLoginUserCollectionStore } from '@/store/useLoginUserCollectionStore';

  
  const store = useLoginUserCollectionStore()
  const {  fetchUsers } = store


  const headers = computed(() => [
  { title: 'UID', key: 'uid' },
  { title: '显示名', key: 'displayName' },
  { title: '邮箱', key: 'email' },
  { title: '创建时间', key: 'createdAt' },
  { title: '最后登录', key: 'lastLogin' }
]);
  
  onMounted(fetchUsers)
  

  </script>