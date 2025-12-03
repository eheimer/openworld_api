import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('renders the app with header', () => {
    const wrapper = mount(App)
    expect(wrapper.find('header h1').text()).toBe('Openworld API Test Client')
  })

  it('displays navigation menu with all sections', () => {
    const wrapper = mount(App)
    const navButtons = wrapper.findAll('.navigation button')
    
    expect(navButtons).toHaveLength(5)
    expect(navButtons[0].text()).toBe('Authentication')
    expect(navButtons[1].text()).toBe('Games')
    expect(navButtons[2].text()).toBe('Characters')
    expect(navButtons[3].text()).toBe('Battles')
    expect(navButtons[4].text()).toBe('Inventory')
  })

  it('starts with authentication section active', () => {
    const wrapper = mount(App)
    const activeButton = wrapper.find('.navigation button.active')
    
    expect(activeButton.text()).toBe('Authentication')
    expect(wrapper.find('.section h2').text()).toBe('Authentication')
  })

  it('switches sections when navigation button is clicked', async () => {
    const wrapper = mount(App)
    const navButtons = wrapper.findAll('.navigation button')
    
    // Click on Games button
    await navButtons[1].trigger('click')
    
    expect(navButtons[1].classes()).toContain('active')
    expect(wrapper.find('.section h2').text()).toBe('Games')
  })

  it('loads authentication token from localStorage on mount', () => {
    localStorage.setItem('jwt_token', 'test-token')
    localStorage.setItem('player_id', '123')
    
    const wrapper = mount(App)
    
    expect(wrapper.find('.auth-status').exists()).toBe(true)
    expect(wrapper.find('.auth-status').text()).toContain('Player 123')
  })

  it('displays logout button when authenticated', () => {
    localStorage.setItem('jwt_token', 'test-token')
    localStorage.setItem('player_id', '123')
    
    const wrapper = mount(App)
    
    expect(wrapper.find('.auth-status button').exists()).toBe(true)
    expect(wrapper.find('.auth-status button').text()).toBe('Logout')
  })

  it('clears authentication state on logout', async () => {
    localStorage.setItem('jwt_token', 'test-token')
    localStorage.setItem('player_id', '123')
    
    const wrapper = mount(App)
    
    // Click logout button
    await wrapper.find('.auth-status button').trigger('click')
    
    expect(localStorage.getItem('jwt_token')).toBeNull()
    expect(localStorage.getItem('player_id')).toBeNull()
    expect(wrapper.find('.auth-status').exists()).toBe(false)
  })

  it('persists token to localStorage when authToken changes', async () => {
    const wrapper = mount(App)
    
    // Simulate login event
    const loginEvent = new CustomEvent('auth:login', {
      detail: { token: 'new-token', playerId: '456' }
    })
    window.dispatchEvent(loginEvent)
    
    // Wait for watchers to execute
    await wrapper.vm.$nextTick()
    
    expect(localStorage.getItem('jwt_token')).toBe('new-token')
    expect(localStorage.getItem('player_id')).toBe('456')
  })

  it('returns to auth section after logout', async () => {
    localStorage.setItem('jwt_token', 'test-token')
    localStorage.setItem('player_id', '123')
    
    const wrapper = mount(App)
    
    // Navigate to Games section
    const navButtons = wrapper.findAll('.navigation button')
    await navButtons[1].trigger('click')
    expect(wrapper.find('.section h2').text()).toBe('Games')
    
    // Logout
    await wrapper.find('.auth-status button').trigger('click')
    
    // Should return to auth section
    expect(wrapper.find('.section h2').text()).toBe('Authentication')
  })
})
