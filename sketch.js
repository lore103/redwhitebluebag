let opacitySlider;
let scaleSlider;
let redBlueCheckbox;
let redBlackCheckbox;
let overlayImage; 
let showOverlayCheckbox;
let blockMove = false;
let infoButton;
let showInfoPopup = false;
let popupContent;

function preload() {

  overlayImage = loadImage('bag_mockuppp.png');
}


class CheckerboardBlock {
  constructor() {
    this.initialize();
    this.isHorizontal = false;
    this.dragging = false;
  }
  
  initialize() {
    this.color1 = color(164, 9, 9); 
    
    if (redBlueCheckbox.checked()) {
      this.color2 = color(0, 100, 230); 
    } else if (redBlackCheckbox.checked()) {
      this.color2 = color(0, 0, 0);  
    } else {
      this.color2 = color(74, 79, 86); 
    }
    
    this.baseColor = random([this.color1, this.color2]);
    
    this.baseBoxSize = random(0.4, 15);
    
    let blockWidth = random(5, 100);
    let blockHeight = random(5, 100);
    
    let a = floor(random(0, width - blockWidth));
    let b = a + blockWidth;
    let c = floor(random(0, height - blockHeight));
    let d = c + blockHeight;
    
    this.startingCol = min(a, b);
    this.endingCol = max(a, b);
    this.startingRow = min(c, d);
    this.endingRow = max(c, d);
    
    this.isHorizontal = random() > 0.5;
  }

  draggable() {
    return this;
  }
  
  contains(px, py) {
    return (px > this.startingCol && px < this.endingCol && 
            py > this.startingRow && py < this.endingRow);
  }
  
  startDragging(px, py) {
    this.dragging = true;
    this.offsetX = px - this.startingCol;
    this.offsetY = py - this.startingRow;
  }
  
  stopDragging() {
    this.dragging = false;
  }
  
  drag(px, py) {
    if (this.dragging) {
      let width = this.endingCol - this.startingCol;
      let height = this.endingRow - this.startingRow;
      
      this.startingCol = px - this.offsetX;
      this.startingRow = py - this.offsetY;
      this.endingCol = this.startingCol + width;
      this.endingRow = this.startingRow + height;
    }
  }
  
  
  display() {
    noStroke();
    
    let currentOpacity = opacitySlider.value();
    this.fillcolor = color(
      red(this.baseColor),
      green(this.baseColor),
      blue(this.baseColor),
      currentOpacity
    );
    
    let currentScale = scaleSlider.value();
    this.boxSize = this.baseBoxSize * currentScale;
    this.gap = this.boxSize * 2;
    this.gapShift = this.boxSize;
    
    fill(this.fillcolor);
    
    if (this.isHorizontal) {
      for (let i = 0; i <= width; i += this.gap) {
        for (let j = this.startingRow; j <= this.endingRow; j += this.gap) {
          rect(i, j, this.boxSize, this.boxSize);
        }
      }
      
      for (let i = 0; i <= width; i += this.gap) {
        for (let j = this.startingRow; j <= this.endingRow; j += this.gap) {
          rect(i + this.gapShift, j + this.gapShift, this.boxSize, this.boxSize);
        }
      }
    } else {
      for (let i = this.startingCol; i <= this.endingCol; i += this.gap) {
        for (let j = 0; j <= height; j += this.gap) {
          rect(i, j, this.boxSize, this.boxSize);
        }
      }
      
      for (let i = this.startingCol; i <= this.endingCol; i += this.gap) {
        for (let j = 0; j <= height; j += this.gap) {
          rect(i + this.gapShift, j + this.gapShift, this.boxSize, this.boxSize);
        }
      }
    }
  }
}

