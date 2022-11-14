import Card from './Card';
import { useRef } from 'react';
import { useState } from 'react';
import classes from './NewFeedbackForm.module.css'

const options = ["Low", "Medium", "High"];


function NewFeedbackForm(props) {
    const CoursenameInputRef = useRef();
    const [currentWorkload, setCurrentWorkload] = useState(options[0]);
    const [currentComplexity,setCurrentComplexity] = useState(options[0]);
    const UsefulnessInputRef = useRef();
  
    function submitHandler(event) {
      event.preventDefault();
  
      const enteredCoursename = CoursenameInputRef.current.value;
      const enteredWorkload = currentWorkload;
      const enteredComplexity = currentComplexity;
      const enteredUsefulness = UsefulnessInputRef.current.value;
  
      const feedbackData = {
        coursename: enteredCoursename,
        workload: enteredWorkload,
        complexity: enteredComplexity,
        usefulness: enteredUsefulness,
      };
  
      props.onAddFeedback(feedbackData);
    }
  
    return (
      <Card>
        <form className={classes.form} onSubmit={submitHandler}>
          <div className={classes.control}>
            <label className={classes.label}>Course Code</label>
            <input type='text' required id='coursename' ref={CoursenameInputRef} />
          </div>
          <div className={classes.control}>
            <label className={classes.label}>Workload</label>
            <select 
                value={currentWorkload} 
                onChange={(e) => setCurrentWorkload(e.target.value)}>
                    {options.map((value) => (
                    <option value={value} key={value}>
                        {value}
                    </option>))}
            </select>
          </div>
          <div className={classes.control}>
            <label className={classes.label}>Complexity</label>
            <select 
                value={currentComplexity} 
                onChange={(e) => setCurrentComplexity(e.target.value)}>
                    {options.map((value) => (
                    <option value={value} key={value}>
                        {value}
                    </option>))}
            </select>
          </div>
          <div className={classes.control}>
            <label className={classes.label}>Usefulness</label>
            <textarea
              id='usefulness'
              required
              rows='5'
              ref={UsefulnessInputRef}
            ></textarea>
          </div>
          <div className={classes.actions}>
            <button>Add Feedback</button>
          </div>
        </form>
      </Card>
    );
  }
  
  export default NewFeedbackForm;