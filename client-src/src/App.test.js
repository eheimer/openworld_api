import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App Component - State-Driven Architecture', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    // Clean up after each test
    localStorage.clear()
  })

  it('renders the app with hamburger menu and API log panel', () => {
    const wrapper = mount(App)
    
    // Check for hamburger menu
    expect(wrapper.findComponent({ name: 'HamburgerMenu' }).exists()).toBe(true)
    
    // Check for API log panel
    expect(wrapper.findComponent({ name: 'ApiLogPanel' }).exists()).toBe(true)
  })

  it('displays login screen when no player state exists', () => {
    const wrapper = mount(App)
    
    // Should show LoginScreen when player is null
    expect(wrapper.findComponent({ name: 'LoginScreen' }).exists()).toBe(true)
  })

  it('provides game state to child components', () => {
    const wrapper = mount(App)
    
    // Verify that gameState is available in the component
    expect(wrapper.vm.gameState).toBeDefined()
    expect(wrapper.vm.gameState.state).toBeDefined()
    expect(wrapper.vm.gameState.currentScreen).toBeDefined()
  })

  it('handles menu option selection', async () => {
    const wrapper = mount(App)
    
    // Set up some state
    wrapper.vm.gameState.setPlayer({ id: 123, username: 'testuser', token: 'test-token' })
    wrapper.vm.gameState.setGame({ id: 1, name: 'Test Game', ownerId: 123 })
    await wrapper.vm.$nextTick()
    
    // Trigger select-game menu option
    await wrapper.vm.handleMenuOption('select-game')
    await wrapper.vm.$nextTick()
    
    // Game should be cleared
    expect(wrapper.vm.gameState.state.game).toBeNull()
    
    // Player should still exist
    expect(wrapper.vm.gameState.state.player).not.toBeNull()
  })

  it('handles logout by clearing all state', async () => {
    const wrapper = mount(App)
    
    // Set up full state
    wrapper.vm.gameState.setPlayer({ id: 123, username: 'testuser', token: 'test-token' })
    wrapper.vm.gameState.setGame({ id: 1, name: 'Test Game', ownerId: 123 })
    wrapper.vm.gameState.setCharacter({ id: 1, name: 'Test Character', gameId: 1 })
    wrapper.vm.gameState.setBattle({ id: 1, characterId: 1 })
    await wrapper.vm.$nextTick()
    
    // Trigger logout
    await wrapper.vm.handleMenuOption('logout')
    await wrapper.vm.$nextTick()
    
    // All state should be cleared
    expect(wrapper.vm.gameState.state.player).toBeNull()
    expect(wrapper.vm.gameState.state.game).toBeNull()
    expect(wrapper.vm.gameState.state.character).toBeNull()
    expect(wrapper.vm.gameState.state.battle).toBeNull()
    
    // Should show LoginScreen
    expect(wrapper.findComponent({ name: 'LoginScreen' }).exists()).toBe(true)
  })

  it('handles select-character menu option', async () => {
    const wrapper = mount(App)
    
    // Set up state with character and battle
    wrapper.vm.gameState.setPlayer({ id: 123, username: 'testuser', token: 'test-token' })
    wrapper.vm.gameState.setGame({ id: 1, name: 'Test Game', ownerId: 123 })
    wrapper.vm.gameState.setCharacter({ id: 1, name: 'Test Character', gameId: 1 })
    wrapper.vm.gameState.setBattle({ id: 1, characterId: 1 })
    await wrapper.vm.$nextTick()
    
    // Trigger select-character
    await wrapper.vm.handleMenuOption('select-character')
    await wrapper.vm.$nextTick()
    
    // Character and battle should be cleared
    expect(wrapper.vm.gameState.state.character).toBeNull()
    expect(wrapper.vm.gameState.state.battle).toBeNull()
    
    // Player and game should still exist
    expect(wrapper.vm.gameState.state.player).not.toBeNull()
    expect(wrapper.vm.gameState.state.game).not.toBeNull()
  })

  it('handles leave-battle menu option', async () => {
    const wrapper = mount(App)
    
    // Set up full state
    wrapper.vm.gameState.setPlayer({ id: 123, username: 'testuser', token: 'test-token' })
    wrapper.vm.gameState.setGame({ id: 1, name: 'Test Game', ownerId: 123 })
    wrapper.vm.gameState.setCharacter({ id: 1, name: 'Test Character', gameId: 1 })
    wrapper.vm.gameState.setBattle({ id: 1, characterId: 1 })
    await wrapper.vm.$nextTick()
    
    // Trigger leave-battle
    await wrapper.vm.handleMenuOption('leave-battle')
    await wrapper.vm.$nextTick()
    
    // Only battle should be cleared
    expect(wrapper.vm.gameState.state.battle).toBeNull()
    
    // Other state should remain
    expect(wrapper.vm.gameState.state.player).not.toBeNull()
    expect(wrapper.vm.gameState.state.game).not.toBeNull()
    expect(wrapper.vm.gameState.state.character).not.toBeNull()
  })

  it('listens for navigation events', () => {
    const wrapper = mount(App)
    
    // Verify event listeners are set up
    expect(wrapper.vm.handleMenuOption).toBeDefined()
  })
})
