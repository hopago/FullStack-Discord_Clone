import CategoryInput from './form/CategoryInput';
import EmbedsInput from './form/EmbedsInput';

const Inputs = ({ currPage, setCurrPage }) => {
    let content;

    if (currPage === 0) {
        content = <CategoryInput currPage={currPage} setCurrPage={setCurrPage} />
    } else if (currPage === 1) {
        content = <EmbedsInput />
    }

  return (
    <div className="serverModalInputs">
        {content}
    </div>
  )
}

export default Inputs
