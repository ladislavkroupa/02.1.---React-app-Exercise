import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './Profile.tsx';
import Navbar from './Navbar.tsx';

export default function Home() {




  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<h1>SDS</h1>} />
      </Routes>
    </Router>
  )
}