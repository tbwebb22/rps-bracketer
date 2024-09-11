"use client";
import { useEffect, useState } from "react";
import { supabase } from "../db/supabaseClient";
import { Tables } from "../db/database.types";

export default function Home() {
  const [matches, setMatches] = useState<Tables<"matches">[]>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const gameId = 7; // Example game ID

        // Query the database using Supabase client-side
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .eq("game_id", gameId)
          .order("round_id", { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        setMatches(data || []);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <h1>Match List</h1>
      {error && <p>{error}</p>}
      {!matches ? ( // Handle loading state
        <p>Loading matches...</p>
      ) : matches.length > 0 ? (
        <ul>
          {matches.map((match) => (
            <li key={match.id}>
              Match ID: {match.id}, Player 1: {match.player1_id}, Player 2:{" "}
              {match.player2_id || "BYE"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches found</p>
      )}
    </div>
  );
}
