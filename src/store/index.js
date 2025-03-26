import { createStore } from 'vuex'
import character from './modules/character'
import sessions from './modules/sessions'

export default createStore({
    modules: {
        character,
        sessions
    }
})