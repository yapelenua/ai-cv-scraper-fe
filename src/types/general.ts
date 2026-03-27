export type Status = 'success' | 'error'

export interface MatchResult {
  status: Status
  error: string | null
  candidate_summary: string | null
  match_with_job: string | null
  key_matching_points: string[]
  gaps_risks: string[]
  interview_questions: string[]
  final_recommendation: string | null
}
