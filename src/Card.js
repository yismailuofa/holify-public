import { useEffect } from "react";

export default function Card({
  artist,
  title,
  img,
  streams,
  url,
  showStreams,
  onClick,
  correct,
}) {
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");
    for (let n of counters) {
      n.style.display = "initial";
      const updateCount = () => {
        const target = +n.getAttribute("data-target");
        const count = +n.innerText;
        const speed = 300;
        const inc = target / speed;
        if (count < target) {
          n.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 1);
        } else {
          n.innerText = target;
        }
      };
      updateCount();
    }
  }, [showStreams]);
  const borderColor = correct ? "card green" : "card red";
  return (
    <div className="cardWrapper">
      <div
        className={showStreams ? borderColor : "card black"}
        style={{ backgroundImage: `url(${img})` }}
        onClick={onClick}
      ></div>
      <a className="desc" href={url} target="_blank" rel="noreferrer">
        {title} - {artist}
      </a>
      {showStreams && (
        <p className="counter" data-target={streams}>
          0
        </p>
      )}
    </div>
  );
}
