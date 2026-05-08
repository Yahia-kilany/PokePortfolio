# PokePortfolio: High-Performance Pokemon Encyclopedia & Game Engine

A robust, Pokemon application built with **React 19**, **TypeScript**, and **Vite**. This project goes beyond a simple API browser, implementing a full suite of features including an interactive game engine, a paginated items database, and an advanced Pokedex with real-time audio and evolution mapping.

## Live Demo

(https://poke-portfolio-hazel.vercel.app/)

## 🛠️ Technical Implementation & Engineering Highlights

### 1. Data Orchestration & API Architecture

The application features a sophisticated service layer engineered to interface with the **PokeAPI**.

- **Type-Safe Services**: Every API response is strictly typed, ensuring a robust data flow and eliminating runtime errors.
- **Asynchronous Parallelism**: Utilizes `Promise.all` to fetch Pokemon stats, species metadata, and evolution chains concurrently, drastically reducing Time-to-Interactive (TTI).
- **Efficient Pagination**: Implements an offset-based "Load More" system to handle the 1,000+ entries without performance degradation or massive initial payloads.

### 2. State Management & Logic

- **Optimized Filtering**: Leverages `useMemo` for high-speed client-side search and sorting, ensuring the UI remains responsive even as the loaded dataset grows.
- **Game Engine Logic**: The "Who's That Pokemon?" quiz uses custom hooks to manage game states, including silhouette processing via CSS filters, score persistence, and dynamic audio hint injection.
- **Version-Controlled Lore**: A custom implementation that filters through thousands of flavor text entries to allow users to toggle between different game-version descriptions (e.g., _Red/Blue_ vs. _Scarlet/Violet_).

### 3. UI/UX Engineering

- **Interactive Move Tooltips**: A "Hover-for-Detail" system that lazy-loads specific move data (Power, Accuracy, Description) to keep the main detail view lightweight.
- **Dynamic Theming**: The UI contextually adapts its color palette based on the primary Pokemon type using CSS Variables and conditional rendering.
- **Multimedia Integration**: Seamless integration of high-fidelity official artwork and live `.ogg` audio cries.

### 4. Professional Workflow

- **Feature Branch Workflow**: Developed using independent branches for branding, engine logic, and the quiz system to simulate a professional collaborative environment.
- **Conventional Commits**: Adheres to the Conventional Commits standard to ensure a readable and professional project history.

## Project Structure

```text
src/
├── components/   # Modular UI components (Layout, Grid, Tooltips)
├── pages/        # High-level views (Pokedex, Items, Quiz)
├── services/     # Type-safe API integration layer
└── assets/       # Static branding and logo assets
```

## Getting Started

1. **Clone & Install**:
   ```bash
   git clone [your-repo-url]
   cd pokemon
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

**Built with PokeAPI • 2026**
