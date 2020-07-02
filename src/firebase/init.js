import firebase from 'firebase/app'
import 'firebase/auth'

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: 'AIzaSyDs_Ow8mgBPAIGJvSMDl0Qf4nSiS1Rpkf8',
  authDomain: 'timesheet-130b6.firebaseapp.com',
  databaseURL: 'https://timesheet-130b6.firebaseio.com',
  projectId: 'timesheet-130b6',
  storageBucket: 'timesheet-130b6.appspot.com',
  messagingSenderId: '133446352102',
  appId: '1:133446352102:web:042fcda93d974fd9204f27',
  measurementId: 'G-Y6N3NHR599'
}

firebase.initializeApp(config)
