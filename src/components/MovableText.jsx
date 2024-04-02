import { Rnd } from "react-rnd";

function MovableText({ text, x, y, setX, setY }) {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: "auto",
        height: "auto",
      }}
      position={{ x: x, y: y }}
      onDragStop={(e, d) => {
        setX(d.x);
        setY(d.y);
      }}
      enableResizing={false}
      style={{
        border: "1px solid black",
        padding: 5,
      }}
    >
      <p>{text}</p>
    </Rnd>
  );
}

export default MovableText;
