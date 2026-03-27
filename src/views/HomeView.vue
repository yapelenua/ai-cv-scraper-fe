<template>
  <div
    v-loading="loading"
    element-loading-text="Analyzing..."
    element-loading-background="rgba(8, 12, 28, 0.7)"
    class="relative min-h-screen overflow-hidden bg-[#080c1c] px-4 py-12 font-sans text-slate-200 sm:px-6"
  >
    <!-- Ambient blobs -->
    <div class="pointer-events-none fixed -left-36 -top-24 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.08] blur-[90px]" aria-hidden="true" />
    <div class="pointer-events-none fixed -bottom-20 -right-24 h-[400px] w-[400px] rounded-full bg-fuchsia-500/[0.07] blur-[90px]" aria-hidden="true" />

    <div class="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-8">

      <!-- Header -->
      <header class="flex flex-col items-center gap-2 text-center">
        <span class="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-slate-500">
          CV · Analysis · Tool
        </span>
        <h1 class="animate-gradient bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-400 bg-[length:250%_250%] bg-clip-text p-2 font-display text-[clamp(3rem,8vw,5rem)] font-extrabold leading-none tracking-tight text-transparent">
          CVComparing
        </h1>
        <p class="text-sm text-slate-500">Drop your résumé. Paste the job. Get the truth.</p>
      </header>

      <main class="flex flex-col gap-4">

        <!-- Job Input -->
        <section class="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition-colors hover:border-white/[0.13] sm:p-6">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <span class="font-display text-[0.7rem] font-bold tracking-wide text-indigo-400">01</span>
              Job Input
            </span>
            <ElDropdown trigger="click" @command="onModeChange">
              <span class="cursor-pointer rounded-full border border-white/[0.08] px-3 py-1 text-xs font-medium text-slate-500 transition-all hover:border-white/[0.18] hover:text-slate-200">
                {{ modeLabel }} <span class="opacity-50">⌄</span>
              </span>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem command="text">Text</ElDropdownItem>
                  <ElDropdownItem command="link">Link</ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </div>

          <div class="mt-4">
            <div v-if="mode === 'text'">
              <ElInput
              v-model="jobDescription"
              type="textarea"
              :autosize="{ minRows: 7, maxRows: 10 }"
              placeholder="Paste the job description here..."
            />
              <div
                class="mt-2 flex items-center justify-between text-xs"
              >
                <span :class="jobValidationError ? 'text-red-400' : 'text-slate-600'">
                  {{ jobWordCount }} / {{ MIN_JOB_WORDS }} words minimum
                </span>
              </div>
            </div>

            
            <ElInput
              v-else
              v-model="jobLink"
              type="text"
              placeholder="https://jobs.example.com/..."
            />
          </div>
        </section>

        <!-- CV Upload -->
        <section class="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition-colors hover:border-white/[0.13] sm:p-6">
          <span class="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <span class="font-display text-[0.7rem] font-bold tracking-wide text-indigo-400">02</span>
            Your CV
          </span>

          <div class="mt-4">
            <ElUpload
              v-if="fileList.length === 0"
              v-model:file-list="fileList"
              drag
              :limit="1"
              :auto-upload="false"
              action="#"
              :accept="accept"
              :on-change="onUploadChange"
              :on-exceed="onUploadExceed"
              class="w-full"
            >
              <div class="flex flex-col items-center gap-2 py-6">
                <span class="text-2xl opacity-40">⬆</span>
                <span class="text-sm font-semibold text-slate-400">Drop PDF or click to browse</span>
                <span class="text-xs text-slate-600">PDF only · max 1 file</span>
              </div>
            </ElUpload>

            <div v-else class="flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.08] px-4 py-3">
              <span class="text-2xl">📄</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-slate-200">{{ fileList[0]?.name ?? '—' }}</p>
                <p class="mt-0.5 text-xs text-indigo-400">Ready to analyze</p>
              </div>
              <button
                class="rounded px-2 py-1 text-sm text-slate-500 transition-colors hover:text-red-400"
                @click="removeSelectedFile"
              >✕</button>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <button
          :disabled="loading || !canAnalyze"
          class="h-[52px] w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-bold tracking-wide text-white transition-all hover:-translate-y-px hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          @click="onCompare"
        >
          <span v-if="!loading">Analyze Match →</span>
          <span v-else>Analyzing…</span>
        </button>

        <ElAlert
          v-if="requestError"
          :title="requestError"
          type="error"
          show-icon
          :closable="false"
        />

        <MatchResultCard v-if="result" :data="result" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus'
