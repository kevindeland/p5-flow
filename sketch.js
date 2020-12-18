let CW, CH


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
// ******* CanvasDrawer ********
// *****************************

// interacts directly w/ canvas

let drawPathThroughField, drawFlowLine;

InitCanvasDrawer = function() {

  drawPathThroughField = function(NUM_STEPS, STEP_LENGTH, x_draw, y_draw, col) {
    beginShape()
    noFill()
    strokeWeight(4)
    stroke(col)

    for (n of count(0, NUM_STEPS)) {

      vertex(x_draw, y_draw)
  
      const x_offset = x_draw - left_x
      const y_offset = y_draw - top_y
  
      const column_index = int(x_offset / resolution)
      const row_index = int(y_offset / resolution)
  
      // check bounds
      if (column_index >= num_columns || column_index < 0 || 
        row_index < 0 || row_index >= num_rows) return;

      const grid_angle = grid[column_index][row_index]
  
      const x_step = STEP_LENGTH * cos(grid_angle)
      const y_step = STEP_LENGTH * sin(grid_angle)
  
      x_draw = x_draw + x_step
      y_draw = y_draw + y_step
    }
    endShape()
  }

  drawFlowLine = function(x, y, theta) {
    let r = 10
    circle(x, y, r/2)
    line(x, y, x+r*cos(theta), y+r*sin(theta))
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
  InitCanvasDrawer()
  
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
  for (col of count(0, num_columns)) {
    let xc = []
    for (row of count(0, num_rows)) {

      /* let angle = (row / float(num_rows)) * PI */

      let angle = VectorFields['noise_concrete'](col,row)
      xc.push(angle)
    }
    grid.push(xc)
  }

  // DRAW ANGLES
  for (col of count(0, num_columns)) {
    for (row of count(0, num_rows)) {
      let angle = grid[col][row]

      // drawFlowLine(left_x + col*resolution, top_y + row*resolution, angle)
    }
  }

  MainPattern = PatternBank['stripes']

  const paths = StartingPoints['grid2']()


  // EXTRACT: not sure where these go.
  const NUM_STEPS = 10;
  const STEP_LENGTH = 20;
  
  const xs = paths.xs
  const ys = paths.ys
  const cs = paths.cs

  for (i of count(0, xs.length)) {
    let x_start = xs[i]
    
    for (j of count(0, ys.length)) {
      let y_start = ys[j]

      let col = ColorPalette[cs[i]]
      drawPathThroughField(NUM_STEPS, STEP_LENGTH, x_start, y_start, col)
    }
  }
}

function draw() {
  
}

