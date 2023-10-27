import SearchIcon from '@mui/icons-material/Search';
import './scss/supportHero.scss';

const SupportHero = () => {
  return (
    <div className="supportHero">
        <h1>고객센터</h1>
        <div className="support-SearchBar">
            <SearchIcon />
            <input type="text" placeholder='검색' />
        </div>
    </div>
  )
}

export default SupportHero
