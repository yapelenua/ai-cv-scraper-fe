import axios from 'axios'
import { parsePossiblyStringifiedJson } from '@/helpers/json'
import type { MatchResult } from '@/types/index'

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 120_000,
})

export async function analyzeCv(
  jobText: string,
  cvFile: File,
  options: { isText: boolean; isLink: boolean }
): Promise<MatchResult> {
  const form = new FormData()
  form.append(options.isText ? 'job_text' : 'job_link', jobText)
  form.append('cv_file', cvFile)

  form.append('byText', String(options.isText))
  form.append('byLink', String(options.isLink))

  const response = await client.post('/analyze', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformResponse: (data) => data,
  })

  return parsePossiblyStringifiedJson<MatchResult>(response.data)
}
