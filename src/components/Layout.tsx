import type { ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import { Search, Package, Info, Gamepad2 } from "lucide-react";
import pokemonlogo from "../assets/pokemon.png";
import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <img
              src={pokemonlogo}
              alt="PokePortfolio Logo"
              className="logo-image"
            />
            <span className="logo-text">PokePortfolio</span>
          </Link>
          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Search size={20} />
              <span>Pokedex</span>
            </NavLink>
            <NavLink
              to="/items"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Package size={20} />
              <span>Items</span>
            </NavLink>
            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Gamepad2 size={20} />
              <span>Quiz</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Info size={20} />
              <span>About</span>
            </NavLink>
          </div>
        </div>
      </nav>
      <main className="container">{children}</main>
      <footer className="footer">
        <p>Built with PokeAPI and React &bull; 2026</p>
      </footer>
    </div>
  );
}
