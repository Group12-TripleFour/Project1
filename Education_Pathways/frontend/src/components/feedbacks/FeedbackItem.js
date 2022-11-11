import { useContext } from 'react';

import classes from './FeedbackItem.module.css';
import Card from './Card'
import FavoritesContext from '../favorites-context';

function FeedbackItem(props) {
  const favouritesCtx = useContext(FavoritesContext);
  const itemIsFavourite = favouritesCtx.itemIsFavorite(props.coursename);
  
  function toggleFavoriteStatusHandler(){
    if (itemIsFavourite){
      favouritesCtx.removeFavorite(props.coursename);
    }else{
      favouritesCtx.addFavorite({
        coursename:props.coursename,
        workload:props.workload,
        complexity:props.complexity,
        usefulness:props.usefulness
      });
    }
  }

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
          <button onClick={toggleFavoriteStatusHandler}>
            {itemIsFavourite ? 'Remove' : 'Add'}
          </button>
        </div>
      </Card>
    </li>
  );
}

export default FeedbackItem;