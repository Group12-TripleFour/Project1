import classes from './FeedbackItem.module.css';
import Card from './Card'

function FeedbackItem(props) {

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.content}> 
            <label>Course Code</label>
            <p>{props.coursename}</p> 
            <label>Workload</label>
            <p>{props.workload}</p>
            <label>Complexity</label>
            <p>{props.complexity}</p>
            <label>Usefulness</label>
            <p>{props.usefulness}</p>
        </div>
        <div className={classes.actions}>
          <button /*onClick={toggleFavoriteStatusHandler}*/>
            {/*itemIsFavorite ? 'Remove from Favorites' : 'To Favorites'*/}
            add to favorite
          </button>
        </div>
      </Card>
    </li>
  );
}

export default FeedbackItem;