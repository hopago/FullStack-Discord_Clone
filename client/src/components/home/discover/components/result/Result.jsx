import { useState } from "react";
import { serverResults } from "../../utils/data"
import './scss/result.scss';
import CheckIcon from '@mui/icons-material/Check';
import Pagination from 'react-js-pagination';

const Result = () => {
  const [page, setPage] = useState(1);
  const itemsCountPerPage = 10;
  const totalItemsCount = serverResults?.length;
  const pageRangeDisplayed = 5;

  const handlePageChange = (page) => {
    setPage(page);
  };

  const pagination = (
    <Pagination
      activePage={page}
      itemsCountPerPage={itemsCountPerPage}
      totalItemsCount={totalItemsCount}
      pageRangeDisplayed={pageRangeDisplayed}
      prevPageText={"Back"}
      nextPageText={"Next"}
      onChange={handlePageChange}
    />
  );

  return (
    <div className="result">
      {serverResults
        .slice((page - 1) * itemsCountPerPage, page * itemsCountPerPage)
        .map((server) => (
          <div className="resultItem" key={server.title}>
            <img src={server.img} alt="" />
            <div className="col">
              <div className="serverInfo">
                <span className="result-title">{server.title}</span>
                <p>{server.desc}</p>
                <div className="memberCount">
                  <span className="result-users">
                    {server.users}&nbsp;Members
                  </span>
                  &nbsp;<span>•</span>&nbsp;
                  <span className="result-liked">
                    {server.liked}&nbsp;Liked
                  </span>
                </div>
              </div>
              {server.isVerified && (
                <div className="isVerified">
                  <CheckIcon style={{ fontSize: "17px", color: "#23A559" }} />
                  <span>VERIFIED</span>
                </div>
              )}
            </div>
          </div>
        ))}
      <nav>{pagination}</nav>
    </div>
  );
}

export default Result
