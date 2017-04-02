

var canvas = $("canvas")[0];


var createNote = function(note) {
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


var availableNotes = ["c/4", "d/4", "e/4", "f/4"];
var currentNote = null;

var newNote = function() {
  currentNote = _.sample(availableNotes);
  createNote(currentNote);
};


var noteDetected = function(stats, pitchDetector) {
  var normalized = _.replace(_.capitalize(currentNote), '/', '');
  var lookingForNote = normalized[0];
  var lookingForOctave = parseInt(normalized[1]);

  var detected = pitchDetector.getNoteString();
  var detectedNote = detected[0];
  var detectedOctave = parseInt(detected[1]);


  console.log("looking for", lookingForNote, lookingForOctave, "detected", detectedNote, detectedOctave);

  if (lookingForNote == detectedNote && lookingForOctave == detectedOctave + 1) {
    newNote();
  }
};

var detector = new PitchDetector( {
  context: new AudioContext(),
  length: 2048,
  onDetect: noteDetected,
  start: true,
  stopAfterDetection: false,
  normalize: "rms",
  minRms: 0.15,
  minCorrelationIncrease: false,
  minCorrelation: false
});


detector.start();
newNote();
