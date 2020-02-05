/* eslint-disable no-else-return */
import Button from '../components/button.js';
import textArea from '../components/text-area.js';
import Modal from '../components/modal.js';
import actionIcon from '../components/action-icon.js';
import selectPrivacy from '../components/selectPrivacy.js';
import { Profile, loadProfilePhoto } from '../components/profile.js';

const logout = () => {
  funcs.auth.signOut().catch((error) => {
    Toastify({
      text: error.message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: 'top',
      position: 'center',
      className: 'notification error',
    }).showToast();
  });
};

const showModal = (deleteButton) => {
  document.querySelector('#check-delete').classList.remove('hide');
  if (Array.from(deleteButton.classList).includes('delete-btn-comment')) {
    document.querySelector('.confirm-delete').id = `${deleteButton.parentElement.dataset.post}+${deleteButton.dataset.docid}`;
  } else {
    document.querySelector('.confirm-delete').id = deleteButton.dataset.docid;
  }
};

const deleteComment = (postId, commentId) => {
  funcs.db.collection('posts').doc(postId).get().then((qs) => {
    const commentsPosts = qs.data().comments;
    const updatedComments = commentsPosts.filter(comment => comment.timestampComment !== commentId);

    funcs.db.collection('posts').doc(postId).update({
      commentsCount: firebase.firestore.FieldValue.increment(-1),
      comments: updatedComments,
    });
  });
};

const deletePost = (e) => {
  const info = e.currentTarget.id;
  if (info.includes('+')) {
    const dividedInfo = e.currentTarget.id.split('+');
    const postId = dividedInfo[0];
    const commentId = Number(dividedInfo[1]);
    funcs.deleteComment(postId, commentId);
  } else {
    funcs.db.collection('posts').doc(e.currentTarget.id).delete();
  }
};

const makePostEditable = (pencilIcon) => {
  pencilIcon.className = 'edit-btn minibtns hide';
  pencilIcon.previousElementSibling.className = 'save-btn minibtns show fas fa-check';
  pencilIcon.parentElement.previousElementSibling.contentEditable = true;
  pencilIcon.parentElement.previousElementSibling.className += ' editable-text';
  pencilIcon.parentElement.previousElementSibling.focus();
};

const saveEditPost = (checkIcon) => {
  checkIcon.className = 'save-btn minibtns hide fas fa-check';
  checkIcon.nextElementSibling.className = 'edit-btn minibtns show';
  const pText = checkIcon.parentElement.previousElementSibling;
  const id = checkIcon.dataset.docid;
  const db = firebase.firestore();
  pText.contentEditable = false;
  pText.className = 'text';
  db.collection('posts').doc(id).update({
    text: pText.textContent,
    date: new Date().toLocaleString('pt-BR').slice(0, 16),
  })
    .then(() => {
      Toastify({
        text: 'Post editado com sucesso!',
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: 'top',
        position: 'center',
        className: 'notification success',
      }).showToast();
    });
};

const like = (heart) => {
  const newlike = Number(heart.nextElementSibling.textContent) + 1;
  funcs.db.collection('posts').doc(heart.dataset.docid)
    .update({
      likes: newlike,
    });
};

const checkUserEdit = (doc) => {
  const user = funcs.auth.currentUser.uid;
  if (user === doc.user) {
    return `
    ${actionIcon({
    class: 'save-btn minibtns hide fas fa-check',
    name: doc.user,
    dataDocid: doc.id,
    onClick: saveEditPost,
  })}
      ${actionIcon({
    class: 'edit-btn minibtns fas fa-pencil-alt',
    name: doc.user,
    dataDocid: doc.id,
    onClick: makePostEditable,
  })}
    `;
  }
  return '';
};

const checkUserDelete = (doc) => {
  const user = funcs.auth.currentUser.uid;
  if (user === doc.user && doc.id) {
    return `
  ${actionIcon({
    class: 'delete-btn minibtns fas fa-times',
    name: doc.user,
    dataDocid: doc.id,
    onClick: showModal,
  })}`;
  } else if (user === doc.user && doc.timestampComment) {
    return `
  ${actionIcon({
    class: 'delete-btn delete-btn-comment minibtns fas fa-times',
    name: doc.user,
    dataDocid: doc.timestampComment,
    onClick: showModal,
  })}`;
  }
  return '';
};

const addComment = (commentIcon) => {
  commentIcon.parentElement.nextElementSibling.classList.toggle('hide');
};

const saveComment = (event) => {
  if (event.keyCode === 13) {
    const comment = event.target.value;
    const id = event.target.parentElement.dataset.docid;

    funcs.db
      .collection('posts')
      .doc(id).update({
        commentsCount: firebase.firestore.FieldValue.increment(1),
        comments: firebase.firestore.FieldValue.arrayUnion({
          comment,
          name: funcs.auth.currentUser.displayName,
          timestampComment: new Date().getTime(),
          user: funcs.auth.currentUser.uid,
          date: new Date().toLocaleString('pt-BR').slice(0, 16),
        }),
      });
  }
};

const checkComments = (comments, postId) => {
  if (comments && comments.length !== 0) {
    const commentsTemplate = [];
    comments.forEach((obj) => {
      commentsTemplate.push(`
      <div class="text comment-area">
        <p class='comment row' data-post=${postId}>
          <span class="comment-name">${obj.name} | ${obj.date}</span>
          ${checkUserDelete(obj)}
        </p>
        <p class='comment'>${obj.comment}</p>
    </div>
  `);
    });
    const finalCommentsTemplate = `
    <div class="comments-title">
      <p class="branco">Comentários:</p>
      ${commentsTemplate.join('')}
    </div>`;
    return finalCommentsTemplate;
  }
  return '';
};

