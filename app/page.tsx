"use client";
import { useEffect, useRef, MutableRefObject, useState } from "react";
// import { supabase } from "../db/supabaseClient";
// import { Tables } from "../db/database.types";
import { SVG, Container } from "@svgdotjs/svg.js"; // Import Container for typing
import { mockPlayers } from "./mockPlayers";

export default function Home() {
  const [rounds, setRounds] = useState<number>();
  // const [matches, setMatches] = useState<Tables<"matches">[]>();
  // const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<HTMLDivElement | null>(null); // Reference for the SVG container
  const drawRef = useRef<Container | null>(null); // Use Container type from svg.js
  const svgWidth = 1800;
  const svgHeight = 900;

  useEffect(() => {
    setRounds(3);
  }, []);

  // function generateRandomString(n: number): string {
  //   const characters =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   let result = "";
  //   const charactersLength = characters.length;

  //   for (let i = 0; i < n; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }

  //   return result;
  // }

  function getRandomPlayer() {
    return mockPlayers[Math.floor(Math.random() * mockPlayers.length)];
  }


  function drawPlayerLine(
    draw: MutableRefObject<Container | null>,
    xStart: number,
    yStart: number,
    horizontalLength: number,
    username: string,
    profileImage: string,
    move: number
  ) {
    if (!draw.current) return;

    console.log(profileImage, move);

    draw.current
      .line(xStart, yStart, xStart + horizontalLength, yStart)
      .stroke({ width: 2, color: "#e59eff" });

    // Calculate the center of the line for text placement
    const textSize = horizontalLength / 12;
    const textX = xStart + horizontalLength / 2;
    const textY = yStart - 0.7 * textSize; // Slightly above the line, adjust as necessary

    // Add the text and center it
    draw.current.text(username)
    .move(textX, textY)
    .font({ size: textSize, anchor: 'middle', fill: "#e59eff" })
    .center(textX, textY); // Center the text on the horizontal line
  }

  function drawVerticalLine(
    draw: MutableRefObject<Container | null>,
    xStart: number,
    yStart: number,
    verticalLength: number
  ) {
    if (!draw.current) return;

    draw.current
      .line(xStart, yStart, xStart, yStart + verticalLength)
      .stroke({ width: 2, color: "#e59eff" });
  }


  // useEffect(() => {
  //   const fetchRounds = async () => {
  //     try {
  //       const gameId = 6; // Example game ID

  //       // Query the database using Supabase client-side
  //       const { data, error } = await supabase
  //         .from("rounds")
  //         .select("*")
  //         .eq("game_id", gameId);

  //       if (error) {
  //         throw new Error(error.message);
  //       }
  //       console.log("round count: ", data.length);
  //       setRounds(4);
  //     } catch (err) {
  //       setError((err as Error).message);
  //     }
  //   };

  //   const fetchMatches = async () => {
  //     try {
  //       const gameId = 7; // Example game ID

  //       // Query the database using Supabase client-side
  //       const { data, error } = await supabase
  //         .from("matches")
  //         .select("*")
  //         .eq("game_id", gameId)
  //         .order("round_id", { ascending: true });

  //       if (error) {
  //         throw new Error(error.message);
  //       }

  //       setMatches(data || []);
  //     } catch (err) {
  //       setError((err as Error).message);
  //     }
  //   };

  //   fetchRounds();
  //   fetchMatches();
  // }, []);

  useEffect(() => {
    if (svgRef.current) {
      if (drawRef.current) {
        drawRef.current.clear();
      } else {
        drawRef.current = SVG()
          .addTo(svgRef.current)
          .size(`${svgWidth}px`, `${svgHeight}px`);
      }

      if (drawRef.current && rounds) {
        drawRef.current.rect("100%", "100%").fill("#2f0040"); // Updated background color

        const numberOfLines = rounds * 2;
        const matchWidth = svgWidth / (numberOfLines + 2);
        let yStart = 50; // Use this to set y margin

        for (let round = 1; round < rounds; round++) {
          console.log("--------");
          const matchesEachSide = 2 ** (rounds - round) / 2;
          const matchHeight =
            (svgHeight - yStart * 2) / (matchesEachSide * 2 - 1);
          const xLeftLeft = (round - 1) * matchWidth;
          const xLeftRight = xLeftLeft + matchWidth;

          const xRightRight = svgWidth - (round - 1) * matchWidth;
          const xRightLeft = xRightRight - matchWidth;

          // Draw matches on left side of bracket
          for (let match = 1; match <= matchesEachSide; match++) {
            const y = 2 * matchHeight * (match - 1) + yStart;

            // draw top line of match
            const player1 = getRandomPlayer();
            drawPlayerLine(drawRef, xLeftLeft, y, matchWidth, player1.username, player1.image, 0);

            // draw bottom line of match
            const player2 = getRandomPlayer();
            drawPlayerLine(drawRef, xLeftLeft, y + matchHeight, matchWidth, player2.username, player2.image, 0);

            // draw connecting line of match
            drawVerticalLine(drawRef, xLeftRight, y, matchHeight);
          }

          // Draw matches on right side of bracket
          for (let match = 1; match <= matchesEachSide; match++) {
            // console.log("player: ", player);
            const y = 2 * matchHeight * (match - 1) + yStart;
            // console.log("y: ", y);

            // draw top line of match
            const player1 = getRandomPlayer();
            drawPlayerLine(drawRef, xRightLeft, y, matchWidth, player1.username, player1.image, 0);

            // draw bottom line of match
            const player2 = getRandomPlayer();
            drawPlayerLine(drawRef, xRightLeft, y + matchHeight, matchWidth, player2.username, player2.image, 0);

            // draw connecting line of match
            drawVerticalLine(drawRef, xRightLeft, y, matchHeight);
          }

          yStart += matchHeight / 2;
        }

        // Draw left side of final match
        const player1 = getRandomPlayer();
        drawPlayerLine(drawRef, (rounds - 1) * matchWidth, svgHeight/2, matchWidth, player1.username, player1.image, 0);

        // Draw right side of final match
        const player2 = getRandomPlayer();
        drawPlayerLine(drawRef, (rounds + 2) * matchWidth, svgHeight/2, matchWidth, player2.username, player2.image, 0);

        // Draw winner box
        const winnerBoxHeight = svgHeight / 6;
        drawRef.current
          .rect(matchWidth * 2, winnerBoxHeight)
          .move(rounds * matchWidth, svgHeight / 2 - winnerBoxHeight / 2) // Position the box at xLeft and y
          .fill("none")
          .stroke({ width: 2, color: "#e59eff" }); // Updated stroke color
      }
    }
  }, [rounds]);

  return (
    <div>
      {/* <h1>Match Bracket</h1>
      {error && <p>{error}</p>}
      {!matches ? (
        <p>Loading matches...</p>
      ) : matches.length > 0 ? ( */}
        <div ref={svgRef}></div>  {/* SVG container for the bracket */}
      {/* ) : (
        <p>No matches found</p>
      )} */}
    </div>
  );
}
