import AddIcon from '@mui/icons-material/Add';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CreateIcon from '@mui/icons-material/Create';
import { IconButton, Tooltip, Button, Grid, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import './App.css';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const fonts = ['Arial', 'Helvetica', 'Verdana', 'Times New Roman'];

function App() {
  const [texts, setTexts] = useState([]);
  const [xs, setXs] = useState([])
  const [ys, setYs] = useState([])
  const [selected, setSelected] = useState(-1);
  const [selectedText, setSelectedText] = useState("")
  const [selectedFontSize, setSelectedFontSize] = useState(12)
  const [selectedFontFamily, setSelectedFontFamily] = useState('Arial')
  const [fontSizes, setFontSizes] = useState([])
  const [fontFamilies, setFontFamilies] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const canvasRef = useRef(null);
  const imageInputRef = useRef(null);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

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
      const img = new Image();
      img.onload = function () {
        const width = img.width;
        const height = img.height;
        setImageWidth(width);
        setImageHeight(height);
        setSelectedImage(event.target.result);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }

  const exportImage = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      // Create a new canvas to hold the cropped image
      const croppedCanvas = document.createElement('canvas');
      const croppedContext = croppedCanvas.getContext('2d');

      console.log(imageX, imageY, imageWidth, imageHeight)

      // Define the cropping dimensions
      const cropX = imageX;
      const cropY = imageY;
      const cropWidth = imageWidth;
      const cropHeight = imageHeight;

      // Set the dimensions of the cropped canvas
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      // Perform the cropping
      croppedContext.drawImage(
        canvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Convert the cropped canvas to a data URL and download it
      const img = croppedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = img;
      link.download = 'cropped_image.png';
      link.click();
    });
  };

  const createNew = () => {
    setTexts([]);
    setXs([]);
    setYs([]);
    setSelected(-1);
    setSelectedText("")
    setSelectedFontSize(12)
    setSelectedFontFamily('Arial')
    setFontSizes([])
    setFontFamilies([]);
    setSelectedImage(null);
    setImageX(0);
    setImageY(0);
    setImageWidth(0);
    setImageHeight(0);
  }

  return (
    <Grid className="App">
      <Stack style={{ height: '100vh' }}>
        <Stack spacing={2} p={2} direction="row" alignItems="center" justifyContent="space-around">
          <Tooltip title="Create New">
            <Button
              variant="contained"
              onClick={createNew}
            >
              <CreateIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Import Image">
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
            >
              <CloudUploadIcon />
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={importImage}
              />
            </Button>
          </Tooltip>
          <Tooltip title="Add Text">
            <Button
              variant="contained"
              onClick={addText}
            >
              <AddIcon />
            </Button>
          </Tooltip>

          <TextField
            id="outlined-multiline-static"
            label="Edit Text"
            rows={5}
            value={selectedText}
            onChange={(e) => changeSelectedText(e.target.value)}
            disabled={selected == -1}
          />
          <Typography>Size</Typography>
          <TextField
            id="outlined-number"
            type="number"
            min={12}
            value={selectedFontSize}
            onChange={(e) => changeSelectedFontSize(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={selected == -1}
          />
          <Typography>Font</Typography>
          <Select
            value={selectedFontFamily}
            onChange={(e) => changeSelectedFontFamily(e.target.value)}
            disabled={selected == -1}
          >
            {fonts.map((font, index) => (
              <MenuItem key={index} value={font}>{font}</MenuItem>
            ))}
          </Select>
          <Tooltip title="Export Image">
            <Button
              variant="contained"
              onClick={exportImage}
            >
              <CloudDownloadIcon />
            </Button>
          </Tooltip>
        </Stack>
        <Grid className="canvas" ref={canvasRef}>
          {selectedImage &&
            <Rnd
              default={{
                x: 0,
                y: 0,
                width: imageWidth,
                height: imageHeight,
              }}
              width={imageWidth}
              height={imageHeight}
              position={{ x: imageX, y: imageY }}
              onDragStop={(e, d) => {
                setImageX(d.x);
                setImageY(d.y);
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                setImageWidth(ref.style.width.slice(0, -2))
                setImageHeight(ref.style.height.slice(0, -2))
                setImageX(position.x);
                setImageY(position.y)
              }}
              bounds={".canvas"}
            >
              <img src={selectedImage} style={{ width: '100%', height: '100%' }} />
            </Rnd>
          }
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
              <Typography style={{
                fontSize: `${fontSizes[index]}px`,
                fontFamily: fontFamilies[index]
              }}>
                {text}
              </Typography>
            </Rnd>
          ))}
        </Grid>
      </Stack>
    </Grid>
  );
}

export default App;
