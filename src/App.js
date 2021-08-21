import { useState, useEffect } from "react";
import { Params } from "./Params";
import Cards from "./Cards";

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export default function App() {
  const [score, setScore] = useState(0);
  const [start, setStart] = useState(true);
  const [token, setToken] = useState("");
  const [indexes, setIndexes] = useState(shuffleArray([...Array(200).keys()]));
  const [i1, seti1] = useState(indexes.pop());
  const [i2, seti2] = useState(indexes.pop());
  const spotify = Params();
  useEffect(() => {
    fetch("https://accounts.spotify.com/api/token", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(spotify.ClientId + ":" + spotify.ClientSecret),
      },
      body: "grant_type=client_credentials",
      method: "POST",
    })
      .then((resp) => resp.json())
      .then((data) => {
        setToken(data.access_token);
      });
  }, [spotify.ClientId, spotify.ClientSecret]);

  const newSongs = () => {
    seti1(indexes.pop());
    seti2(indexes.pop());
  };

  const restart = () => {
    setStart(true);
    setIndexes(shuffleArray([...Array(200).keys()]));
    newSongs();
    setScore(0);
  };

  const getSongCover = async (id) => {
    const result = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: "Bearer " + token },
      method: "GET",
    });
    const data = await result.json();
    console.log(data.album.images[0]);
    return data.album.images[0].url;
  };
  if (!start) {
    return (
      <div id="main">
        <div id="score">Score: {score}</div>
        <p>Which song has more streams?</p>
        <Cards
          i1={i1}
          i2={i2}
          increaseScore={() => setScore((curr) => curr + 1)}
          newSongs={newSongs}
          score={score}
          restart={restart}
          getSongCover={getSongCover}
        />
        {indexes.length < 2 && (
          <span className="final">
            No more songs left :( <br /> Refresh to play again.
          </span>
        )}
      </div>
    );
  } else {
    return (
      <div id="main">
        <h1 id="title">HoLify</h1>
        <p>Guess which Spotify song has more streams?</p>
        <span className="start" onClick={() => setStart(false)}>
          Start
        </span>
      </div>
    );
  }
}