import MatchResultCard from '@/components/MatchResultCard.vue'
import { getFileSignature, isPdfFile, PDF_ACCEPT } from '@/helpers/file'
import { analyzeCv } from '@/services/analyzeService'
import type { MatchResult } from '@/types'

const MODE_LABELS = { text: 'Text', link: 'Link' } as const

const mode = ref<'text' | 'link'>('text')
const jobDescription = ref('')
const jobLink = ref('')
const fileList = ref<UploadUserFile[]>([])
const loading = ref(false)
const requestError = ref<string | null>(null)
const result = ref<MatchResult | null>(null)
const accept = PDF_ACCEPT
const MIN_JOB_WORDS = 100

// Track what was last successfully compared
const lastComparedKey = ref<string | null>(null)

const modeLabel = computed(() => MODE_LABELS[mode.value])

const currentJobInput = computed(() =>
  mode.value === 'text' ? jobDescription.value.trim() : jobLink.value.trim()
)

const currentFileSig = computed<string | null>(() => {
  const raw = fileList.value[0]?.raw
  return raw instanceof File ? getFileSignature(raw) : null
})

const jobWordCount = computed<number>(() =>
  jobDescription.value.trim().split(/\s+/).filter(Boolean).length
)

// додай computed для помилки валідації
const jobValidationError = computed<string | null>(() => {
  if (mode.value !== 'text') return null
  if (jobDescription.value.trim().length === 0) return null // порожнє — не показуємо до сабміту
  return jobWordCount.value < MIN_JOB_WORDS
    ? `Job description is too short — ${jobWordCount.value}/${MIN_JOB_WORDS} words`
    : null
})

// A single string key representing the current inputs — dirty if it differs from last run
const currentKey = computed(() =>
  currentJobInput.value && currentFileSig.value
    ? `${mode.value}::${currentJobInput.value}::${currentFileSig.value}`
    : null
)

const canAnalyze = computed(
  () => !!currentKey.value && currentKey.value !== lastComparedKey.value
)

function onModeChange(command: 'text' | 'link') {
  mode.value = command
  // Reset only what belongs to the old mode
  jobDescription.value = ''
  jobLink.value = ''
  requestError.value = null
  result.value = null
  lastComparedKey.value = null
}

async function onCompare(): Promise<void> {
  if (!canAnalyze.value || loading.value) return

  if (mode.value === 'text' && jobWordCount.value < MIN_JOB_WORDS) {
    requestError.value = `Job description is too short — ${jobWordCount.value}/${MIN_JOB_WORDS} words minimum`
    return
  }

  const cvFile = fileList.value[0]?.raw
  if (!(cvFile instanceof File)) {
    requestError.value = 'Please select a valid CV file.'
    return
  }

  requestError.value = null
  result.value = null
  loading.value = true

  try {
    result.value = await analyzeCv(
      currentJobInput.value,
      cvFile,
      { isText: mode.value === 'text', isLink: mode.value === 'link' }
    )
    lastComparedKey.value = currentKey.value
  } catch (err) {
    requestError.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

function removeSelectedFile(): void {
  fileList.value = []
  requestError.value = null
  result.value = null
}

function onUploadExceed(): void {
  ElMessage.warning('You can upload only 1 PDF file.')
}

function onUploadChange(file: UploadFile, files: UploadFiles): void {
  requestError.value = null
  result.value = null

  if (!(file.raw instanceof File) || !isPdfFile(file.raw)) {
    ElMessage.error('Only PDF files are allowed.')
    fileList.value = []
    return
  }

  fileList.value = files.slice(0, 1)
}
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
.animate-gradient { animation: gradient-shift 6s ease-in-out infinite; }
</style>

<style scoped>
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  animation: gradient-shift 6s ease-in-out infinite;
}
</style>
