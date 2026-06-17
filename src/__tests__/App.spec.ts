import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders router outlet', () => {
    const wrapper = mount(App, {
      global: {
        stubs: ['RouterView'],
      },
    })

    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
  })
})
