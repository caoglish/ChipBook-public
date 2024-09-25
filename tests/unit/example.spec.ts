import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import { mount } from '@vue/test-utils';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';

const vuetify = createVuetify();

describe('HelloWorld.vue', () => {



	it('Testing HellowWorld', () => {
		const wrapper = mount(HelloWorld, {
			global: {
				plugins: [vuetify],
			},
		});
		const msg = 'Chip Book'
		expect(wrapper.exists()).toBe(true);
  
		// const wrapper = shallowMount(HelloWorld)
		expect(wrapper.text()).toMatch(msg)
	})
})
