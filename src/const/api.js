import { devApi, prodApi } from './config'

export const apiBase = process.env.NODE_ENV !== 'production' ? devApi : prodApi
