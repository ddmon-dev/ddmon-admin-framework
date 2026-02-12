import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

// Next.js 모킹
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/test'),
  useRouter: vi.fn(() => ({ push: vi.fn(), back: vi.fn() })),
}))
