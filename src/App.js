import AddIcon from '@mui/icons-material/Add';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import SaveIcon from '@mui/icons-material/Save';
import TitleIcon from '@mui/icons-material/Title';
import { Box, Button, Grid, IconButton, MenuItem, Modal, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh'
};

const fonts = ['Arial', 'Helvetica', 'Verdana', 'Times New Roman'];

function App() {
  const [open, setOpen] = useState(false);
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
  const [templateImages, setTemplateImages] = useState([]);
  const [templateImageWidthes, setTemplateImageWidths] = useState([]);
  const [templateImageHeightes, setTemplateImageHeights] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const handleOpen = () => { setOpen(true) }
  const handleClose = () => { setOpen(false) }
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


  const addTemplateImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;
        const newWidth = 700;
        const newHeight = 700 / aspectRatio;

        const newTemplateImages = [...templateImages];
        newTemplateImages.push(event.target.result);
        setTemplateImages(newTemplateImages);

        const newWidthes = [...templateImageWidthes];
        newWidthes.push(newWidth);
        setTemplateImageWidths(newWidthes)

        const newHeightes = [...templateImageHeightes];
        newHeightes.push(newHeight);
        setTemplateImageHeights(newHeightes);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }

  const importImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;
        const newWidth = 700;
        const newHeight = 700 / aspectRatio;
        setImageWidth(newWidth);
        setImageHeight(newHeight);
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

  useEffect(() => {
    const newTemplateImages = JSON.parse(localStorage.getItem('templateImages'))
    if (newTemplateImages) setTemplateImages(newTemplateImages);
    const newTemplateImageWidthes = JSON.parse(localStorage.getItem('templateImageWidthes'))
    if (newTemplateImageWidthes) setTemplateImageWidths(newTemplateImageWidthes);
    const newTemplateImageHeightes = JSON.parse(localStorage.getItem('templateImageHeightes'))
    if (newTemplateImageHeightes) setTemplateImageHeights(newTemplateImageHeightes);
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      localStorage.setItem('templateImages', JSON.stringify(templateImages));
    }
  }, [templateImages]);

  useEffect(() => {
    if (!initialLoading) {
      localStorage.setItem('templateImageWidthes', JSON.stringify(templateImageWidthes));
    }
  }, [templateImageWidthes]);

  useEffect(() => {
    if (!initialLoading) {
      localStorage.setItem('templateImageHeightes', JSON.stringify(templateImageHeightes));
    }
  }, [templateImageHeightes]);

  return (
    <Grid className="App">
      <Stack style={{ height: '100vh' }}>
        <Stack pt={2} pb={2} direction="row" alignItems="center" justifyContent={"space-between"}>
          <Stack direction="row" alignItems={"center"} spacing={1}>
          <Tooltip title="Create New">
            <IconButton
              onClick={createNew}
              size='small'
            >
              <FiberNewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Use Template">
            <IconButton
              onClick={handleOpen}
              size='small'
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Import Image">
            <IconButton
              role={undefined}
              tabIndex={-1}
              size="small"
            >
              <CloudUploadIcon />
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={importImage}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Text">
            <IconButton
              onClick={addText}
              size='small'
            >
              <TitleIcon />
            </IconButton>
          </Tooltip>
          <TextField
            id="outlined-multiline-static"
            label="Edit Text"
            multiline
            rows={1}
            value={selectedText}
            onChange={(e) => changeSelectedText(e.target.value)}
            disabled={selected == -1}
            size='small'
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
            size='small'
            style={{
              width: 70
            }}
          />
          <Typography>Font</Typography>
          <Select
            value={selectedFontFamily}
            onChange={(e) => changeSelectedFontFamily(e.target.value)}
            disabled={selected == -1}
            size='small'
          >
            {fonts.map((font, index) => (
              <MenuItem key={index} value={font}>{font}</MenuItem>
            ))}
          </Select>
          </Stack>
          <Tooltip title="Export Image">
            <IconButton
              onClick={exportImage}
              size='small'
            >
              <CloudDownloadIcon />
            </IconButton>
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
              }} textAlign={"left"}>
                <div dangerouslySetInnerHTML={{ __html: text.replace(/\n\r?/g, '<br>') }} />
              </Typography>
            </Rnd>
          ))}
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={style} style={{
            overflowY: "scroll"
          }}>
            <Typography variant="h6" component="h4">
              Choose template image
            </Typography>
            {templateImages.map((templateImage, index) => (
              <Stack direction={"row"} alignItems={"center"} mt={2} key={index}>
                <img src={templateImage} width="250" />
                <Stack spacing={2} ml={2}>
                  <Tooltip title="Use This">
                    <Button variant="contained" onClick={() => {
                      setSelectedImage(templateImage);
                      setImageWidth(templateImageWidthes[index]);
                      setImageHeight(templateImageHeightes[index]);
                      handleClose();
                    }}>
                      <DoneOutlineIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete Image" >
                    <Button variant="contained" onClick={() => {
                      const updatedTemplateImages = [...templateImages];
                      updatedTemplateImages.splice(index, 1);
                      setTemplateImages(updatedTemplateImages);

                      const updatedTemplateImageWidthes = [...templateImageWidthes];
                      updatedTemplateImageWidthes.splice(index, 1);
                      setTemplateImageWidths(updatedTemplateImageWidthes);

                      const updatedTemplateImageHeightes = [...templateImageHeightes];
                      updatedTemplateImageHeightes.splice(index, 1);
                      setTemplateImageHeights(updatedTemplateImageHeightes);
                    }} >
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>
            ))}

            <Stack justifyContent="center" alignItems="center" style={{ border: '1px solid black', borderRadius: 20, width: 250, height: 200 }} mt={2}>
              <Tooltip title="Add New">
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                >
                  <AddIcon />
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={addTemplateImage}
                  />
                </Button>
              </Tooltip>
            </Stack>
          </Box>
        </Modal>
      </Stack>
    </Grid>
  );
}

export default App;
