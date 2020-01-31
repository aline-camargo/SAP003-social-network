import actionIcon from './action-icon.js';
import fileInput from './file-input.js';

window.app = {
  db: firebase.firestore(),
  auth: firebase.auth(),
  storage: firebase.storage(),
};

const editProfile = (pencilIcon) => {
  pencilIcon.className = 'edit-btn minibtns fas fa-pencil-alt hide';
  pencilIcon.nextElementSibling.className = 'save-btn minibtns show fas fa-check';
  pencilIcon.previousElementSibling.contentEditable = true;
  pencilIcon.previousElementSibling.className += 'editable-text';
};

const updateProfile = (checkIcon) => {
  checkIcon.className = 'save-btn minibtns hide fas fa-check';

  checkIcon.previousElementSibling.className = 'edit-btn minibtns fas fa-pencil-alt show';
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

const editPhoto = (target, uid) => {
  firebase
    .storage()
    .ref()
    .child(`users/${uid}.png`)
    .put(target.files[0])
    .then(() => {
      target.value = '';
    });
};

const Profile = (url) => {
  const user = app.auth.currentUser;
  const name = user.displayName.trim();
  const uid = user.uid;

  return `
        <div class="cover">
            <img class="cover"src="../image/cover.png"/>
        </div>
        <div class="profile">
          <img class="image-profile" src="${url}"/>
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
    `;
};

const preProfile = () => {
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
      document.querySelector('.photo-profile').innerHTML = Profile(url);
    });
};


export default preProfile;
