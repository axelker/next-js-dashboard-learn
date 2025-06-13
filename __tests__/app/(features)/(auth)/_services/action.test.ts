import { sigIn, sigUp } from '@/app/(features)/(auth)/_services/action'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

// Mock auth client
jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signInEmail: jest.fn(),
      signUpEmail: jest.fn(),
    },
  },
}))

describe('Auth Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sigIn', () => {
    it('should handle valid login credentials', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      await sigIn({}, formData)
      expect(auth.api.signInEmail).toHaveBeenCalledWith({
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      })
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle invalid form data', async () => {
      const formData = new FormData()
      formData.append('email', 'invalid-email')
      formData.append('password', '')

      const result = await sigIn({}, formData)
      expect(result.errors).toBeDefined()
      expect(result.values).toEqual({
        email: 'invalid-email',
        password: '',
      })
    })

    it('should handle auth errors', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrong-password')

      const error = new Error('Invalid credentials')
      ;(auth.api.signInEmail as jest.Mock).mockRejectedValueOnce(error)

      const result = await sigIn({}, formData)
      expect(result.message).toBe('Invalid credentials')
      expect(result.values).toEqual({
        email: 'test@example.com',
        password: 'wrong-password',
      })
    })
  })

  describe('sigUp', () => {
    it('should handle valid signup credentials', async () => {
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      await sigUp({}, formData)
      expect(auth.api.signUpEmail).toHaveBeenCalledWith({
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      })
      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle invalid form data', async () => {
      const formData = new FormData()
      formData.append('name', '')
      formData.append('email', 'invalid-email')
      formData.append('password', '123')

      const result = await sigUp({}, formData)
      expect(result.errors).toBeDefined()
      expect(result.values).toEqual({
        name: '',
        email: 'invalid-email',
        password: '123',
      })
    })

    it('should handle auth errors', async () => {
      const formData = new FormData()
      formData.append('name', 'Test User')
      formData.append('email', 'existing@example.com')
      formData.append('password', 'password123')

      const error = new Error('Email already exists')
      ;(auth.api.signUpEmail as jest.Mock).mockRejectedValueOnce(error)

      const result = await sigUp({}, formData)
      expect(result.message).toBe('Email already exists')
      expect(result.values).toEqual({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      })
    })
  })
}) 