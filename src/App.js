import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import './App.css';
import html2canvas from "html2canvas";

function App() {
  const fonts = ['Arial', 'Helvetica', 'Verdana', 'Times New Roman'];

  const [texts, setTexts] = useState(
    ["The sun shone brightly in the clear blue sky, warming the earth below.",
      "She walked along the winding path, surrounded by towering trees and the sound of chirping birds.",
      "As night fell, the stars twinkled in the velvety darkness, casting a magical glow over the sleeping countryside."],
  );
  const [xs, setXs] = useState([0, 0, 0])
  const [ys, setYs] = useState([0, 0, 0])
  const [selected, setSelected] = useState(-1);
  const [selectedText, setSelectedText] = useState("")
  const [selectedFontSize, setSelectedFontSize] = useState(12)
  const [selectedFontFamily, setSelectedFontFamily] = useState('Arial')
  const [fontSizes, setFontSizes] = useState([12, 12, 12])
  const [fontFamilies, setFontFamilies] = useState(['Arial', 'Arial', 'Arial']);
  const [selectedImage, setSelectedImage] = useState(null);
  const canvasRef = useRef(null);
  const imageInputRef = useRef(null);

  const setX = (index, x) => {
    const newXs = [...xs]
    newXs[index] = x
    setXs(newXs)
  }

  const setY = (index, y) => {
    const newYs = [...ys]
    newYs[index] = y
    setYs(newYs)
  }

  const addText = () => {
    const newTexts = [...texts]
    newTexts.push("Add Text")
    setTexts(newTexts)

    const newXs = [...xs]
    newXs.push(0);
    setXs(newXs);

    const newYs = [...ys]
    newYs.push(0);
    setYs(newYs);

    const newFontSizes = [...fontSizes];
    newFontSizes.push(12);
    setFontSizes(newFontSizes);

    const newFontFamilies = [...fontFamilies];
    newFontFamilies.push('Arial');
    setFontFamilies(newFontFamilies);
  }

  const changeSelectedText = (newText) => {
    const newTexts = [...texts]
    newTexts[selected] = newText;
    setTexts(newTexts)
    setSelectedText(newText)
  }

  const changeSelectedFontSize = (newFontSize) => {
    const newFontSizes = [...fontSizes]
    newFontSizes[selected] = newFontSize;
    setFontSizes(newFontSizes)
    setSelectedFontSize(newFontSize)
  }

  const changeSelectedFontFamily = (newFontFamily) => {
    const newFontFamilies = [...fontFamilies]
    newFontFamilies[selected] = newFontFamily;
    setFontFamilies(newFontFamilies)
    setSelectedFontFamily(newFontFamily)
  }

  const importImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      setSelectedImage(event.target.result);
    };

    reader.readAsDataURL(file);
  }

  const exportImage = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = img;
      link.download = "merged_image.png";
      link.click();
    });
  };

  return (
    <div className="App">
      <div className="flex">
        <div id="left-sidebar">
          <input type="file" accept="image/*" ref={imageInputRef} onChange={importImage} />
          <button onClick={addText}>Add Text</button>
          <textarea value={selectedText} onChange={(e) => changeSelectedText(e.target.value)} rows={10} />
          <p>Font Size</p>
          <input value={selectedFontSize} onChange={(e) => changeSelectedFontSize(e.target.value)} type="number" min={12}></input>
          <p>Font Family</p>
          <select value={selectedFontFamily} onChange={(e) => changeSelectedFontFamily(e.target.value)}>
            {fonts.map((font, index) => (
              <option key={index} value={font}>{font}</option>
            ))}
          </select>
          <button onClick={exportImage}>Export Image</button>
        </div>
        <div className="canvas" ref={canvasRef}>
          {selectedImage && <img src={selectedImage} style={{ width: '100%', height: '100%' }} />}
          {texts.map((text, index) => (
            <Rnd
              default={{
                x: 0,
                y: 0,
                width: "auto",
                height: "auto",
              }}
              position={{ x: xs[index], y: ys[index] }}
              onDragStop={(e, d) => {
                setX(index, d.x);
                setY(index, d.y);
              }}
              onMouseDown={() => {
                setSelected(index);
                setSelectedText(text);
                setSelectedFontSize(fontSizes[index])
                setSelectedFontFamily(fontFamilies[index])
              }}
              enableResizing={false}
              key={index}
              bounds={".canvas"}
            >
              <p style={{
                fontSize: `${fontSizes[index]}px`,
                fontFamily: fontFamilies[index]
              }}>{text}</p>
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
