import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'





describe('HelloWorld.vue', () => {



	it('Testing HellowWorld', () => {
		const msg = 'Chip Book'
		const wrapper = shallowMount(HelloWorld)
		expect(wrapper.text()).toMatch(msg)
	})
})
