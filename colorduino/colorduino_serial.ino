
// Include required libraries
#include <Adafruit_GFX.h>
#include <Colorduino_GFX.h>

// Create new Colorduino instance
ColorduinoPanel Colorduino;

// some vars required for timing
long previousMillis = 0;
long interval = 250;

unsigned char bitmap[9];
unsigned char serialBuffer[256];  

boolean hasMessage = false;
long bufferIndex = 0; 

void drawBitmap(int16_t x, int16_t y, uint8_t *bitmap, int16_t w, int16_t h, uint16_t color) {

  int16_t i, j, byteWidth = (w + 7) / 8;

  for(j=0; j<h; j++) {
    for(i=0; i<w; i++ ) {
      if(((bitmap[j * byteWidth + i / 8])) & (128 >> (i & 7))) {
	Colorduino.drawPixel(x+i, y+j, color);
      }
    }
  }
}

void draw() {
  // clear the back-buffer
  GFX_Color_t background = Colorduino.color(0, 0, 0);
  Colorduino.fillColor(background);
  
  // create new color
  GFX_Color_t color = Colorduino.color(255, 0, 0);
  
  // draw on the back-buffer
  //Colorduino.drawLine(random(7), random(7), random(7), random(7), color);
  //Colorduino.drawTriangle(0,0, 7,0 , 7,7, color);
  drawBitmap(0,0, bitmap, 8,8, color),
    
  // swap the buffers, but don't copy the new front-buffer to the new back-buffer
  Colorduino.swapBuffers(false);
}

void setup() {  
  Serial.begin(19200);
  Serial.println("*** ColorDuino ***");
  Serial.println("starting...");

  
  // Set port mode, load data structures and start the timer
  Colorduino.init();
  // Set white balance
  Colorduino.setWhiteBalance(36, 63, 63);
  
  Serial.println("ready.");
}

void loop() {

  if (hasMessage) {  
    draw();
    hasMessage = false;
  }
}

unsigned char opcode = 0;
void serialEvent() {
  while (Serial.available()) {

    unsigned char incomingByte = (char)Serial.read(); 

    if (bufferIndex == 0) {
      opcode = incomingByte;
      bufferIndex++;
    }
    else if (bufferIndex == 8) {
      bitmap[bufferIndex-1] = incomingByte;
      hasMessage = true;      
      bufferIndex = 0;
    }
    else {
      bitmap[bufferIndex-1] = incomingByte;
      bufferIndex++;
    }
  }
}

