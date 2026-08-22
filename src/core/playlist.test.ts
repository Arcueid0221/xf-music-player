import { describe, it, expect } from 'vitest'
import { nextIndex, prevIndex, shuffle } from './playlist'

describe('nextIndex 下一首', () => {
  it('顺序模式：返回下一首', () => {
    expect(nextIndex(3, 0, 'order')).toBe(1)
  })

  it('顺序模式：最后一首切回第一首（循环）', () => {
    expect(nextIndex(3, 2, 'order')).toBe(0)
  })

  it('单曲循环模式：手动切歌也切下一首', () => {
    expect(nextIndex(3, 1, 'single')).toBe(2)
  })

  it('只有一首歌时返回 0', () => {
    expect(nextIndex(1, 0, 'single')).toBe(0)
  })

  it('空歌单时返回 0', () => {
    expect(nextIndex(0, 0, 'order')).toBe(0)
  })

  it('越界的 cur 会被归一化', () => {
    expect(nextIndex(3, -1, 'order')).toBe(1)
    expect(nextIndex(3, 5, 'order')).toBe(0)
  })
})

describe('prevIndex 上一首', () => {
  it('第一首切回最后一首（循环）', () => {
    expect(prevIndex(3, 0, 'order')).toBe(2)
  })

  it('正常退一首', () => {
    expect(prevIndex(3, 2, 'single')).toBe(1)
    expect(prevIndex(3, 1, 'order')).toBe(0)
  })

  it('只有一首歌时返回 0', () => {
    expect(prevIndex(1, 0, 'order')).toBe(0)
  })
})

describe('shuffle 随机', () => {
  it('永远不等于当前索引，且范围合法', () => {
    for (let i = 0; i < 100; i++) {
      const r = shuffle(3, 1)
      expect(r).not.toBe(1)
      expect([0, 2]).toContain(r)
    }
  })
})
