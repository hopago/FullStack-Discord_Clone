import './reactionButtons.scss';
import { reactionEmoji } from '../constants';
import './reactionButtons.scss';
import { useLikePostMutation } from '../../../../../../../features/post/slice/postsApiSlice';
import { useEffect, useState } from 'react';
import { selectCurrentUser } from '../../../../../../../features/users/slice/userSlice';
import { useSelector } from 'react-redux';

const ReactionButtons = ({ post }) => {
    const currentUser = useSelector(selectCurrentUser);
    const parameters = {
      initialPost: post,
      currentUser
    };

    const [addReaction] = useLikePostMutation();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
          <button
            key={name}
            type="button"
            className="reactionButton"
            onClick={() => {
              addReaction({ ...parameters, reactionName: name });
            }}
          >
            {emoji}&nbsp;
            {Array.isArray(post.reactions[name]) &&
              post.reactions[name].length > 1 &&
              post.reactions[name].length - 1}
          </button>
        );
    })

  return (
    <div className="reactionButtons">
        {reactionButtons}
    </div>
  )
}

export default ReactionButtons
