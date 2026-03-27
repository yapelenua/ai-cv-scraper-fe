<template>
  <div class="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6">

    <!-- ── Header row ───────────────────────────────────────── -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span
          :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest',
            statusType === 'success' && 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
            statusType === 'danger'  && 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
          ]"
        >
          {{ statusLabel }}
        </span>
        <span class="text-xs text-slate-500">CVComparing result</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
          Match: <span class="font-semibold text-slate-200">{{ matchLabel }}</span>
        </span>
        <span class="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
          Rec: <span class="font-semibold text-slate-200">{{ recommendationLabel }}</span>
        </span>
      </div>
    </div>

    <!-- ── Error ─────────────────────────────────────────────── -->
    <ElAlert
      v-if="data.error"
      :title="data.error"
      type="error"
      show-icon
      :closable="false"
    />

    <!-- ── Empty ─────────────────────────────────────────────── -->
    <div v-if="!hasAnyDetails" class="py-10 text-center text-sm text-slate-600">
      No details available
    </div>

    <div v-else class="flex flex-col gap-4">

      <!-- ── Candidate summary ──────────────────────────────── -->
      <div
        v-if="data.candidate_summary"
        class="rounded-xl border-l-2 border-indigo-400 bg-indigo-500/[0.06] px-4 py-4"
      >
        <div class="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
          Candidate summary
        </div>
        <p class="whitespace-pre-line text-sm leading-relaxed text-slate-300">
          {{ data.candidate_summary }}
        </p>
      </div>

      <!-- ── Score row ──────────────────────────────────────── -->
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div class="text-xs font-bold uppercase tracking-widest text-slate-500">Match</div>
          <div class="mt-1.5 font-display text-xl font-bold text-slate-100">{{ matchLabel }}</div>
        </div>
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div class="text-xs font-bold uppercase tracking-widest text-slate-500">Recommendation</div>
          <div class="mt-1.5 font-display text-xl font-bold text-slate-100">{{ recommendationLabel }}</div>
        </div>
      </div>

      <!-- ── Three lists ────────────────────────────────────── -->
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">

        <!-- Key matching points -->
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Matches</span>
            <span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/25">
              {{ data.key_matching_points.length }}
            </span>
          </div>
          <div v-if="data.key_matching_points.length" class="flex flex-col gap-2">
            <div
              v-for="(point, idx) in data.key_matching_points"
              :key="`match-${idx}`"
              class="flex items-start gap-2 rounded-lg bg-emerald-500/[0.07] px-3 py-2 text-xs leading-relaxed text-emerald-300 ring-1 ring-emerald-500/10"
            >
              <span class="mt-px opacity-60">✓</span>
              <span>{{ point }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-slate-600">—</p>
        </div>

        <!-- Gaps & risks -->
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Gaps & Risks</span>
            <span class="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-400 ring-1 ring-amber-500/25">
              {{ data.gaps_risks.length }}
            </span>
          </div>
          <div v-if="data.gaps_risks.length" class="flex flex-col gap-2">
            <div
              v-for="(gap, idx) in data.gaps_risks"
              :key="`gap-${idx}`"
              class="flex items-start gap-2 rounded-lg bg-amber-500/[0.07] px-3 py-2 text-xs leading-relaxed text-amber-300 ring-1 ring-amber-500/10"
            >
              <span class="mt-px opacity-60">⚠</span>
              <span>{{ gap }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-slate-600">—</p>
        </div>

        <!-- Interview questions -->
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Questions</span>
            <span class="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/25">
              {{ data.interview_questions.length }}
            </span>
          </div>
          <ol v-if="data.interview_questions.length" class="flex flex-col gap-2">
            <li
              v-for="(q, idx) in data.interview_questions"
              :key="`q-${idx}`"
              class="flex items-start gap-2.5 rounded-lg bg-indigo-500/[0.07] px-3 py-2 text-xs leading-relaxed text-indigo-300 ring-1 ring-indigo-500/10"
            >
              <span class="mt-px shrink-0 font-bold opacity-50">{{ idx + 1 }}.</span>
              <span>{{ q }}</span>
            </li>
          </ol>
          <p v-else class="text-xs text-slate-600">—</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Status = 'success' | 'error'

type MatchWithJob = string

type Recommendation = string

interface BaseMatchResult {
  status: Status
  error: string | null
  candidate_summary: string | null
  match_with_job: MatchWithJob | null
  key_matching_points: string[]
  gaps_risks: string[]
  interview_questions: string[]
  final_recommendation: Recommendation | null
}

type MatchResult = BaseMatchResult

const props = defineProps<{
  data: MatchResult
}>()

const isError = computed<boolean>(() => props.data.status === 'error')

const statusType = computed<'success' | 'danger'>(() => (isError.value ? 'danger' : 'success'))

const statusLabel = computed<string>(() => (isError.value ? 'Error' : 'Success'))

const matchLabel = computed(() => 
  props.data.match_with_job != null ? `${props.data.match_with_job}%` : '—'
)

const recommendationLabel = computed<string>(() => props.data.final_recommendation ?? '—')

const hasAnyDetails = computed<boolean>(() => {
  return (
    Boolean(props.data.candidate_summary) ||
    Boolean(props.data.match_with_job) ||
    Boolean(props.data.final_recommendation) ||
    props.data.key_matching_points.length > 0 ||
    props.data.gaps_risks.length > 0 ||
    props.data.interview_questions.length > 0
  )
})
</script>
