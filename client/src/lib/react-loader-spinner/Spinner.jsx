import * as Loader from "react-loader-spinner";
import './spinner.scss';

const Spinner = ({ message }) => {
  return (
    <div className='spinner'>
      <Loader.Circles
        type="Circles"
        color="#1E1F22"
        height={50}
        width={200}
        className="circular"
      />
      <p>{message}</p>
    </div>
  )
}

export default Spinner