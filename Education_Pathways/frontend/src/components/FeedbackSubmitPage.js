/* 
This file creates the page for users to submit the feedback. 
It simply holds the another component <NewFeedbackForm> and a submit handler who sends data to the database and redirect the page after submission.
*/

import { useHistory } from 'react-router-dom';
import NewFeedbackForm from './feedbacks/NewFeedbackForm';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push  } from "firebase/database";

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
      //adds the review to the database
      set(push(ref(database, 'feedback/' + feedback.coursename + '/')), {
        workload: feedback.workload,
        complexity: feedback.complexity,
        usefulness: feedback.usefulness
      }
      ).then(()=>{
        alert('You have been submitted successfully!')
        history.replace('/review')
      });
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
