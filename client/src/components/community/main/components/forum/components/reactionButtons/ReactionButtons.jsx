import './reactionButtons.scss';
import { useDispatch } from 'react-redux';
import { reactionAdded } from '../../../../../../../features/post/slice/postsSlice';
import { reactionEmoji } from '../constants';
import './reactionButtons.scss';

const ReactionButtons = ({ post }) => {
    const dispatch = useDispatch();

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
              key={name}
              type='button'
              className='reactionButton'
              onClick={() =>
                dispatch(reactionAdded({ postId: post._id, reaction: name }))
              }
            >
            {emoji}&nbsp;{post.reactions[name]}
            </button>
        )
    })

  return (
    <div className="reactionButtons">
        {reactionButtons}
    </div>
  )
}

export default ReactionButtons
