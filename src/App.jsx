import './App.css'
import TreeMap from './TreeMap'
import EmptyPage from './EmptyPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:numbers" element={<TreeMap />} />
        <Route path="/" element={<EmptyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
