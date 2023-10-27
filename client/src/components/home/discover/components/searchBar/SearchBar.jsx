import './scss/searchBar.scss';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  return (
    <div className="searchBar">
        <div className="searchBarWrapper">
            <input type="text" placeholder='서버 검색' />
        </div>
        <button>
            <SearchIcon />
        </button>
    </div>
  )
}

export default SearchBar
