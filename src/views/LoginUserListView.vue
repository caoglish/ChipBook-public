<template>
	<v-container>
	  <h2 class="mb-4">Login Users</h2>
	  <v-btn color="primary" @click="refreshUsers"  class="mb-6">刷新用户列表</v-btn>
	  
	  
	  <v-data-table 
       v-if="!loading && store.users.length"
      :headers="headers"
      :items="store.users"
      item-value="uid"
      class="elevation-1"
	  :items-per-page="100"
    ></v-data-table>
  
	<p v-else-if="!loading" class="text-muted">暂无用户数据</p>
	<v-progress-linear v-if="loading" indeterminate :height="12" ></v-progress-linear>
	</v-container>
  </template>
  
  <script setup>
  import { onMounted,computed ,ref} from 'vue'
  import { useLoginUserCollectionStore } from '@/store/useLoginUserCollectionStore';

  
  const store = useLoginUserCollectionStore()
  const {  fetchUsers } = store
  const loading = ref(false)

  const headers = computed(() => [
  { title: 'UID', key: 'uid' },
  { title: '显示名', key: 'displayName' },
  { title: '邮箱', key: 'email' },
  { title: '创建时间', key: 'createdAt' },
  { title: '最后登录', key: 'lastLogin' }
]);
  

const refreshUsers = async () => {
  loading.value = true;
  await fetchUsers();
  loading.value = false;
}

  onMounted(refreshUsers)
  

  </script>