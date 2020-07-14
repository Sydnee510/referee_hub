import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getQuestions as getQuestionsApi, QuestionsResponse } from 'MainApp/apis/question'
import { HeadersMap } from 'MainApp/pages/ImportWizard/MapStep'
import { GetQuestionsSchemaDatum, Included, Meta } from 'MainApp/schemas/getQuestionsSchema'
import { importTests as importTestsApi } from '../../apis/test'
import { AppThunk } from '../../store'

export interface QuestionsState {
  questions: GetQuestionsSchemaDatum[];
  answers: Included[];
  error: string | null;
  isLoading: boolean;
  meta?: Meta
}

const initialState: QuestionsState = {
  answers: [],
  error: null,
  isLoading: false,
  questions: []
}

function questionsSuccess(state: QuestionsState, action: PayloadAction<QuestionsResponse>) {
  state.questions = action.payload.questions
  state.isLoading = false
  state.error = null
  state.meta = action.payload.meta
  state.answers = action.payload.answers
}

function questionsFailure(state: QuestionsState, action: PayloadAction<string>) {
  state.questions = []
  state.isLoading = false
  state.error = action.payload
  state.answers = []
}

const questions = createSlice({
  initialState,
  name: 'questions',
  reducers: {
    getQuestionsFailure: questionsFailure,
    getQuestionsStart(state: QuestionsState) {
      state.isLoading = true
    },
    getQuestionsSuccess: questionsSuccess,
    importTestQuestionsFailure: questionsFailure,
    importTestQuestionsStart(state: QuestionsState) {
      state.isLoading = true
    },
    importTestQuestionsSuccess: questionsSuccess,
  }
})

export const {
  getQuestionsFailure,
  getQuestionsStart,
  getQuestionsSuccess,
  importTestQuestionsFailure,
  importTestQuestionsStart,
  importTestQuestionsSuccess
} = questions.actions

export const importTestQuestions = (file: File, mappedData: HeadersMap, testId: string): AppThunk => async dispatch => {
  try {
    dispatch(importTestQuestionsStart())
    const questionsResponse = await importTestsApi(file, mappedData, testId)
    dispatch(importTestQuestionsSuccess(questionsResponse))
  } catch (err) {
    dispatch(importTestQuestionsFailure(err.toString()))
  }
}

export const getQuestions = (testId: string): AppThunk => async dispatch => {
  try {
    dispatch(getQuestionsStart())
    const questionsResponse = await getQuestionsApi(testId)
    dispatch(getQuestionsSuccess(questionsResponse))
  } catch (err) {
    dispatch(getQuestionsFailure(err.toString()))
  }
}

export default questions.reducer
