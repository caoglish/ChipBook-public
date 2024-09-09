<template>
  <v-container>
	<v-data-table :items="test">
	</v-data-table>

	<v-data-table :items="players">
<template v-slot:[`item.actions`]="{ item }">
        <v-btn icon @click="editPlayer(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deletePlayer(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
	</v-data-table>

    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify 3 Beta
        </h1>


        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <a
            href="https://community.vuetifyjs.com"
            target="_blank"
          >Discord Community</a>
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-5">
          What's next?
        </h2>

        <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-5">
          Important Links
        </h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-5">
          Ecosystem
        </h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
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
      test:[{id:"001fj",name:'hello,world'}],
      players:[{}],
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader/tree/next',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify/tree/next',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Roadmap',
          href: 'https://vuetifyjs.com/en/introduction/roadmap/',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }
  },
   methods: {
    editPlayer(item:string) {
      // 编辑现有玩家

    },
    async deletePlayer(playerId:string) {
      // 从Firebase删除玩家
      const playerRef = doc(db, 'players', playerId);
      await deleteDoc(playerRef);
      this.fetchPlayers();
    },
	async fetchPlayers() {
      // 从Firebase获取所有玩家信息
      const playersCol = collection(db, 'players');
      const playerSnapshot = await getDocs(playersCol);
      this.players = playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(JSON.parse(JSON.stringify(this.players)));
		// this.players=[{name:'test'}]
		// this.players=[
		// 				{
		// 				name: 'African Elephant',
		// 				species: 'Loxodonta africana',
		// 				diet: 'Herbivore',
		// 				habitat: 'Savanna, Forests',
		// 				},
		// 				// ... more items
		// 			]
	},
   },
   created() {
    // 组件创建时获取玩家信息
    this.fetchPlayers();
  },
})
</script>