let blocks = [];
const numBlocks = 6;
let changePatternButton;
let addhorizontalButton;
let addverticalButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let checkboxY = 20;

  let title = createP('MAKE A RED•WHITE•BLUE BAG PATTERN');
  title.position(20, checkboxY); 
  title.style('font-size', '17px');
  title.style('font-weight', 'bold');
  title.style('font-family', 'Oranienbaum-Regular');
  title.style('letter-spacing', '1px');
  title.style('margin', '0 0 10px 0');
  title.style('padding','10px');
  title.style('background-color', '#ffffff');
  title.style('border-radius', '5px');
  
  let colorSelectDiv = createDiv('');
  colorSelectDiv.position(20, checkboxY+50);
  colorSelectDiv.style('background-color', '#ffffff');
  colorSelectDiv.style('padding', '10px');
  colorSelectDiv.style('border-radius', '5px');
  colorSelectDiv.style('width', '200px');
  
  let colorTitle = createP('Select Colors');
  colorTitle.parent(colorSelectDiv);
  colorTitle.style('margin', '0 0 10px 0');
  colorTitle.style('font-weight', 'bold');
  
  redBlueCheckbox = createCheckbox('Blue', true);
  redBlueCheckbox.parent(colorSelectDiv);
  redBlueCheckbox.changed(updateColorSelection);
  
  redBlackCheckbox = createCheckbox('Black', false);
  redBlackCheckbox.parent(colorSelectDiv);
  redBlackCheckbox.changed(updateColorSelection);
  
  
  let buttonY = 180;
  
  addhorizontalButton = createButton('+ Horizontal Row');
  addhorizontalButton.position(20, buttonY+30);
  addhorizontalButton.mousePressed(addHorizontal);
  addhorizontalButton.style('font-family', 'Oranienbaum-Regular');
  
  addverticalButton = createButton('+ Vertical Column');
  addverticalButton.position(160, buttonY+30);
  addverticalButton.mousePressed(addVertical);
  addverticalButton.style('font-family', 'Oranienbaum-Regular');

  
  opacitySlider = createSlider(65, 200, 150, 1);
  opacitySlider.position(100, buttonY + 60);
  opacitySlider.style('width', '200px');
  
  scaleSlider = createSlider(0.5, 3, 1, 0.1);
  scaleSlider.position(100, buttonY + 90);
  scaleSlider.style('width', '200px');
  
  showOverlayCheckbox = createCheckbox('Mockup my Pattern', false);
  showOverlayCheckbox.parent(colorSelectDiv);
  
  changePatternButton = createButton('↻ Change Pattern');
  changePatternButton.position(20, buttonY + 120);
  changePatternButton.mousePressed(changePattern);
  changePatternButton.style('font-family', 'Oranienbaum-Regular');
  
  downloadButton = createButton('⇣ Download Pattern');
downloadButton.position(20, buttonY + 150);
downloadButton.mousePressed(downloadPattern);
downloadButton.style('font-family', 'Oranienbaum-Regular');

infoButton = createButton('What is the RED•WHITE•BLUE bag?');
  infoButton.position(windowWidth - 320, checkboxY);
  infoButton.mousePressed(toggleInfoPopup);
  infoButton.class('info-button');
  infoButton.style('background-color', '#ffffff');
  infoButton.style('border', 'none');
  infoButton.style('border-radius', '5px');
  infoButton.style('width', '300px');
  infoButton.style('height', '40px');
  infoButton.style('font-size', '18px');
  infoButton.style('font-weight', 'bold');
  infoButton.style('cursor', 'pointer');
  infoButton.style('padding','10px');
  infoButton.style('font-family', 'Oranienbaum-Regular');
  
  popupContent = createDiv('');
  popupContent.html(`
    <div style="padding: 1vw;">
    <h1 style="text-align: center">THE RED•WHITE•BLUE BAG </h1>
    <div style="display:flex">
      <p>The Red-White-Blue bag is a nylon or woven plastic carryall that originated in Hong Kong in the 1960s. Known for its lightweight, durable design, it was commonly used to transport goods between Hong Kong and Mainland China. Initially made from Japanese nylon canvas, the material was repurposed from construction shelters and squatter rooftops. A tailor named Lee Wah began producing the bags using canvas imported from Taiwan, later incorporating red for good luck. Though originally blue and white, the iconic red-white-blue design has become a symbol of Hong Kong's resilience and hardworking spirit, reflecting its cultural identity and adaptability through decades of social and economic change.
<br><br>Each bag has its own unique pattern, inspired by its history and craftsmanship. Use this generative website to design and customize your own version of the iconic Red-White-Blue bag. :)
<br><br>Click anywhere outside the box to close this popup.</p>
<img src="redwhitebluebag image.jpg" style="width:20vw; height:auto; object-fit: contain;"></img>
    </div>
  `);
  popupContent.position(windowWidth/2 - popupContent.width/2, windowHeight/2 - 200);
  popupContent.style('background-color', 'white');
  popupContent.style('width', '55%');
  popupContent.style('border-radius', '10px');
  popupContent.style('box-shadow', '0 4px 8px rgba(0,0,0,0.2)');
  popupContent.style('font-family', 'Oranienbaum-Regular, serif');
  popupContent.style('z-index', '1000');
  popupContent.style('display', 'none');

  
  for (let i = 0; i < numBlocks; i++) {
    blocks.push(new CheckerboardBlock());
  }

  windowResized();
 

}

