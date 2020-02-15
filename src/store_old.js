import Vue from 'vue'
import Vuex from 'vuex'

import axios from '../configuration/axios-authForms'
import globalAxios from 'axios'

import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    userEmail: null,
    user: null
  },
  getters: {
    user: state => {
      return state.user;
    },
    isAuthenticated: state => {
      return state.idToken !== null ? true : false;
    }
  },
  mutations: {
    'AUTH_USER'(state, data) {
      state.idToken = data.idToken;
      state.userId = data.localId;
    },
    'STORE_USER'(state, data) {
      state.user = data;
    },
    'USER_LOGOUT'(state) {
      state.idToken = null;
      state.userId = null;
    }
  },
  actions: {
    setAutoLogout(context, expirationTime) {
      setTimeout(() => {
        context.dispatch('logout');
      }, expirationTime * 1000);
    },
    signUp(context, authData) {

      axios.post(
        "accounts:signUp?key=AIzaSyC0VzYpjH9C85MpbrosplXLAdz1nMhjuxU",
        {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }
      )
        .then(response => {
          //set user as signed in when create succesfull.
          context.commit('AUTH_USER', response.data);
          // save user data in the users profile table.
          context.dispatch('storeUser', authData);
          // setup auto logout when session expires.
          context.dispatch('setAutoLogout', response.data.expiresIn);

          // determine the date when token should expire.
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
          // save token for auto login.
          localStorage.setItem('token', response.data.idToken);
          localStorage.setItem('userId', response.data.localId);
          localStorage.setItem('expirationDate', expirationDate);

          console.log('User signed up!', response)
        })
        .catch(error => console.log(error));
    },
    login({ commit, dispatch }, authData) {
      axios.post(
        "accounts:signInWithPassword?key=AIzaSyC0VzYpjH9C85MpbrosplXLAdz1nMhjuxU",
        {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }
      )
        .then(response => {

          // determine the date when token should expire.
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
          // save token for auto login.
          localStorage.setItem('token', response.data.idToken);
          localStorage.setItem('userId', response.data.localId);
          localStorage.setItem('expirationDate', expirationDate);

          // set session detail for logged in user.
          commit('AUTH_USER', response.data);
          // get user profile.
          dispatch('getUser');
          // setup auto logout when session expires.
          dispatch('setAutoLogout', response.data.expiresIn);
          // navigate when login all good.
          router.replace('/dashboard');
        })
        .catch(error => console.log(error));
    },
    tryAutoLogin(context) {
      const token = localStorage.getItem('token');
      if (!token) {
        return
      }
      const expirationDate = localStorage.getItem('expirationDate');
      const now = new Date();
      if (now >= expirationDate) {
        return
      }
      const userId = localStorage.getItem('userId');
      context.commit('AUTH_USER', {
        idToken: token,
        localId: userId
      })

    },
    logout({ commit }) {
      commit('USER_LOGOUT');

      // clear browser storage.
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('userId');

      // setup navigation.
      router.replace('/signin');
    },
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

      //get user detail from profile.
      globalAxios.get("/users.json" + '?auth=' + state.idToken)
        .then(res => {
          console.log(res.data);

          const data = res.data;
          const users = [];
          for (let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }

          console.log(users);
          commit('STORE_USER', users[0]);
        })
        .catch(error => console.log(error));
    }
  },

})