let CW, CH

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


// *****************************
// ******* Field Creator *******
// *****************************

let VectorFields, StartingPoints;

InitVectorFields = function() {
    
  VectorFields = {
    'noise1': function(col, row) {
      noiseDetail(10, 0.4)
      const scaled_x = col * 0.005
      const scaled_y = row * 0.005
      const noise_val = noise(scaled_x, scaled_y)
      let angle = map(noise_val, 0.0, 1.0, 0.0, TWO_PI)
      return angle
    },

    'noise_concrete': function(col, row) {
      noiseDetail(10, 0.8)
      const scaled_x = col * 0.005
      const scaled_y = row * 0.005
      const noise_val = noise(scaled_x, scaled_y)
      const STEPS = 4
      let concrete = int(map(noise_val, 0.0, 1.0, 0.0, STEPS))

      return concrete / STEPS * TWO_PI
    },

    'total_random': function(col, row) {
      return random(TWO_PI)
    },

    'test': function(col, row) {
      return map(col, 0, num_columns, 0, TWO_PI)
    }
  }


  StartingPoints = {
    'grid': function() {
      let xs = count(-10, 30).map(function(n) { return n*50 })
      let ys = count(-10, 30).map(function(n) { return n*50 })
    
      let cs = count(-10, 30).map(function(n) { 
        // console.log(n)
        let index = (n+10)%MainPattern.length
        // console.log(index)
        return MainPattern[index]
      })

      return {xs, ys, cs}
    },

    'grid2': function() {
      const res = 25
      const x1 = -20;
      const x2 = 60;
      let xs = count(x1, x2).map(function(n) { return n*res })
      let ys = count(x1, x2).map(function(n) { return n*res })
    
      let cs = count(x1, x2).map(function(n) { 
        // console.log(n)
        let index = (n-x1)%MainPattern.length
        // console.log(index)
        return MainPattern[index]
      })

      return {xs, ys, cs}
    },

    'random': function() {
      let xs = [], ys = [], cs = [];
      for (let i=0; i < 30; i++) {
        xs.push(int(random(-500, 1500)))
        ys.push(int(random(-500, 1500)))
        cs.push('bl2')
      }
      return {xs, ys, cs}
    }

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

// Boundaries
let left_x, right_x, top_y, bottom_y;

let resolution;
let num_columns, num_rows;
let grid;

let MainPattern;


function setup() {
  CW = 1000, CH = 1000
  createCanvas(CW, CH);

  colorMode(HSB, 16)
  InitColors()
  InitPatternBank()

  InitVectorFields()
  
  // Extend Flow past the edges
  left_x = int(CW * -0.5)
  right_x = int(CW * 1.5)
  top_y = int(CH * -0.5)
  bottom_y = int(CH * 1.5)
  
  resolution = int(CW * 0.01)
  
  num_columns = (right_x - left_x) / resolution
  num_rows = (bottom_y - top_y) / resolution
  
  grid = []

  let default_angle = QUARTER_PI
  
  // INITIALIZE GRID
  count(0, num_columns).forEach(function(col) {
    let xc = []
    count(0, num_rows).forEach(function(row) {

      /* let angle = (row / float(num_rows)) * PI */

      let angle = VectorFields['noise_concrete'](col,row)
      xc.push(angle)
    })
    grid.push(xc)
  })

  // DRAW ANGLES
  count(0, num_columns).forEach(function(col) {
    count(0, num_rows).forEach(function(row) {
      let angle = grid[col][row]

      // drawFlowLine(left_x + col*resolution, top_y + row*resolution, angle)
    })
  })

  MainPattern = PatternBank['stripes']

  const paths = StartingPoints['grid2']()

  
  const xs = paths.xs
  const ys = paths.ys
  const cs = paths.cs
  console.log(cs)

  count(0, xs.length).forEach(function(i) {
    let x_start = xs[i]
    
    ys.forEach(function(y_start) {
      let num_steps = 10;
      let step_length = 20;

      let x_draw = x_start
      let y_draw = y_start

      beginShape()
      noFill()
      count(0, num_steps).forEach(function(n) {
        strokeWeight(4)

        stroke(ColorPalette[cs[i]])

        vertex(x_draw, y_draw)
    
        x_offset = x_draw - left_x
        y_offset = y_draw - top_y
    
        column_index = int(x_offset / resolution)
        row_index = int(y_offset / resolution)
    
        // check bounds
        if (column_index >= num_columns || column_index < 0 || 
          row_index < 0 || row_index >= num_rows) return;
        grid_angle = grid[column_index][row_index]
    
        x_step = step_length * cos(grid_angle)
        y_step = step_length * sin(grid_angle)
    
        x_draw = x_draw + x_step
        y_draw = y_draw + y_step
      })
      endShape()
    })
  })
}

function draw() {
  
}



function drawFlowLine(x, y, theta) {

  let r = 10
  circle(x, y, r/2)
  line(x, y, x+r*cos(theta), y+r*sin(theta))
}