function draw() {

  let buttonY = 180;
  background(255);
  
  // Display all blocks
  for (let block of blocks) {
    block.display();
  }
 
  if (showOverlayCheckbox.checked()) {
    let imgWidth = width; 
    let imgHeight = height; 

    let imgX = (width - imgWidth) / 2;
    let imgY = (height - imgHeight) / 2;
    
    image(overlayImage, imgX, imgY, imgWidth, imgHeight);
  }
  
  textFont("Oranienbaum-Regular"); 
  textSize(14);
    fill(0);
  textSize(14);
  text("Add and drag any of the new rows/columns.", 20, 200)
  text("Opacity", 20, 255,);
  text("Scale", 20, 285);

  
}

function downloadPattern() {
  let now = new Date();
  let filename = 'pattern_' + 
                now.getFullYear() + 
                nf(now.getMonth() + 1, 2) + 
                nf(now.getDate(), 2) + '_' + 
                nf(now.getHours(), 2) + 
                nf(now.getMinutes(), 2) + 
                nf(now.getSeconds(), 2) + 
                '.png';
  
  saveCanvas(filename);
}

function updateColorSelection() {
  if (this === redBlueCheckbox && redBlueCheckbox.checked()) {
    redBlackCheckbox.checked(false);
  } else if (this === redBlackCheckbox && redBlackCheckbox.checked()) {
    redBlueCheckbox.checked(false);
  }
  
  if (!redBlueCheckbox.checked() && !redBlackCheckbox.checked()) {
    if (this === redBlueCheckbox) {
      redBlueCheckbox.checked(true);
    } else {
      redBlackCheckbox.checked(true);
    }
  }
}

function randomLengthGen(length) {
  let a = floor(random(0, length));
  let b = floor(random(0, length));
  
  do {
    a = floor(random(0, length));
    b = floor(random(0, length));
  } while (abs(a - b) == 0);
  
  return createVector(min(a, b), max(a, b));
}

function changePattern() {
  blocks = [];
  for (let i = 0; i < numBlocks; i++) {
    blocks.push(new CheckerboardBlock());
  }
}

function addHorizontal() {
  let newBlock1 = new CheckerboardBlock();
  
  newBlock1.isHorizontal = true;  
  newBlock1.startingCol = 0;
  newBlock1.endingCol = width;

  let rowHeight = random(30, 80);
  let rowY = random(0, height - rowHeight);
  newBlock1.startingRow = rowY;
  newBlock1.endingRow = rowY + rowHeight;
  
  blocks.push(newBlock1);

  newBlock1.draggable();

}


function addVertical() {
  let newBlock = new CheckerboardBlock();
  
  newBlock.isHorizontal = false; 
  newBlock.startingRow = 0;
  newBlock.endingRow = height;
  
  let columnWidth = random(30, 80);
  let columnX = random(0, width - columnWidth);
  newBlock.startingCol = columnX;
  newBlock.endingCol = columnX + columnWidth;

  blocks.push(newBlock);

  newBlock.draggable();
  


}
function mousePressed() {
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].contains(mouseX, mouseY)) {
      blocks[i].startDragging(mouseX, mouseY);
      let selectedBlock = blocks.splice(i, 1)[0];
      blocks.push(selectedBlock);
      return; 
    }
  }
}

function mouseReleased() {
  for (let block of blocks) {
    block.stopDragging();
  }
}

function mouseDragged() {
  for (let block of blocks) {
    block.drag(mouseX, mouseY);
  }
}

function toggleInfoPopup() {
  showInfoPopup = !showInfoPopup;
  if (showInfoPopup) {
    popupContent.style('display', 'block');
  } else {
    popupContent.style('display', 'none');
  }
}

function mousePressed() {
  if (showInfoPopup) {
    let popupX = popupContent.position().x;
    let popupY = popupContent.position().y;
    let popupW = popupContent.size().width;
    let popupH = popupContent.size().height;
    
    if (mouseX < popupX || mouseX > popupX + popupW || 
        mouseY < popupY || mouseY > popupY + popupH) {
      if (!inInfoButton()) {
        showInfoPopup = false;
        popupContent.style('display', 'none');
      }
    }
    return;
  }
  
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].contains(mouseX, mouseY)) {
      blocks[i].startDragging(mouseX, mouseY);
      let selectedBlock = blocks.splice(i, 1)[0];
      blocks.push(selectedBlock);
      return;
    }
  }
}

function inInfoButton() {
  let btnX = infoButton.position().x;
  let btnY = infoButton.position().y;
  let btnW = 300;
  let btnH = 30;
  
  return (mouseX >= btnX && mouseX <= btnX + btnW &&
          mouseY >= btnY && mouseY <= btnY + btnH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  infoButton.position(windowWidth - 320, 20);

  popupContent.position(windowWidth/2 - popupContent.width/2, windowHeight/2 - 200);
}
