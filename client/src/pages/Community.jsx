import { Route, Routes } from 'react-router-dom';
import { 
    CommunityNavbar, 
    Base,
} from '../components';
import './scss/community.scss';
import { useState } from 'react';

const Community = () => {
  return (
    <div className="community">
      <CommunityNavbar />
      <Routes>
        <Route path="/*" element={<Base />} />
      </Routes>
    </div>
  );
}

export default Community
