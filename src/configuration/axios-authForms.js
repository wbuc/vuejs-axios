import axios from 'axios'

// Can create as many Axios instances as we need - configure each instance for specific requests. Users, departments, tasks ect.
const instance = axios.create({
    baseURL: 'https://identitytoolkit.googleapis.com/v1/'
});

const config = {
    firebaseApp: 'AIzaSyC0VzYpjH9C85MpbrosplXLAdz1nMhjuxU'
}


// CORS will trigger if there are any custom headers added. Remove to prevent CORS from triggering.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests

// instance.defaults.headers.common['bla-bla'] = 'ola!';

export default { instance, config };



