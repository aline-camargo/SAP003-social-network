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

firebase.firestore().settings({ timeStampsInSnapshots: true });
