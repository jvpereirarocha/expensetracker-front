import { describe, it, expect } from 'vitest'
import {
  buildMonthlyChartData,
  buildCategoryChartData,
  buildCategoryColorMap,
  CATEGORY_COLORS,
  NEUTRAL_COLOR,
  INCOME_COLOR,
  EXPENSE_COLOR,
} from '@/features/charts/utils/chartData'

describe('buildMonthlyChartData', () => {
  it('builds 12 labels and income/expense datasets in month order', () => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: 12 - i,
      income: (12 - i) * 100,
      expense: (12 - i) * 10,
    }))

    const data = buildMonthlyChartData(months)

    expect(data.labels).toHaveLength(12)
    expect(data.labels[0]).toBe('Jan')
    expect(data.labels[11]).toBe('Dez')
    expect(data.datasets[0].label).toBe('Receitas')
    expect(data.datasets[0].backgroundColor).toBe(INCOME_COLOR)
    expect(data.datasets[0].data[0]).toBe(100)
    expect(data.datasets[1].label).toBe('Despesas')
    expect(data.datasets[1].backgroundColor).toBe(EXPENSE_COLOR)
    expect(data.datasets[1].data[11]).toBe(120)
  })

  it('fills missing months with 0', () => {
    const data = buildMonthlyChartData([{ month: 3, income: 50, expense: 20 }])
    expect(data.datasets[0].data).toEqual([0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  })
})

describe('buildCategoryColorMap', () => {
  it('assigns colors by categoryId order, independent of list order', () => {
    const map = buildCategoryColorMap([
      { categoryId: 7, name: 'Saúde' },
      { categoryId: 2, name: 'Moradia' },
    ])

    expect(map.get('moradia')).toBe(CATEGORY_COLORS[0])
    expect(map.get('saúde')).toBe(CATEGORY_COLORS[1])
  })

  it('wraps around after the last palette slot', () => {
    const categories = Array.from({ length: CATEGORY_COLORS.length + 1 }, (_, i) => ({
      categoryId: i + 1,
      name: `C${i + 1}`,
    }))

    const map = buildCategoryColorMap(categories)

    expect(map.get(`c${CATEGORY_COLORS.length + 1}`)).toBe(CATEGORY_COLORS[0])
  })
})

describe('buildCategoryChartData', () => {
  const colorMap = buildCategoryColorMap([
    { categoryId: 1, name: 'Moradia' },
    { categoryId: 2, name: 'Saúde' },
    { categoryId: 3, name: 'Lazer' },
  ])

  it('returns empty slices for no categories', () => {
    const { slices } = buildCategoryChartData([], colorMap)
    expect(slices).toEqual([])
  })

  it('keeps each category color fixed regardless of ranking', () => {
    const { slices, chartData } = buildCategoryChartData(
      [
        { category: 'Lazer', amount: 600, percentage: 60 },
        { category: 'Moradia', amount: 400, percentage: 40 },
      ],
      colorMap,
    )

    expect(slices.map((s) => s.color)).toEqual([CATEGORY_COLORS[2], CATEGORY_COLORS[0]])
    expect(chartData.labels).toEqual(['Lazer', 'Moradia'])
    expect(chartData.datasets[0].data).toEqual([600, 400])
    expect(chartData.datasets[0].backgroundColor).toEqual([CATEGORY_COLORS[2], CATEGORY_COLORS[0]])
  })

  it('matches category names case-insensitively', () => {
    const { slices } = buildCategoryChartData(
      [{ category: 'SAÚDE', amount: 10, percentage: 100 }],
      colorMap,
    )
    expect(slices[0].color).toBe(CATEGORY_COLORS[1])
  })

  it('uses the neutral color for "Sem categoria"', () => {
    const { slices } = buildCategoryChartData(
      [{ category: 'Sem categoria', amount: 10, percentage: 100 }],
      colorMap,
    )
    expect(slices[0].color).toBe(NEUTRAL_COLOR)
  })

  it('gives unknown categories a stable palette color', () => {
    const data = [{ category: 'Desconhecida', amount: 10, percentage: 100 }]
    const first = buildCategoryChartData(data, new Map()).slices[0].color
    const second = buildCategoryChartData(data, new Map()).slices[0].color

    expect(CATEGORY_COLORS).toContain(first)
    expect(second).toBe(first)
  })

  it('folds slices beyond the palette size into a neutral "Outros"', () => {
    const categories = Array.from({ length: CATEGORY_COLORS.length + 2 }, (_, i) => ({
      category: `C${i + 1}`,
      amount: 10,
      percentage: 5,
    }))

    const { slices } = buildCategoryChartData(categories, new Map())

    expect(slices).toHaveLength(CATEGORY_COLORS.length)
    const others = slices[slices.length - 1]
    expect(others.category).toBe('Outros')
    expect(others.amount).toBe(30)
    expect(others.percentage).toBe(15)
    expect(others.color).toBe(NEUTRAL_COLOR)
  })
})
