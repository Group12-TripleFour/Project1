import FeedbackList from './feedbacks/FeedbackList';
import { useContext } from 'react';
import FavoritesContext from './favorites-context';

function Comparison() {
  const favoritesCtx = useContext(FavoritesContext);

  let content;

  if (favoritesCtx.totalFavorites === 0) {
    content = <p>You got nothing to compare yet. Start adding some?</p>;
  } else {
    content = <FeedbackList feedbacks={favoritesCtx.favorites} />;
  }
  
  return (
    <section>
      <h1>My Courses</h1>
      {content}
    </section>
  );
}

export default Comparison;