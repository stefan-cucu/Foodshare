import firebase from 'firebase/compat';

const firebaseConfig = {
    apiKey: "AIzaSyB4DBWLEsAsiw9XmqhD-c4025THquuwXl4",
    authDomain: "test-fac03.firebaseapp.com",
    databaseURL: "https://test-fac03.firebaseio.com",
    projectId: "test-fac03",
    storageBucket: "test-fac03.appspot.com",
    messagingSenderId: "980018300558",
    appId: "1:980018300558:web:aa16f22a8e0800e84c2bdf"
  };

firebase.initializeApp(firebaseConfig)

export {firebase};
  