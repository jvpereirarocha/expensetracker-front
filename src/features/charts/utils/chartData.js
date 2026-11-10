// Cores validadas para daltonismo (CVD) e contraste sobre fundo claro.
export const INCOME_COLOR = '#059669' // emerald-600
export const EXPENSE_COLOR = '#ef4444' // red-500

// Paleta categórica de 12 cores. A ordem foi validada para daltonismo (pares vizinhos).
// Cada categoria recebe um slot fixo pela ordem de criação (categoryId).
export const CATEGORY_COLORS = [
  '#2a78d6',
  '#eb6834',
  '#1baf7a',
  '#eda100',
  '#e87ba4',
  '#008300',
  '#6250d6',
  '#e34948',
  '#14a3b8',
  '#a0662a',
  '#a83279',
  '#5c8a1f',
]
// Cinza para fatias que não são uma categoria real.
export const NEUTRAL_COLOR = '#94a3b8' // slate-400
export const OTHERS_LABEL = 'Outros'
export const UNCATEGORIZED_LABEL = 'Sem categoria'

export const MONTH_SHORT_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

export const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export const formatBRL = (value) => currencyFormatter.format(Number(value) || 0)

const round2 = (value) => Math.round(value * 100) / 100

/**
 * Converte a resposta de /dashboards/monthly em dados do Chart.js (barras agrupadas).
 * Meses ausentes viram 0.
 */
export function buildMonthlyChartData(months = []) {
  const byMonth = new Map(months.map((m) => [m.month, m]))
  const income = []
  const expense = []

  for (let month = 1; month <= 12; month++) {
    income.push(byMonth.get(month)?.income ?? 0)
    expense.push(byMonth.get(month)?.expense ?? 0)
  }

  return {
    labels: MONTH_SHORT_LABELS,
    datasets: [
      { label: 'Receitas', data: income, backgroundColor: INCOME_COLOR },
      { label: 'Despesas', data: expense, backgroundColor: EXPENSE_COLOR },
    ],
  }
}

const normalizeName = (name) =>
  String(name ?? '')
    .trim()
    .toLowerCase()

/**
 * Mapa nome da categoria (minúsculo) -> cor, estável entre meses.
 * Ordena por categoryId (ordem de criação); acima de 12 categorias as cores se repetem.
 */
export function buildCategoryColorMap(categories = []) {
  const sorted = [...categories].sort((a, b) => a.categoryId - b.categoryId)
  return new Map(
    sorted.map((category, index) => [
      normalizeName(category.name),
      CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    ]),
  )
}

// Cor determinística para categorias fora da lista carregada (ex.: lista ainda não buscada).
const fallbackColor = (name) => {
  let hash = 0
  for (const char of normalizeName(name)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length]
}

const colorFor = (name, colorMap) => {
  if (name === OTHERS_LABEL || name === UNCATEGORIZED_LABEL) return NEUTRAL_COLOR
  return colorMap.get(normalizeName(name)) ?? fallbackColor(name)
}

/**
 * Converte a lista de /dashboards/expenses-by-category em fatias coloridas.
 * A API já ordena do maior para o menor e calcula os percentuais.
 * A cor de cada fatia vem de `colorMap` (fixa por categoria).
 * Acima de 12 fatias, as excedentes são agrupadas em "Outros".
 */
export function buildCategoryChartData(categories = [], colorMap = new Map()) {
  let items = categories

  if (categories.length > CATEGORY_COLORS.length) {
    const kept = categories.slice(0, CATEGORY_COLORS.length - 1)
    const rest = categories.slice(CATEGORY_COLORS.length - 1)
    items = [
      ...kept,
      {
        category: OTHERS_LABEL,
        amount: round2(rest.reduce((sum, c) => sum + c.amount, 0)),
        percentage: round2(rest.reduce((sum, c) => sum + c.percentage, 0)),
      },
    ]
  }

  const slices = items.map((item) => ({ ...item, color: colorFor(item.category, colorMap) }))

  return {
    slices,
    chartData: {
      labels: slices.map((s) => s.category),
      datasets: [
        {
          data: slices.map((s) => s.amount),
          backgroundColor: slices.map((s) => s.color),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    },
  }
}
