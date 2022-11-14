/* 
This file creates the page for users to submit the feedback. 
It simply holds the another component <NewFeedbackForm> and a submit handler who sends data to the database and redirect the page after submission.
*/

import { useHistory } from 'react-router-dom';
import NewFeedbackForm from './feedbacks/NewFeedbackForm';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set  } from "firebase/database";
//import { ref as sRef } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6YzFrRBpdaOCf8xX3lZHPpYRDtYMH_7g",
  authDomain: "educationpathways-c37ec.firebaseapp.com",
  databaseURL: "https://educationpathways-c37ec-default-rtdb.firebaseio.com",
  projectId: "educationpathways-c37ec",
  storageBucket: "educationpathways-c37ec.appspot.com",
  messagingSenderId: "868723117829",
  appId: "1:868723117829:web:0ffafe21bca572ee2b716c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

function FeedbackSubmitPage(){
    const history = useHistory();

    function addFeedbackHandler(feedback){
      set(ref(database, 'feedback/' + feedback.coursename + '/'), {
        course_code: feedback.coursename,
        workload: feedback.workload,
        complexity: feedback.complexity,
        usefulness: feedback.usefulness
      }
      ).then(()=>{
        history.replace('/')
      });

      // fetch('https://educationpathways-c37ec-default-rtdb.firebaseio.com/feedback.json',
      // {
      //   method:'POST',
      //   body:JSON.stringify(feedback),
      //   header:{'Content-Type': 'application/json'}
      // }
      // ).then(()=>{
      //   history.replace('/')
      // });
    }

    return (
        <div style={{ marginTop: "3%" }}>           
            <section>
            <h3> Submit Review Feedback</h3>
                <NewFeedbackForm onAddFeedback={addFeedbackHandler}/>
            </section>
        </div> 

    );
}

export default FeedbackSubmitPage;
