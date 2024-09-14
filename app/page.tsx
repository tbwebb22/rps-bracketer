"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../db/supabaseClient";
import { Tables } from "../db/database.types";
import { SVG, Container } from "@svgdotjs/svg.js"; // Import Container for typing

export default function Home() {
  const [rounds, setRounds] = useState<number>();
  const [matches, setMatches] = useState<Tables<"matches">[]>();
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<HTMLDivElement | null>(null); // Reference for the SVG container
  const drawRef = useRef<Container | null>(null); // Use Container type from svg.js
  const svgWidth = 1200;
  const svgHeight = 600;


  function generateRandomString(n: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }

  useEffect(() => {



    const fetchRounds = async () => {
      try {
        const gameId = 7; // Example game ID

        // Query the database using Supabase client-side
        const { data, error } = await supabase
          .from("rounds")
          .select("*")
          .eq("game_id", gameId);

        if (error) {
          throw new Error(error.message);
        }
        console.log("round count: ", data.length);
        setRounds(4);
      } catch (err) {
        setError((err as Error).message);
      }
    };

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

    fetchRounds();
    fetchMatches();
  }, []);

  useEffect(() => {
    if (matches && svgRef.current) {
      // Clear existing SVG to prevent duplicates
      if (drawRef.current) {
        drawRef.current.clear(); // Clear the existing SVG before drawing new elements
      } else {
        drawRef.current = SVG()
          .addTo(svgRef.current)
          .size(`${svgWidth}px`, `${svgHeight}px`); // Initialize the svg.js instance only once
      }

      if (drawRef.current && rounds) {
        drawRef.current.rect("100%", "100%").fill("#f0f0f0"); // Draw rectangle as background

        const numberOfLines = rounds * 2;
        const matchWidth = svgWidth / (numberOfLines + 2);
        const fontSize = svgWidth / 100;
        let yStart = 50; // Use this to set y margin

        for (let round = 1; round < rounds; round++) {
          console.log("--------");
          const matchesEachSide = 2**(rounds - round) / 2;
          const matchHeight = (svgHeight - yStart*2) / (matchesEachSide*2 - 1);
          const xLeftLeft = (round - 1) * matchWidth;
          const xLeftRight = xLeftLeft + matchWidth;

          const xRightRight = svgWidth - (round - 1) * matchWidth;
          const xRightLeft = xRightRight - matchWidth;

          console.log("round: ", round);
          console.log("matchHeight: ", matchHeight);

          // Draw matches on left side of bracket
          for (let match = 1; match <= matchesEachSide; match++) {
            // console.log("player: ", player);
            const y = 2 * matchHeight * (match-1) + yStart;
            // console.log("y: ", y);

            // draw top line of match
            drawRef.current
              .line(xLeftLeft, y, xLeftRight, y)
              .stroke({ width: 2, color: '#000000' });

            // Add username for top match player
            drawRef.current.text(generateRandomString(10))
              .move(xLeftLeft + 10, y - (1.5 * fontSize)) // Position the text in the center of the SVG
              .font({ size: fontSize, fill: '#000000', family: 'Arial' }); // Customize font size, color, and family

            // draw bottom line of match
            drawRef.current
            .line(xLeftLeft, y + matchHeight, xLeftRight, y + matchHeight)
            .stroke({ width: 2, color: '#000000' });

            // Add username for bottom match player
            drawRef.current.text(generateRandomString(10))
            .move(xLeftLeft + 10, y + matchHeight - (1.5 * fontSize)) // Position the text in the center of the SVG
            .font({ size: fontSize, fill: '#000000', family: 'Arial' }); // Customize font size, color, and family

            // draw connecting line of match
            drawRef.current
            .line(xLeftRight, y, xLeftRight, y + matchHeight)
            .stroke({ width: 2, color: '#000000' });
          }

          // Draw matches on right side of bracket
          for (let match = 1; match <= matchesEachSide; match++) {
            // console.log("player: ", player);
            const y = 2 * matchHeight * (match-1) + yStart;
            // console.log("y: ", y);

            // draw top line of match
            drawRef.current
              .line(xRightLeft, y, xRightRight, y)
              .stroke({ width: 2, color: '#000000' });

            // Add username for top match player
            drawRef.current.text(generateRandomString(10))
            .move(xRightLeft + 10, y - (1.5 * fontSize)) // Position the text in the center of the SVG
            .font({ size: fontSize, fill: '#000000', family: 'Arial' }); // Customize font size, color, and family

            // draw bottom line of match
            drawRef.current
            .line(xRightLeft, y + matchHeight, xRightRight, y + matchHeight)
            .stroke({ width: 2, color: '#000000' });

            // Add username for bottom match player
            drawRef.current.text(generateRandomString(10))
            .move(xRightLeft + 10, y + matchHeight - (1.5 * fontSize)) // Position the text in the center of the SVG
            .font({ size: fontSize, fill: '#000000', family: 'Arial' }); // Customize font size, color, and family

            // draw connecting line of match
            drawRef.current
            .line(xRightLeft, y, xRightLeft, y + matchHeight)
            .stroke({ width: 2, color: '#000000' });
          }

          yStart += matchHeight/2;
        }

        // Draw left side of final match
        drawRef.current
          .line((rounds-1) * matchWidth, svgHeight / 2, rounds * matchWidth, svgHeight / 2)
          .stroke({ width: 2, color: '#000000' });

        // Draw right side of final match
        drawRef.current
        .line((rounds+2) * matchWidth, svgHeight / 2, (rounds + 3) * matchWidth, svgHeight / 2)
        .stroke({ width: 2, color: '#000000' });

        // Draw winner box
        const winnerBoxHeight = svgHeight / 6;
        drawRef.current
          .rect(matchWidth * 2, winnerBoxHeight)
          .move(rounds * matchWidth, (svgHeight / 2) - (winnerBoxHeight / 2)) // Position the box at xLeft and y
          .fill('none')
          .stroke({ width: 2, color: '#000000' }); // Black stroke with width 2
      }
    }
  }, [matches, rounds]);

  return (
    <div>
      <h1>Match Bracket</h1>
      {error && <p>{error}</p>}
      {!matches ? (
        <p>Loading matches...</p>
      ) : matches.length > 0 ? (
        <div ref={svgRef}></div> // SVG container for the bracket
      ) : (
        <p>No matches found</p>
      )}
    </div>
  );
}
