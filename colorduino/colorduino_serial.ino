/*

IMPORTANT: use with Arduino IDE 1.5.5!
  1.5.6 - 1.5.8 don't work currently

*/

// Include required libraries
#include <Adafruit_GFX.h>
#include <Colorduino_GFX.h>

// OPCODES
const uint8_t MSK = 0x00;
const uint8_t COL = 0x01;
const uint8_t PXL = 0x02;
const uint8_t VLI = 0x03;
const uint8_t HLI = 0x04;
const uint8_t LIN = 0x05;
const uint8_t RCT = 0x06;
const uint8_t RCB = 0x07;
const uint8_t CLR = 0x08;
const uint8_t CIR = 0x09;
const uint8_t BMP = 0x0a;
const uint8_t TST = 0xfe; // special test mode. goes through all commands in a loop
const uint8_t NO_CMD = 0xff;


uint8_t bufferSize[] = {8,3,1,3,3,2,2,2,0,0,192};

// Create new Colorduino instance
ColorduinoPanel Colorduino;


// some vars required for timing
long previousMillis = 0;
long interval = 250;

uint8_t buffer[256];

long bufferIndex = 0;
GFX_Color_t currentColor = Colorduino.color(255, 0, 0);

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

// COMMANDS

void drawMask() {
  // clear the back-buffer
  GFX_Color_t background = Colorduino.color(0, 0, 0);
  Colorduino.fillColor(background);

  // draw on the back-buffer
  //Colorduino.drawLine(random(7), random(7), random(7), random(7), color);
  //Colorduino.drawTriangle(0,0, 7,0 , 7,7, color);
  drawBitmap(0,0, buffer, 8,8, currentColor);

  // swap the buffers, but don't copy the new front-buffer to the new back-buffer
  Colorduino.swapBuffers(false);
}

void setColor() {
  currentColor = Colorduino.color(buffer[0], buffer[1], buffer[2]);
}

void horizontalLine() {
  Colorduino.drawFastHLine(buffer[0],buffer[1],buffer[2],currentColor);
  Colorduino.swapBuffers(true);
}

void doCommand(uint8_t opcode) {
  switch(opcode) {
    case MSK:
      drawMask();
      break;
    case COL:
      setColor();
      break;
    case HLI:
      horizontalLine();
      break;
  }
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
}

uint8_t opcode = NO_CMD;

void serialEvent() {
  while (Serial.available()) {

    uint8_t incomingByte = (uint8_t)Serial.read();

    if (opcode == NO_CMD) {
      opcode = incomingByte;
      continue;
    }

    buffer[bufferIndex] = incomingByte;
    bufferIndex++;
    if (bufferIndex == bufferSize[opcode]) {
      doCommand(opcode);

      opcode = NO_CMD;
      bufferIndex = 0;
      Serial.println("ack");
    }
  }
}





