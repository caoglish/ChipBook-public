import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Vue from "vue";
import router from "@/router";
import vuetify from '@/plugins/vuetify'




describe('HelloWorld.vue', () => {

	
  
  it('renders props.msg when passed', () => {
    const msg = 'Chip Book'
    const wrapper = shallowMount(HelloWorld,{
        global: {
          plugins: [vuetify],
        },
      })
    expect(wrapper.text()).toMatch(msg)
  })
})
