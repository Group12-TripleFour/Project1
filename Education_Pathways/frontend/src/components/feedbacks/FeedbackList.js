import FeedbackItem from './FeedbackItem';
import classes from './FeedbackList.module.css';

function FeedbackList(props){
    return (
        <ul className={classes.list}>
            <h3>Feedback</h3>
          {props.feedbacks.map((feedback) => (
            <FeedbackItem
              key={feedback.coursename}
              coursename={feedback.coursename}
              workload={feedback.workload}
              complexity={feedback.complexity}
              usefulness={feedback.usefulness}
            />
          ))}
        </ul>
      );
}

export default FeedbackList;