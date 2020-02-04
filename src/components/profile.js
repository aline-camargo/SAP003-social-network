import actionIcon from './action-icon.js';
import fileInput from './file-input.js';

const editProfile = (pencilIcon) => {
  pencilIcon.className = 'edit-btn minibtns fas fa-pencil-alt hide';
  pencilIcon.nextElementSibling.className = 'save-btn minibtns show fas fa-check';
  pencilIcon.previousElementSibling.contentEditable = true;
  pencilIcon.previousElementSibling.className += ' editable-name';
  pencilIcon.previousElementSibling.focus();
};

const updateProfile = (checkIcon) => {
  checkIcon.className = 'save-btn minibtns hide fas fa-check';
  checkIcon.previousElementSibling.className = 'edit-btn minibtns fas fa-pencil-alt show';
  checkIcon.previousElementSibling.previousElementSibling.classList.remove('editable-name');

  const pName = checkIcon.previousElementSibling.previousElementSibling;
  pName.contentEditable = false;
  pName.className = 'username';

  const user = app.auth.currentUser;
  user.updateProfile({
    displayName: pName.textContent,
    name: pName.textContent,
  });

  app.db.collection('posts').where('user', '==', user.uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        app.db.collection('posts').doc(doc.id).update({ name: pName.textContent });
      });
    });
};

const loadProfilePhoto = () => {
  const user = app.auth.currentUser.uid;

  firebase
    .storage()
    .ref()
    .child(`users/${user}.png`)
    .getDownloadURL()
    .catch((err) => {
      console.log(err);
    })
    .then((url) => {
      if (!url) {
        document.querySelector('.image-profile').src = '../image/profile-placeholder.png';
      } else {
        document.querySelector('.image-profile').src = url;
      }
    });
};

const editPhoto = (target, uid) => {
  Toastify({
    text: 'Foto enviada! Aguarde alguns segundos para atualização.',
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'center',
    className: 'notification',
  }).showToast();

  document.querySelector('.image-profile').src = '../image/loading.gif';

  firebase
    .storage()
    .ref()
    .child(`users/${uid}.png`)
    .put(target.files[0])
    .then(() => {
      target.value = '';
      app.loadProfilePhoto();
    });
};

const Profile = () => {
  const user = app.auth.currentUser;
  const name = user.displayName.trim();
  const uid = user.uid;

  return `
  <div class="photo-profile">
        <div class="cover">
            <img class="cover"src="../image/cover.png"/>
        </div>
        <div class="profile">
          <img class="image-profile" src="../image/loading.gif"/>
          <div class="container edit-profile">
            <div class="row display-name">
              <h1 class="user-info">${name}</h1>
              ${actionIcon({
    class: 'edit-btn minibtns fas fa-pencil-alt',
    name,
    dataDocid: user.uid,
    onClick: editProfile,
  })}      
              ${actionIcon({
    class: 'save-btn minibtns hide fas fa-check',
    name,
    dataDocid: user.id,
    onClick: updateProfile,
  })}
              </div>
              ${fileInput({
    uid,
    title: 'Editar foto de perfil',
    onChange: editPhoto,
  })}
            </div>
        </div> 
        </div>
    `;
};

window.app = {
  db: firebase.firestore(),
  auth: firebase.auth(),
  storage: firebase.storage(),
  loadProfilePhoto,
};

export {
  Profile,
  loadProfilePhoto,
};
