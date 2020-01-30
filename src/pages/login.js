
import Button from '../components/button.js';
import Input from '../components/input.js';
import logo from '../components/logo.js';
import Google from '../components/google-login.js';

const userLogin = () => {
  const email = document.querySelector('.js-email-input').value;
  const password = document.querySelector('.js-password-input').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      const errorMessage = error.message;
      document.querySelector('.erro').textContent = errorMessage;
    }).then(() => {
      const user = firebase.auth().currentUser;
      if (!user.emailVerified) {
        document.querySelector('.erro').textContent = 'Email não verificado, vá até sua caixa de entrada';
      }
    });
};

firebase.auth().onAuthStateChanged((user) => {
  const checkUser = user ? '#feed' : '';
  window.location.hash = checkUser;
});

const loginGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const Login = () => {
  document.querySelector('body').classList = '';
  const template = `
    <section class='container main-container'>
    <section class="container">
      ${logo({
    img: 'image/logo.png', classImg: 'logo', classP: 'text-logo', text: 'MusicalSpace',
  })}
    </section>
      <section class="container">
        <form class="container">
        <p class="erro"></p>
          ${Input({ type: 'email', placeholder: 'Email', class: 'js-email-input primary-input' })}
          ${Input({ type: 'password', placeholder: 'Senha', class: 'js-password-input primary-input' })}
          ${Button({
    type: 'submit', title: 'Login', class: 'primary-button', onClick: userLogin, disabled: 'enabled',
  })}
        </form>
        <p class="login-text">Ou entre com...</p>
        ${Google({
    src: 'image/google.png', class: 'google-button', onClick: loginGoogle, type: 'image',
  })}
        <p class="login-text">Não tem uma conta? <a href="#register" class="link">Registre-se</a></p>
       </section>
      </section>
      `;

  return template;
};
export default Login;
