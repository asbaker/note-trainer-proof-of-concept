

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















