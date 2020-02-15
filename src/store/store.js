import Vue from 'vue'
import Vuex from 'vuex'

import userProfile from './modules/userprofile';
import authForms from './modules/auth-forms';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        userProfile,
        authForms
    }
});