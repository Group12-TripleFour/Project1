/* 
This file creates the page for users to submit the feedback. 
It simply holds the another component <NewFeedbackForm> and a submit handler who sends data to the database and redirect the page after submission.
*/

import { useHistory } from 'react-router-dom';
import NewFeedbackForm from './feedbacks/NewFeedbackForm';

function FeedbackSubmitPage(){
    const history = useHistory();

    function addFeedbackHandler(feedback){
      
      fetch('https://educationpathways-c37ec-default-rtdb.firebaseio.com/feedback.json',
      {
        method:'POST',
        body:JSON.stringify(feedback),
        header:{'Content-Type': 'application/json'}
      }
      ).then(()=>{
        history.replace('/')
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
