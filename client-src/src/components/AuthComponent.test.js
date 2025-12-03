import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthComponent from './AuthComponent.vue'
import apiService from '../services/apiService.js'

// Mock the API service
vi.mock('../services/apiService.js', () => ({
  default: {
    post: vi.fn()
  }
}))

describe('AuthComponent', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear all mocks
    vi.clearAllMocks()
  })

  it('renders login and registration forms', () => {
    const wrapper = mount(AuthComponent)
    
    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).toContain('Register')
    expect(wrapper.find('#login-username').exists()).toBe(true)
    expect(wrapper.find('#login-password').exists()).toBe(true)
    expect(wrapper.find('#register-username').exists()).toBe(true)
    expect(wrapper.find('#register-email').exists()).toBe(true)
    expect(wrapper.find('#register-password').exists()).toBe(true)
  })

  it('handles successful login', async () => {
    const mockResponse = {
      data: {
        token: 'test-jwt-token',
        player: 123
      }
    }
    apiService.post.mockResolvedValue(mockResponse)

    const wrapper = mount(AuthComponent)
    
    // Fill in login form
    await wrapper.find('#login-username').setValue('testuser')
    await wrapper.find('#login-password').setValue('testpass')
    
    // Submit form
    await wrapper.find('.auth-form').trigger('submit.prevent')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    
    // Verify API was called correctly
    expect(apiService.post).toHaveBeenCalledWith('/auth/login', {
      username: 'testuser',
      password: 'testpass'
    })
    
    // Verify token and player ID were stored
    expect(localStorage.getItem('jwt_token')).toBe('test-jwt-token')
    expect(localStorage.getItem('player_id')).toBe('123')
  })

  it('displays error message on failed login', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    }
    apiService.post.mockRejectedValue(mockError)

    const wrapper = mount(AuthComponent)
    
    // Fill in login form
    await wrapper.find('#login-username').setValue('testuser')
    await wrapper.find('#login-password').setValue('wrongpass')
    
    // Submit form
    await wrapper.find('.auth-form').trigger('submit.prevent')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Verify error message is displayed
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Invalid credentials')
  })

  it('handles successful registration', async () => {
    const mockResponse = {
      data: {
        id: 456,
        username: 'newuser',
        email: 'new@example.com'
      }
    }
    apiService.post.mockResolvedValue(mockResponse)

    const wrapper = mount(AuthComponent)
    
    // Fill in registration form
    const forms = wrapper.findAll('.auth-form')
    await wrapper.find('#register-username').setValue('newuser')
    await wrapper.find('#register-email').setValue('new@example.com')
    await wrapper.find('#register-password').setValue('newpass')
    
    // Submit registration form
    await forms[1].trigger('submit.prevent')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Verify API was called correctly
    expect(apiService.post).toHaveBeenCalledWith('/auth/register', {
      username: 'newuser',
      email: 'new@example.com',
      password: 'newpass'
    })
    
    // Verify success message is displayed
    expect(wrapper.find('.success-message').exists()).toBe(true)
    expect(wrapper.find('.success-message').text()).toContain('Registration successful')
  })

  it('displays error message on failed registration', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Username already in use'
        }
      }
    }
    apiService.post.mockRejectedValue(mockError)

    const wrapper = mount(AuthComponent)
    
    // Fill in registration form
    const forms = wrapper.findAll('.auth-form')
    await wrapper.find('#register-username').setValue('existinguser')
    await wrapper.find('#register-email').setValue('test@example.com')
    await wrapper.find('#register-password').setValue('testpass')
    
    // Submit registration form
    await forms[1].trigger('submit.prevent')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Verify error message is displayed
    const errorMessages = wrapper.findAll('.error-message')
    expect(errorMessages.length).toBeGreaterThan(0)
    expect(errorMessages[errorMessages.length - 1].text()).toBe('Username already in use')
  })

  it('disables forms while loading', async () => {
    // Mock a slow API call
    apiService.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    const wrapper = mount(AuthComponent)
    
    // Fill in login form
    await wrapper.find('#login-username').setValue('testuser')
    await wrapper.find('#login-password').setValue('testpass')
    
    // Submit form
    const form = wrapper.find('.auth-form')
    await form.trigger('submit.prevent')
    
    // Check that inputs are disabled during loading
    await wrapper.vm.$nextTick()
    expect(wrapper.find('#login-username').element.disabled).toBe(true)
    expect(wrapper.find('#login-password').element.disabled).toBe(true)
  })

  it('clears login form after successful login', async () => {
    const mockResponse = {
      data: {
        token: 'test-jwt-token',
        player: 123
      }
    }
    apiService.post.mockResolvedValue(mockResponse)

    const wrapper = mount(AuthComponent)
    
    // Fill in login form
    await wrapper.find('#login-username').setValue('testuser')
    await wrapper.find('#login-password').setValue('testpass')
    
    // Submit form
    await wrapper.find('.auth-form').trigger('submit.prevent')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Verify form is cleared
    expect(wrapper.find('#login-username').element.value).toBe('')
    expect(wrapper.find('#login-password').element.value).toBe('')
  })

  it('clears registration form after successful registration', async () => {
    const mockResponse = {
      data: {
        id: 456,
        username: 'newuser',
        email: 'new@example.com'
      }
    }
    apiService.post.mockResolvedValue(mockResponse)

    const wrapper = mount(AuthComponent)
    
    // Fill in registration form
    await wrapper.find('#register-username').setValue('newuser')
    await wrapper.find('#register-email').setValue('new@example.com')
    await wrapper.find('#register-password').setValue('newpass')
    
    // Submit registration form
    const forms = wrapper.findAll('.auth-form')
    await forms[1].trigger('submit.prevent')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Verify form is cleared
    expect(wrapper.find('#register-username').element.value).toBe('')
    expect(wrapper.find('#register-email').element.value).toBe('')
    expect(wrapper.find('#register-password').element.value).toBe('')
  })
})
