this.Opcodes = {
  msk : 0x00,
  col : 0x01,
  pxl : 0x02,
  vli : 0x03,
  hli : 0x04,
  lin : 0x05,
  rct : 0x06,
  rcb : 0x07,
  clr : 0x08,
  cir : 0x09,
  bmp : 0x0a
};

this.Opcode = {
  exists: function(opcode) {
    return Object.keys(Opcodes).indexOf(opcode.toLowerCase()) > -1;
  }
}
