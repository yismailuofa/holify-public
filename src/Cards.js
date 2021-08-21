import Card from "./Card";
import NextButton from "./NextButton";
import { useState, useEffect } from "react";
import stats from "./jsondata8_12_2021.json";

export default function Cards({
  i1,
  i2,
  increaseScore,
  newSongs,
  score,
  restart,
  getSongCover,
}) {
  const [showStreams, setshowStreams] = useState(false);
  const [showNext, setshowNext] = useState(false);
  const [hasLost, sethasLost] = useState(false);
  const [leftImg, setleftImg] = useState(
    "https://cbdworship.com/assets/images/album_art/placeholder.png"
  );
  const [rightImg, setrightImg] = useState(
    "https://cbdworship.com/assets/images/album_art/placeholder.png"
  );
  const correctLeft = stats[i1].Streams > stats[i2].Streams;
  const correctRight = stats[i2].Streams > stats[i1].Streams;

  useEffect(() => {
    const getCovers = async () => {
      let url1 = await getSongCover(stats[i1].URL.split("/").pop());
      let url2 = await getSongCover(stats[i2].URL.split("/").pop());
      setleftImg(url1);
      setrightImg(url2);
    };
    getCovers();
  }, [i1, i2, getSongCover]);

  const handleClick = (correct) => {
    if (!showStreams) {
      setshowStreams(true);
      if (correct) {
        increaseScore();
        setshowNext(true);
      } else {
        sethasLost(true);
      }
    }
  };
  const handleNext = () => {
    newSongs();
    setshowStreams(false);
    setshowNext(false);
  };
  return (
    <div id="cardcontainer">
      <Card
        title={stats[i1]["Track Name"]}
        artist={stats[i1].Artist}
        url={stats[i1].URL}
        streams={stats[i1].Streams}
        img={leftImg}
        showStreams={showStreams}
        onClick={() => handleClick(correctLeft)}
        correct={correctLeft}
      />
      <Card
        title={stats[i2]["Track Name"]}
        artist={stats[i2].Artist}
        url={stats[i2].URL}
        streams={stats[i2].Streams}
        img={rightImg}
        showStreams={showStreams}
        onClick={() => handleClick(correctRight)}
        correct={correctRight}
      />
      <div className="break"></div>

      <NextButton
        onClick={handleNext}
        classes={showNext ? "next" : "next hide"}
      />

      <div className={hasLost ? "replay" : "replay hide"}>
        <p className="wrong">
          You got that one wrong :(
          <br />
          Your score was {score}.
        </p>
        <div className="again" onClick={restart}>
          Try Again
        </div>
      </div>
    </div>
  );
}
