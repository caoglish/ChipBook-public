<template>
	<v-container>
	  <h2 class="mb-4">Login Users</h2>
	  <v-btn color="primary" @click="fetchUsers">刷新用户列表</v-btn>
	  
	  <v-table v-if="store.users.length">
		<thead>
		  <tr>
			<th>UID</th>
			<th>显示名</th>
			<th>邮箱</th>
			<th>创建时间</th>
			<th>最后登录</th>
		  </tr>
		</thead>
		<tbody>
		  <tr v-for="user in store.users" :key="user.id">
			<td>{{ user.uid }}</td>
			<td>{{ user.displayName }}</td>
			<td>{{ user.email }}</td>
			<td>{{ user.createdAt }}</td>
			<td>{{ user.lastLogin }}</td>
		  </tr>
		</tbody>
	  </v-table>
  
	  <p v-else class="text-muted">暂无用户数据</p>
	</v-container>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useLoginUserCollectionStore } from '@/store/useLoginUserCollectionStore';
  import { dateDisplay, firebaseTimestamp } from "@/Lib/DateHelper";
  
  const store = useLoginUserCollectionStore()
  const {  fetchUsers } = store
  
  onMounted(fetchUsers)
  

  </script>