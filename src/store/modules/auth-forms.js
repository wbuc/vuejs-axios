
import axiosConfig from '../../configuration/axios-authForms'
import router from '../../router'


//"accounts:signUp?key=AIzaSyC0VzYpjH9C85MpbrosplXLAdz1nMhjuxU",
const actions = {
    signUp(context, userData) {
        axiosConfig.instance.post(
            `accounts:signUp?key=${axiosConfig.config.firebaseApp}`,
            {
                email: userData.email,
                password: userData.password,
                returnSecureToken: true
            }
        )
            .then(response => {
                //set user as signed in when create succesfull.
                context.commit('AUTH_USER', response.data);
                // save user data in the users profile table.
                context.dispatch('storeUser', userData);
                // setup auto logout when session expires.
                context.dispatch('setAutoLogout', response.data.expiresIn);

                // determine the date when token should expire.
                const now = new Date();
                const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
                // save token for auto login.
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('userId', response.data.localId);
                localStorage.setItem('expirationDate', expirationDate);
            })
            .catch(error => console.log(error));
    },
    login({ commit, dispatch }, userData) {
        axiosConfig.instance.post(
            `accounts:signInWithPassword?key=${axiosConfig.config.firebaseApp}`,
            {
                email: userData.email,
                password: userData.password,
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
        router.replace('/dashboard');

    },
    logout({ commit }) {
        commit('LOGOUT_USER');

        // clear browser storage.
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');

        // setup navigation.
        router.replace('/signin');
    },
    setAutoLogout(context, expirationTime) {
        setTimeout(() => {
            context.dispatch('logout');
        }, expirationTime * 1000);
    },
}

export default { actions }