import './reactionButtons.scss';
import { reactionEmoji } from '../constants';
import './reactionButtons.scss';

const ReactionButtons = ({ post }) => {
    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button
              key={name}
              type='button'
              className='reactionButton'
              onClick={() =>
              {}
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
