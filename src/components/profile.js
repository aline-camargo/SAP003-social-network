import actionIcon from './action-icon.js';
import fileInput from './file-input.js';

const editProfileName = (pencilIcon) => {
  const displayName = document.querySelector('.user-info');
  pencilIcon.className = 'edit-btn minibtns fas fa-pencil-alt hide';
  pencilIcon.nextElementSibling.className = 'save-btn minibtns show fas fa-check';
  displayName.contentEditable = true;
  displayName.classList.add('editable-name');
  displayName.focus();
};

const updateProfileName = (checkIcon) => {
  const displayName = document.querySelector('.user-info');
  checkIcon.className = 'save-btn minibtns hide fas fa-check';
  checkIcon.previousElementSibling.className = 'edit-btn minibtns fas fa-pencil-alt show';
  displayName.classList.remove('editable-name');
  displayName.contentEditable = false;

  const user = app.auth.currentUser;
  user.updateProfile({
    displayName: displayName.textContent,
    name: displayName.textContent,
  });

  Toastify({
    text: 'Nome alterado! Aguarde alguns segundos para atualização.',
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'center',
    className: 'notification notification-success',
  }).showToast();

  app.db
    .collection('posts')
    .where('user', '==', user.uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        app.db
          .collection('posts')
          .doc(doc.id)
          .update({ name: displayName.textContent });
      });
    });

  app.db
    .collection('posts')
    .where('commentsCount', '>', 0)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const comments = doc.data().comments;
        const matchComments = comments.filter(comment => comment.user === user.uid);
        if (matchComments.length > 0) {
          matchComments.forEach((comm) => {
            const indextoUpdate = comments.findIndex((elem) => {
              return elem.timestampComment === comm.timestampComment;
            });
            comments[indextoUpdate].name = displayName.textContent;
            app.db
              .collection('posts')
              .doc(doc.id)
              .update({
                comments,
              });
          });
        }
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
      if (err.code === 'storage/object-not-found') return;

      Toastify({
        text: err.message,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: 'top',
        position: 'center',
        className: 'notification notification-error',
      }).showToast();
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
    className: 'notification notification-success',
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
    onClick: editProfileName,
  })}      
              ${actionIcon({
    class: 'save-btn minibtns hide fas fa-check',
    name,
    dataDocid: user.id,
    onClick: updateProfileName,
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
