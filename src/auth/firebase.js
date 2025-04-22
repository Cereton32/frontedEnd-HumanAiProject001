
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC8eDuA63oquMTAp_Cf2DxF9RXC2cTmlp4",
    authDomain: "humanaiproject-ab1d5.firebaseapp.com",
    projectId: "humanaiproject-ab1d5",
    storageBucket: "humanaiproject-ab1d5.firebasestorage.app",
    messagingSenderId: "925316767904",
    appId: "1:925316767904:web:1a9be37b8715f5b1f4e9c5",
    measurementId: "G-7CT9Z5JSVQ"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export default firebase;
