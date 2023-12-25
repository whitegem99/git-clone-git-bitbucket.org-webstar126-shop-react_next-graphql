import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyArteexVwFPOsDkzo0XTRNvDJWRbhx5kr0',
  authDomain: 'playback-ai.firebaseapp.com',
  databaseURL: 'https://playback-wholesale.firebaseio.com',
  projectId: 'playback-ai',
  storageBucket: 'playback-ai.appspot.com',
  messagingSenderId: '55755818511',
  appId: '1:55755818511:web:415cdb55fd4e36c0fc857a',
  measurementId: 'G-1FP0MEBFPY'
}

// Initialize Firebase
const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

export default firebaseApp
