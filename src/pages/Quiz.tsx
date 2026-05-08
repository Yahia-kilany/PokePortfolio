import { useState, useEffect, useCallback } from "react";
import {
  fetchPokemon,
  fetchPokemonList,
  type PokemonStats,
} from "../services/pokeApi";

import {
  Volume2,
  RotateCcw,
  Trophy,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import "./Quiz.css";

export default function Quiz() {
  const [targetPokemon, setTargetPokemon] = useState<PokemonStats | null>(null);

  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const startNewRound = useCallback(async () => {
    try {
      setLoading(true);

      const list = await fetchPokemonList(0, 1025);

      const randomEntry =
        list.results[Math.floor(Math.random() * list.results.length)];

      const details = await fetchPokemon(randomEntry.name);

      setTargetPokemon(details);

      // Reset round state
      setRevealed(false);
      setGuess("");
      setFeedback(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void startNewRound();
  }, [startNewRound]);

  const handleGuess = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (revealed || !targetPokemon) return;

    const isCorrect =
      guess.toLowerCase().trim() === targetPokemon.name.toLowerCase();

    setRevealed(true);

    if (isCorrect) {
      setFeedback("correct");

      setScore((prev) => {
        const newScore = prev + 1;

        setBestStreak((best) => (newScore > best ? newScore : best));

        return newScore;
      });
    } else {
      setFeedback("incorrect");
      setScore(0);
    }
  };

  const playCry = () => {
    if (targetPokemon?.cries?.latest) {
      new Audio(targetPokemon.cries.latest).play();
    }
  };

  if (loading && !targetPokemon) {
    return <div className="loading">Preparing the challenge...</div>;
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div className="score-badge">
          <Trophy size={20} />

          <span>
            Streak: <strong>{score}</strong>
          </span>

          <span className="best-score">Best: {bestStreak}</span>
        </div>

        <h1>Who's That Pokemon?</h1>
      </div>

      <div className="quiz-container">
        <div className={`pokemon-silhouette-box ${revealed ? "revealed" : ""}`}>
          {targetPokemon && (
            <img
              src={targetPokemon.image}
              alt="Guess the pokemon"
              className="silhouette-image"
            />
          )}

          {!revealed && (
            <button onClick={playCry} className="hint-button" title="Hear Hint">
              <Volume2 size={32} />
              <span>Listen for a hint</span>
            </button>
          )}
        </div>

        <form onSubmit={handleGuess} className="quiz-controls">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter Pokemon name..."
            disabled={revealed}
            className="quiz-input"
            autoFocus
          />

          {!revealed ? (
            <button type="submit" className="guess-button">
              Guess!
            </button>
          ) : (
            <button
              type="button"
              onClick={startNewRound}
              className="next-button"
            >
              <RotateCcw size={20} />
              Try Another
            </button>
          )}
        </form>

        {feedback && (
          <div className={`feedback-message ${feedback}`}>
            {feedback === "correct" ? (
              <>
                <CheckCircle2 />
                Correct! It's {targetPokemon?.name}!
              </>
            ) : (
              <>
                <XCircle />
                It's {targetPokemon?.name}!
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
