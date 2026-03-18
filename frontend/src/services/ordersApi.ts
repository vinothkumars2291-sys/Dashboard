import { api } from './api'

export type OrderStatus = 'NEW' | 'PAID' | 'SHIPPED' | 'CANCELLED'

export type CustomerOrder = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
  product: string
  quantity: number
  unitPrice: number
  totalAmount: number
  status: string
  createdBy: string
  createdAt: string
}

export type OrderUpsert = Omit<CustomerOrder, 'id' | 'totalAmount' | 'createdAt'> & {
  unitPrice: number
  quantity: number
}

export type PageResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export async function listOrders(params?: {
  page?: number
  size?: number
  sort?: string
}): Promise<PageResponse<CustomerOrder>> {
  const res = await api.get<PageResponse<CustomerOrder>>('/orders', { params })
  return res.data
}

export async function getOrder(id: number): Promise<CustomerOrder> {
  const res = await api.get<CustomerOrder>(`/orders/${id}`)
  return res.data
}

export async function createOrder(payload: OrderUpsert): Promise<CustomerOrder> {
  const res = await api.post<CustomerOrder>('/orders', payload)
  return res.data
}

export async function updateOrder(id: number, payload: OrderUpsert): Promise<CustomerOrder> {
  const res = await api.put<CustomerOrder>(`/orders/${id}`, payload)
  return res.data
}

export async function deleteOrder(id: number): Promise<void> {
  await api.delete(`/orders/${id}`)
}

