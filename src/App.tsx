import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PokemonGrid from './components/PokemonGrid';
import PokemonDetail from './pages/PokemonDetail';
import Items from './pages/Items';
import Quiz from './pages/Quiz';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PokemonGrid />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/items" element={<Items />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<div className="about-page">
          <h1>About PokePortfolio</h1>
          <p>This is a robust Pokemon explorer built with React 19, Vite, and PokeAPI.</p>
          <p>Features include advanced search, evolution chains, move details, and an items database.</p>
        </div>} />
      </Routes>
    </Layout>
  );
}

export default App;
