#include <iostream>
#include <iomanip>
#include <sstream>
#include <assert.h> 

using namespace std;

// TODO: add the number of operands to the opcode. array? some key/value thing?
const int COL = 0x42;
const int PXL = 0x43;

string lastCommand;

int buf[] = {0,0,0,0};
int idx = 0;

//// UTILS

template< typename T >
string int2hex( T i ) {
  stringstream stream;
  stream << "0x" 
         << setfill ('0') << setw(2) 
         << hex << i;
  return stream.str();
}

//// MOCKS

// sets lastCommand to: "COL(<red>,<green>,<blue>)"
void setColor(int red, int green, int blue) {
	stringstream stream;
	stream << "COL(";
	stream << red   << ",";
	stream << green << ",";
	stream << blue  << ")";
 	lastCommand = stream.str();
}

void drawPixel(int x, int y) {
	stringstream stream;
	stream << "PXL(" << x << "," << y << ")";
 	lastCommand = stream.str();
}

//// READ/WRITE COMMANDS

// write 3 bytes to buffer, starting at idx, in the following order: red, green, blue
void writeSetColor(int red, int green, int blue) {
	// cout << "buf: " << buf[0] << endl;
	// cout << "idx: " << idx << endl;
	buf[idx++] = COL;
	buf[idx++] = red;
	buf[idx++] = green;
	buf[idx++] = blue;
}

void writeDrawPixel(int x, int y) {
	buf[idx++] = PXL;
	buf[idx++] = x;
	buf[idx++] = y;
}

// read 3 bytes from buffer, starting at idx, in the following order: red, green, blue
// POST: idx is set after the 3 read bytes
void readSetColor() {
	int red    = buf[idx++];
	int green  = buf[idx++];
	int blue   = buf[idx++];

	setColor(red, green, blue);
}

void readDrawPixel() {
	int x = buf[idx++];
	int y = buf[idx++];

	drawPixel(x, y);
}

void readCommand() {
	int opcode = buf[idx++];
	switch(opcode) {
		case COL:
			readSetColor();
			break;
		case PXL:
			readDrawPixel();
			break;
		default:
			cout << "ERROR: unknown command: " << int2hex(opcode) << endl;
	}
}

void assertCommand(string command) {
	// read from buffer and execute commands
	readCommand();

	if (command != lastCommand)	{
		stringstream s;
		s << "ERROR: expected " << command << " but got " << lastCommand;
 		throw s.str();
	}
	else
		cout << command << " [ok]" << endl;
	// assert(("command doesn't match", command == lastCommand));
}

//// TESTS

void testSetColor() {
	idx = 0;
	writeSetColor(10,2,3);
	idx = 0;
	assertCommand("COL(10,2,3)");
}

void testDrawPixel() {
	idx = 0;	
	writeDrawPixel(3, 4);
	idx = 0;
	assertCommand("PXL(3,4)");
}


//// MAIN PROGRAM

int main() {
  cout << "*** ColorDuino Command Protocol ***" << endl;
  try {
	testSetColor();	
	testDrawPixel();
  }
  catch (string e) {
    cout << "FATAL: " << e << '\n';
  }
  return 0;
}
