import actionIcon from './action-icon.js';

window.app = {
  db: firebase.firestore(),
  auth: firebase.auth(),
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

const Profile = () => {
  const user = app.auth.currentUser;
  const name = user.displayName.trim();

  return `
    <div class="photo-profile">
        <div class="cover">
            <img class="cover"src="../image/cover.png"/>
        </div>
        <div class="profile">
            <i class="far fa-user user-icon"></i>
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
                <label for="input-file" class="file-input-label">
                    Editar foto de perfil
                    <input type="file" id="input-file"/>
                </label>
            </div>
        </div> 
    </div> 
    `;
};


export default Profile;
