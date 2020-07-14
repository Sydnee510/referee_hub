import { combineReducers }from '@reduxjs/toolkit'

import certificationsReducer from './modules/certification/certifications'
import currentUserReducer from './modules/currentUser/currentUser'
import jobsReducer from './modules/job/job'
import nationalGoverningBodiesReducer from './modules/nationalGoverningBody/nationalGoverningBodies'
import nationalGoverningBodyReducer from './modules/nationalGoverningBody/nationalGoverningBody';
import questionsReducer from './modules/question/questions'
import getRefereeReducer from './modules/referee/referee'
import refereesReducer from './modules/referee/referees'
import teamReducer from './modules/team/team'
import teamsReducer from './modules/team/teams'
import testReducer from './modules/test/test'
import testsReducer from './modules/test/tests'

const rootReducer = combineReducers({
  certifications: certificationsReducer,
  currentUser: currentUserReducer,
  jobs: jobsReducer,
  nationalGoverningBodies: nationalGoverningBodiesReducer,
  nationalGoverningBody: nationalGoverningBodyReducer,
  questions: questionsReducer,
  referee: getRefereeReducer,
  referees: refereesReducer,
  team: teamReducer,
  teams: teamsReducer,
  test: testReducer,
  tests: testsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
