export type DatePreset = 'ALL' | 'TODAY' | 'LAST_7' | 'LAST_30' | 'LAST_90'

export type WidgetType = 'KPI' | 'BAR' | 'PIE' | 'TABLE'

export type WidgetBase = {
  id: string
  type: WidgetType
  title: string
}

export type KPIWidgetConfig = WidgetBase & {
  type: 'KPI'
  metric: 'revenue' | 'orders' | 'avgOrderValue'
}

export type BarChartWidgetConfig = WidgetBase & {
  type: 'BAR'
  groupBy: 'status' | 'product' | 'createdAtDay'
  metric: 'revenue' | 'orders'
}

export type PieChartWidgetConfig = WidgetBase & {
  type: 'PIE'
  groupBy: 'status' | 'product'
  metric: 'revenue' | 'orders'
}

export type TableWidgetConfig = WidgetBase & {
  type: 'TABLE'
  columns: Array<
    | 'id'
    | 'customer'
    | 'email'
    | 'product'
    | 'quantity'
    | 'unitPrice'
    | 'totalAmount'
    | 'status'
    | 'createdAt'
  >
  pageSize: number
}

export type WidgetConfig = KPIWidgetConfig | BarChartWidgetConfig | PieChartWidgetConfig | TableWidgetConfig

export type DashboardState = {
  datePreset: DatePreset
  widgets: WidgetConfig[]
  layouts: Record<string, any> // react-grid-layout Layouts (lg/md/sm/xs)
}

