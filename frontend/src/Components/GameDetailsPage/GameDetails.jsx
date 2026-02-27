import { RestaurantRounded } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GameCoverAndTrailer } from "./GameCover";
import { GameStory } from "./GameStory";
import { GameAbout } from "./GameAbout";
import { GameMedia } from "./GameMedia";
import { SimilarGames } from "./SimilarGames";


// here is the main menu to show the game alone in one page with all the informations it has

export function GameDetails(){
    const { query } = useParams()
    const {id} = useParams()
    const [game, setGames] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/game/${id}`)
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
        console.log(data)
      });
  }, [id]);

  




    if (loading || !game) return <p style={{ color: "white" }}>Loading...</p>;
    return(
    <>
      <GameCoverAndTrailer key={game.id} game = {game}/>
      <GameStory  game = {game}/>
      <br />
      <br />
      <GameAbout game = {game}/>
      <br />
      <GameMedia game = {game} />
      <br /><br />
      <SimilarGames game = {game} />
    </>
    
    )
} 