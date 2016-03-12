

var canvas = $("canvas")[0];
var currentNote = null;


var createNote = function(note) {
  currentNote = note[0];
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

  var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

  var ctx = renderer.getContext();
  var stave = new Vex.Flow.Stave(10, 0, 100);
  stave.addClef("treble").setContext(ctx).draw();
  var voice = new Vex.Flow.Voice({
    num_beats: 4,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
  });


  var c = new Vex.Flow.StaveNote({ keys: [note], duration: "w" });

  voice.addTickables([c]);

  var formatter = new Vex.Flow.Formatter().
    joinVoices([voice]).format([voice], 100);

  voice.draw(ctx, stave);
}


// createNote("c/4");
//

var microphone;
var canvasCtx = canvas.getContext('2d');
var WIDTH = 1000;
var HEIGHT=400;

var getbinfreq = function(n) {
  return n * samplerate/fftSize;
}

var getfreqbin = function(freq) {
  // n * sr * fftsize = freq
  // n = freq/sr*fftsize

  return parseInt(freq/samplerate*fftSize);
}

var cData = [['c0'],['c1'],['c2'],['c3'],['c4'],['c5'],['c6'],['c7'],['c8']];
var cs = [16, 32, 65, 130, 261, 523, 1046, 2093, 4186]

// var c4Data = ['c4']
// var c5Data = ['c5']
// var c6Data = ['c6']


var chart = function() {
  var theChart = c3.generate({
    bindto: '#chart',
    data: {
      columns: cData
        // c4Data,
        // c5Data,
        // c6Data
    }
  });
}

var s = function() { continueDrawing = false; microphone.disconnect(); }

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var samplerate = audioCtx.sampleRate;
var fftSize = 32768/4;

analyser.fftSize = fftSize;
// analyser.maxDecibels=-10;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);


navigator.webkitGetUserMedia({audio: true}, function(stream) {
        microphone = audioCtx.createMediaStreamSource(stream);
        microphone.connect(analyser);
    }, function() {});



  var print = _.throttle(function() {
    analyser.getByteFrequencyData(dataArray);
    var cs = [16, 32, 65, 130, 261, 523, 1046, 2093, 4186]

    _.each(cs, function(note, i) {
      cData[i].push(dataArray[getfreqbin(note)]);
    });


    // var c4 = 261;
    // var c5 = 523;
    // var c6 = 1046;
    // var c7 = 2093;
    // var c8 = 4186;

    // var c4Value = dataArray[getfreqbin(c4)];
    // var c5Value = dataArray[getfreqbin(c5)];
    // var c6Value = dataArray[getfreqbin(c6)];

    // console.log("*** c4:", c4Value, "c5: ", c5Value);
    // c4Data.push(c4Value);
    // c5Data.push(c5Value);
    // c6Data.push(c6Value);


    // if(c4Value > 220) { console.log("C4!!!!") };
    // if(c5Value > 220) { console.log("C5!!!!") };
    // if(c5Value > 220) { console.log("C5!!!!") };


    chart();
  }, 100);

var continueDrawing = true;

function draw() {

  // setInterval(function(){
  //   FFTData = new Float32Array(analyser.frequencyBinCount);
  //   analyser.getFloatFrequencyData(FFTData);
  //   console.log(FFTData[0]);
  // },10);

  if(continueDrawing) {
    drawVisual = requestAnimationFrame(draw);
  }

  analyser.getByteFrequencyData(dataArray);

  print();

  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

    x += barWidth + 1;
  }
};
//
// draw();
