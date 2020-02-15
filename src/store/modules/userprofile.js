
import globalAxios from 'axios'


const state = {
    idToken: null,
    userId: null,
    user: null
}
const getters = {
    user: state => {
        return state.user;
    },
    isAuthenticated: state => {
        return state.idToken !== null ? true : false;
    }
}
const mutations = {
    'AUTH_USER'(state, data) {
        state.idToken = data.idToken;
        state.userId = data.userId;
    },
    'SAVE_USER'(state, data) {
        state.user = data;
    },
    'LOGOUT_USER'(state) {
        state.idToken = null;
        state.userId = null;
    }
}
const actions = {
    storeUser({ commit, state }, userData) {
        //check if valid token.
        if (!state.idToken) {
            return;
        }
        //attache the token to access the resource.
        globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
            .then(response => console.log(response));
    },
    getUser({ commit, state }) {
        if (!state.idToken) {
            return;
        }
        globalAxios.get("/users.json" + '?auth=' + state.idToken)
            .then(res => {
                const data = res.data;
                const users = [];
                for (let key in data) {
                    const user = data[key];
                    user.id = key;
                    users.push(user);
                }
                commit('SAVE_USER', users[0]);
            })
            .catch(error => console.log(error));
    }
}

export default { state, getters, mutations, actions }