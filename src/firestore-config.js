const firebaseConfig = {
  apiKey: 'AIzaSyBukqPNCaum68DGhsq-exRXVrG3YQBo56U',
  authDomain: 'musical-space-lab.firebaseapp.com',
  databaseURL: 'https://social-network-b6633.firebaseio.com',
  projectId: 'social-network-b6633',
  storageBucket: 'social-network-b6633.appspot.com',
  messagingSenderId: '725504625935',
  appId: '1:725504625935:web:7c43508ef792952c93827a',
  measurementId: 'G-3BPC27Y8LF',
};

firebase.initializeApp(firebaseConfig);
// var firebaseConfig = {
//   apiKey: "AIzaSyBukqPNCaum68DGhsq-exRXVrG3YQBo56U",
//   authDomain: "social-network-b6633.firebaseapp.com",
//   storageBucket: "social-network-b6633.appspot.com",
// };


// Get a reference to the storage service, which is used to create references in your storage bucket
window.auth = firebase.auth();
// window.db = firebase.data
db.settings({ timeStampsInSnapshots: true });
