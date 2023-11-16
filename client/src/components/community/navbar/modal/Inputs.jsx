import { useState } from 'react';
import CategoryInput from './form/CategoryInput';
import EmbedsInput from './form/EmbedsInput';

const Inputs = ({ currPage, setCurrPage, setShowModal }) => {
    let content;
    const [initialServer, setInitialServer] = useState({
      server_category: "",
      title: "",
      description: "",
      thumbnail: "",
    });

    const handleInputs = (e) => {
      const inputValue = e.target.value;
      const btnValue = e.target.innerText.toLowerCase();
      const name = e.target.getAttribute('name');

      let value;

      if (name == "server_category") {
        value = btnValue;
      } else {
        value = inputValue;
      }

      setInitialServer((prev) => {
        return {
          ...prev,
          [name]: value
        }
      });
    };

    if (currPage === 0) {
        content = (
          <CategoryInput
            handleInputs={handleInputs}
            setCurrPage={setCurrPage}
          />
        );
    } else if (currPage === 1) {
        content = (
          <EmbedsInput
            handleInputs={handleInputs}
            setCurrPage={setCurrPage}
            setShowModal={setShowModal}
            initialServer={initialServer}
            setInitialServer={setInitialServer}
          />
        );
    }

  return (
    <div className="serverModalInputs">
        {content}
    </div>
  )
}

export default Inputs
