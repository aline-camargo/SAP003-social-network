import Register from './pages/register.js';
import Login from './pages/login.js';
import Feed from './pages/feed.js';


const main = document.querySelector('main');

const authCheck = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      window.location.hash = '#feed';
      firebase
        .firestore()
        .collection('posts')
        .where('private', '==', 'false')
        .orderBy('timestamp', 'desc')
        .onSnapshot((querySnapshot) => {
          main.innerHTML = Feed({ posts: querySnapshot });
        });
    } else {
      window.location.hash = '';
    }
  });
};

const routes = () => {
  if (window.location.hash === '#register') {
    main.innerHTML = Register();
  } else if (window.location.hash === '') {
    main.innerHTML = Login();
  } else if (window.location.hash === '#feed') {
    authCheck();
  }
};

window.addEventListener('load', routes);
window.addEventListener('hashchange', routes);
