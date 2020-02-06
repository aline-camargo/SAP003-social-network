import Button from '../components/button.js';
import Input from '../components/input.js';
import logo from '../components/logo.js';


const createUser = () => {
  const email = document.querySelector('.js-email-input').value;
  const password = document.querySelector('.js-password-input').value;
  const name = document.querySelector('.js-name-input').value;
  firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode === 'auth/weak-password') {
      document.querySelector('.erro').textContent = 'A senha é muito fraca.';
    } else {
      document.querySelector('.erro').textContent = errorMessage;
    }
  })
    .then((cred) => {
      cred.user.updateProfile({
        displayName: name,
      });
      if (cred.additionalUserInfo.isNewUser) {
        firebase.auth().currentUser.sendEmailVerification().then(() => {
          document.querySelector('.erro').textContent = 'Email cadastrado com sucesso! Verifique sua caixa de entrada para confirmá-lo!';
          document.querySelector('#register-form').reset();
        });
      }
    });
};

const location = () => {
  window.location.hash = '';
};

const Register = () => {
  document.querySelector('body').className = '';
  const template = `
  <section class='container main-container'>
    <section class="container">
      ${logo({
    img: 'image/logo.png', classImg: 'logo', classP: 'text-logo', text: 'MusicalSpace',
  })}
    </section>
    <section class="container">
      <form class="container" id="register-form">
      <p class="erro"></p>
        ${Input({
    type: 'text',
    placeholder: 'Nome',
    class: 'js-name-input primary-input',
  })}
        ${Input({
    type: 'email',
    placeholder: 'Email',
    class: 'js-email-input primary-input',
  })}
        ${Input({
    type: 'password',
    placeholder: 'Senha',
    class: 'js-password-input primary-input',
  })}
        ${Button({
    type: 'submit',
    title: 'Cadastrar',
    class: 'primary-button',
    onClick: createUser,
    disabled: 'enabled',
  })}
        ${Button({
    type: 'button',
    title: 'Voltar',
    class: 'primary-button',
    onClick: location,
    disabled: 'enabled',
  })}
      </form>
    </section>
  </section>
  `;
  return template;
};

export default Register;
