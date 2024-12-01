let selectedCanvasId = null;
let uploadedImage = null;
let designX = null, designY = null, designWidth = 100, designHeight = 100;
let tshirtImage = null;

// Initialize canvas resolution for high-quality downloads
document.querySelectorAll('.design-canvas').forEach((canvas) => {
  canvas.width = 1000; // High resolution for download
  canvas.height = 1250;
});

// Select T-shirt
function selectTshirt(canvasId) {
  document.querySelectorAll('.tshirt').forEach((tshirt) => tshirt.classList.remove('selected'));
  const selectedTshirt = document.getElementById(canvasId).parentElement;
  selectedTshirt.classList.add('selected');
  selectedCanvasId = canvasId;

  // Load the T-shirt image only once
  const tshirtImg = selectedTshirt.querySelector('img');
  tshirtImage = new Image();
  tshirtImage.src = tshirtImg.src;

  tshirtImage.onload = () => {
    drawDesign();
  };
}

// Draw the design on the canvas
function drawDesign() {
  if (!selectedCanvasId) return;
  const canvas = document.getElementById(selectedCanvasId);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the T-shirt image first
  if (tshirtImage) {
    ctx.drawImage(tshirtImage, 0, 0, canvas.width, canvas.height);
  }

  // Draw the uploaded design, if available
  if (uploadedImage) {
    const adjustedX = designX ?? (canvas.width - designWidth) / 2;
    const adjustedY = designY ?? (canvas.height - designHeight) / 2;
    ctx.drawImage(uploadedImage, adjustedX, adjustedY, designWidth, designHeight);
  }
}

// Upload PNG design
document.getElementById('uploadDesign').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && selectedCanvasId) {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
      img.onload = () => {
        uploadedImage = img;
        drawDesign();
      };
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please select a T-shirt and upload a PNG design!');
  }
});

// Resize design
document.getElementById('resizeWidth').addEventListener('input', (e) => {
  designWidth = parseInt(e.target.value, 10);
  drawDesign();
});

document.getElementById('resizeHeight').addEventListener('input', (e) => {
  designHeight = parseInt(e.target.value, 10);
  drawDesign();
});

// Move design
const moveStep = 25;

document.getElementById('moveLeft').addEventListener('click', () => {
  designX = (designX || (1000 - designWidth) / 2) - moveStep;
  drawDesign();
});

document.getElementById('moveRight').addEventListener('click', () => {
  designX = (designX || (1000 - designWidth) / 2) + moveStep;
  drawDesign();
});

document.getElementById('moveUp').addEventListener('click', () => {
  designY = (designY || (1250 - designHeight) / 2) - moveStep;
  drawDesign();
});

document.getElementById('moveDown').addEventListener('click', () => {
  designY = (designY || (1250 - designHeight) / 2) + moveStep;
  drawDesign();
});

// Download the mockup
document.getElementById('downloadMockup').addEventListener('click', () => {
  if (!selectedCanvasId) {
    alert('Please select a T-shirt to download the mockup!');
    return;
  }

  const canvas = document.getElementById(selectedCanvasId);
  const downloadCanvas = document.createElement('canvas');
  downloadCanvas.width = canvas.width;
  downloadCanvas.height = canvas.height;
  const downloadCtx = downloadCanvas.getContext('2d');

  // Draw the T-shirt image
  if (tshirtImage) {
    downloadCtx.drawImage(tshirtImage, 0, 0, downloadCanvas.width, downloadCanvas.height);
  }

  // Draw the uploaded design
  if (uploadedImage) {
    const adjustedX = designX ?? (canvas.width - designWidth) / 2;
    const adjustedY = designY ?? (canvas.height - designHeight) / 2;
    downloadCtx.drawImage(uploadedImage, adjustedX, adjustedY, designWidth, designHeight);
  }

  // Download as a high-quality JPG
  const link = document.createElement('a');
  link.download = 'tshirt-mockup.jpg';
  link.href = downloadCanvas.toDataURL('image/jpeg', 1.0);
  link.click();
});
