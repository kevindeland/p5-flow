
// *****************************
// ******* Color Palette *******
// *****************************

// For defining colors

let ColorPalette, HUE_MAX;

InitColors = function() {

  ColorPalette = {
    'ylw': color( 2, 8, 16),
    'grn': color( 6, 8, 12),
    'red': color( 0, 8, 14),
    'bl1': color( 9, 8, 14),
    'bl2': color(10, 8, 10),
  }
}


// *****************************
// ******* Pattern Bank ********
// *****************************

// For defining patterns

let PatternBank;

InitPatternBank = function() {
  
  PatternBank = {
    'stripes': [
      'ylw',
      'bl2',
      'bl1',
      'grn',
      'bl2',
      'bl1',
      'red',
    ]
  }
}
