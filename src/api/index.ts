import axios, { type AxiosRequestConfig } from 'axios'

export enum Method {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete',
    PUT = 'put'
}

export interface Todo {
    /** id */
    id: string
    /** 完成状态 */
    done: boolean
    /** 标题 */
    title: string
    /** 内容 */
    content: string
    /** 创建日期 */
    createDate: number
    /** 完成日期 */
    doneDate: number | null
}

export type TodoId = Todo['id']

export interface CustomResponse<T> {
    code: number
    data: T
    msg?: string
}

const baseURL = '/api/todo'
const axiosInstance = axios.create({ baseURL })
async function request<T = any>(axiosRequestConfig: AxiosRequestConfig): Promise<CustomResponse<T>> {
    const response = await axiosInstance(axiosRequestConfig)
    return response.data
}

/** get todo list */
export const todoGet = async () => request<Todo[]>({ method: Method.GET })

/** update todo */
export const todoPut = async (data: Partial<Todo>) => request({ method: Method.PUT, data })

/** delete todo */
export const todoDelete = async (idList: TodoId[]) => request({ method: Method.DELETE, data: { idList } })

/** add todo */
export const todoAdd = async (data: Pick<Todo, 'content' | 'title'>) => request({ method: Method.POST, data })

/** batch set todo done/undone */
export const batchTodoPut = async (data: { idList: TodoId[], state: Partial<Todo> }) => request({ url: 'batch-update', method: Method.PUT, data })