const postTemplate = doc => `
    <div class='column posted container-post' data-id=${doc.id}> 

      <p class='row posted posted-name'> Publicado por ${doc.name} | ${doc.date}
      ${checkUserDelete(doc)}
      </p>

      <div class='row text-button'>
        <p class='text' data-like=${doc.likes} data-docid=${doc.id}> ${doc.text}</p>
        <div class='buttons'>
        ${checkUserEdit(doc)}
        </div>
      </div>

     
      ${checkComments(doc.comments, doc.id)}
      

      <div class='column comments' data-docid=${doc.id}>
        <div>
        ${actionIcon({
    class: 'comment-btn minibtns fab far fa-paper-plane',
    name: doc.user,
    dataDocid: doc.id,
    onClick: addComment,
  })}
      <span class="likes">${doc.commentsCount}</span>
        ${actionIcon({
    class: 'like-btn minibtns fas fa-heart',
    name: doc.user,
    dataDocid: doc.id,
    onClick: like,
  })}
    <span class="likes">${doc.likes}</span>
        </div>
      ${textArea({
    class: 'add-comment hide',
    placeholder: 'Comente...',
    onKeyup: saveComment,
  })}

      </div>
    </div>`;


const newPost = () => {
  const theTextArea = document.querySelector('.add-post');
  const privacyOption = document.querySelector('.privacy-option');
  const post = {
    name: funcs.auth.currentUser.displayName,
    user: funcs.auth.currentUser.uid,
    text: theTextArea.value.replace(/\n/g, '<br>'),
    likes: 0,
    commentsCount: 0,
    timestamp: new Date().getTime(),
    date: new Date().toLocaleString('pt-BR').slice(0, 16),
    private: privacyOption.value,
  };
  funcs.db.collection('posts').add(post).then((docRef) => {
    docRef = {
      ...post,
      id: docRef.id,
    };

    theTextArea.value = '';
    document.querySelector('.post-btn').disabled = true;
  });
};

const buttonActivate = (e) => {
  const postBtn = document.querySelector('.post-btn');
  const chars = e.target.value.length;
  if (chars !== 0) {
    postBtn.disabled = false;
  } else {
    postBtn.disabled = true;
  }
};

const changeViewPost = (e) => {
  const value = e.target.value;
  document.querySelector('.posts').innerHTML = '';
  document.querySelector('.privacy-post').value = value;
  if (value === 'false') {
    firebase
      .firestore()
      .collection('posts')
      .where('private', '==', value)
      .orderBy('timestamp', 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((post) => {
          const docPost = {
            ...post.data(),
            id: post.id,
          };
          document.querySelector('.posts').innerHTML += funcs.postTemplate(docPost);
        });
      });
  } else {
    const currentUser = funcs.auth.currentUser.uid;
    firebase
      .firestore()
      .collection('posts')
      .where('user', '==', currentUser)
      .where('private', '==', value)
      .orderBy('timestamp', 'desc')
      .onSnapshot((querySnapshot) => {
        document.querySelector('.posts').innerHTML = '';
        querySnapshot.forEach((post) => {
          const docPost = {
            ...post.data(),
            id: post.id,
          };
          document.querySelector('.posts').innerHTML += funcs.postTemplate(docPost);
        });
      });
  }
};

const Feed = (props) => {
  funcs.postsTemplate = '';
  document.querySelector('body').className = 'background';

  props.posts.forEach((post) => {
    const docPost = {
      ...post.data(),
      id: post.id,
    };
    funcs.postsTemplate += funcs.postTemplate(docPost);
  });

  const template = `
  <header class='header'> <h2 class='header-title'> MusicalSpace </h2>
  ${actionIcon({
    class: 'signout-icon fas fa-sign-out-alt',
    name: 'sair',
    dataDocid: 'a',
    onClick: logout,
  })}
  </header>
    <section class="container-main screen-margin-bottom">
      ${Profile()}
      <section class="container margin-top-container">
      <div class='column new-post'>
      ${textArea({
    class: 'add-post',
    placeholder: 'O que você está ouvindo?',
    onKeyup: buttonActivate,
  })}
  <div class='row'>
    ${selectPrivacy({
    class: 'privacy-option privacy-post',
    onChange: () => { },
    opClass1: 'public',
    value1: 'false',
    txt1: 'Público',
    opClass2: 'private',
    value2: 'true',
    txt2: 'Privado',
  })}
    
  ${Button({
    type: 'button',
    title: 'Postar',
    class: 'primary-button post-btn',
    onClick: newPost,
    disabled: 'disabled',
  })}
  </div>
      </div>
      <p class="privacy-text">
      Visualizar Posts:
      </p>
      ${selectPrivacy({
    class: 'privacy-option',
    onChange: changeViewPost,
    opClass1: 'public',
    value1: 'false',
    txt1: 'Público',
    opClass2: 'private',
    value2: 'true',
    txt2: 'Privado',
  })}
        <div class='container posts'> ${funcs.postsTemplate} </div>
      </section>
    </section>
    ${Modal({ confirm: deletePost })}
  `;
  loadProfilePhoto();
  return template;
};

window.funcs = {
  postsTemplate: '',
  postTemplate,
  deleteComment,
  db: firebase.firestore(),
  auth: firebase.auth(),
};
window.changeViewPost = changeViewPost;

export default Feed;
