import React from 'react'

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
}))

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => {},
}))

jest.mock('react-syntax-highlighter', () => ({
  Prism: {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => React.createElement('pre', null, children),
  },
}))

