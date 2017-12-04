/*
    Coded by Jade Allen Cook 2016

    Teeth Data Information
        0: missing tooth
        1: regular tooth
        2: screw
        3: extraction
        4: current crown
        5: future crown
        6: current bridge
        7: future bridge
        8: red line on gums

    Cavity Data Information
        0: top
        1: left
        2: center
        3: right
        4: bottom
        5: gumline
*/

var data = {
  teeth: [],
  gumsF: [],
  gumsL: [],
  cavity: [],
  // system app information
  numbering: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
  sections: ['b', 'm', 'o', 'd', 'l', 'v'],
  selected: [],
  gumSelect: [],
  colors: ['red', 'blue', 'green'],
  color: 'red',
  image: '',
  cavityAction: false,
  undo: [],
};

var build = {
  container: function(number) {
    if (number < 16) var html = '<div id="container-' + number + '" class="tooth-container top-container"></div>';
    if (number >= 16) var html = '<div id="container-' + number + '" class="tooth-container bottom-container"></div>';
    return html;
  },
  tooth: function(number) {
    // empty out old content
    $('#container-' + number).empty();
    // config tooth type
    if (number < 16) { // top set of teeth
      if (number < 3 || number >= 13) {
        var type = 'molar';
        var place = 'top';
      } else {
        var type = 'standard';
        var place = 'top';
      }
    } else if (number >= 16) { // bottom set of teeth
      if (number < 20 || number >= 29) {
        var type = 'molar';
        var place = 'bottom';
      } else {
        var type = 'standard';
        var place = 'bottom';
      }
    }
    // prebuild number container
    if (data.selected.indexOf(number) < 0) var numberHTML = '<div id="' + number + '" class="number">' + data.numbering[number] + '</div>';
    else var numberHTML = '<div id="' + number + '" class="number selected">' + data.numbering[number] + '</div>';
    if (type == 'molar') { // molar root prebuild
      var root = '<div class="' + place + '-molar roots" id="roots-' + number + '">' +
        '<div class="left-root root"></div>' +
        '<div class="right-root root"></div>' +
        '<div class="v"></div>' +
        '</div>';
    } else if (type == 'standard') { // standard root prebuild
      var root = '<div class="' + place + '-standard roots" id="roots-' + number + '">' +
        '<div class="center-root root"></div>' +
        '<div class="v"></div>' +
        '</div>';
    }
    $('.number').selectable({
      stop: function() {
        action.select($(this).attr('id'));
      }
    });
    if (place == 'top') {
      var html = numberHTML;
      html += root;
      if (number < 8) {
        html += '<div class="top-tooth-container">' +
          '<div class="tooth top-tooth" id="tooth-' + number + '">' +
          '<div class="vertical top quad b"></div>' +
          '<div class="middle left quad d"></div>' +
          '<div class="center center quad o"></div>' +
          '<div class="middle right quad m"></div>' +
          '<div class="vertical bottom quad l"></div>' +
          '</div></div>';
      } else if (number > 7) {
        html += '<div class="top-tooth-container">' +
          '<div class="tooth top-tooth" id="tooth-' + number + '">' +
          '<div class="vertical top quad b"></div>' +
          '<div class="middle left quad m"></div>' +
          '<div class="center center quad o"></div>' +
          '<div class="middle right quad d"></div>' +
          '<div class="vertical bottom quad l"></div>' +
          '</div></div>';
      }
    } else if (place == 'bottom') {
      if (number < 24) {
        var html = '<div class="bottom-tooth-container">' +
          '<div class="tooth bottom-tooth" id="tooth-' + number + '">' +
          '<div class="vertical bottom quad l"></div>' +
          '<div class="middle right quad m"></div>' +
          '<div class="center center quad o"></div>' +
          '<div class="middle left quad d"></div>' +
          '<div class="vertical top quad b"></div>' +
          '</div></div>';
      } else if (number > 23) {
        var html = '<div class="bottom-tooth-container">' +
          '<div class="tooth bottom-tooth" id="tooth-' + number + '">' +
          '<div class="vertical bottom quad l"></div>' +
          '<div class="middle right quad d"></div>' +
          '<div class="center center quad o"></div>' +
          '<div class="middle left quad m"></div>' +
          '<div class="vertical top quad b"></div>' +
          '</div></div>';
      }
      html += root;
      html += numberHTML;
    }
    $('#container-' + number).append(html);
    // highlight cavitys
    for (var i = 0; i < data.cavity[number].length; i++) {
      var spot = data.cavity[number][i]
      if (spot[0] !== 'v') var $spot = $('div#tooth-' + number + ' div.' + spot[0])
      else var $spot = $('div#roots-' + number + ' div.' + spot[0])
      $spot.css({
        backgroundColor: spot[1]
      })
    }
    // tooth types
    if (data.teeth[number] == 0) {
      if (number < 16) $('#container-' + number).empty().append(numberHTML + '<div class="top-blank"></div>');
      else if (number > 15) $('#container-' + number).empty().append('<div class="bottom-blank"></div>' + numberHTML);
    } else if (data.teeth[number] == 2) {
      $('#container-' + number).empty()
      if (number < 16) var screwHTML = numberHTML + '<img src="top.png" class="top-screw screw" />';
      else var screwHTML = '<img src="bottom.png" class="bottom-screw screw" />' + numberHTML;
      $('#container-' + number).append(screwHTML);
    } else if (data.teeth[number] == 3) {
      $('#roots-' + number).append('<span class="extraction-x">x</span>');
    } else if (data.teeth[number] == 4) {
      $('#tooth-' + number).empty().css({
        backgroundColor: 'blue'
      });
    } else if (data.teeth[number] == 5) {
      $('#tooth-' + number).empty().css({
        backgroundColor: 'red'
      });
    } else if (data.teeth[number] == 6) {
      $('#roots-' + number).empty();
      $('#tooth-' + number).empty().css({
        backgroundColor: 'red'
      });
    } else if (data.teeth[number] == 7) {
      $('#roots-' + number).empty();
      $('#tooth-' + number).empty().css({
        backgroundColor: 'blue'
      });
    }
    $('#teeth').val(JSON.stringify(data.teeth));
    $('#cavity').val(JSON.stringify(data.cavity));
  },
  teeth: function() {
    for (var i = 0; i < 32; i++) build.tooth(i);
  },
  gumContainer: function(number, type, data) {
    if (data[number] == 0) var containerHTML = '<div style="color:#fff;" class="gum-num gum-' + type + '" id="gum-' + type + '-' + number + '"><span>' + data[number] + '</span></div>';
    else var containerHTML = '<div class="gum-num gum-' + type + '" id="gum-' + type + '-' + number + '"><span>' + data[number] + '</span></div>';
    return containerHTML;
  },
  gum: function(number, type, data) {
    if (data.gums[number] == 0) {
      $('#gum-' + number).empty().append('<span></span>').css({
        color: '#fff'
      });
    } else {
      $('#gum-' + number).empty().append('<span>' + data.gums[number] + '</span>');
      if (data.gums[number] > 4) {
        $('#gum-' + number).css({
          color: 'red'
        });
      }
    }
  },
  table: function() {
    $('#top-gum-l-container, #top-gum-f-container, #bottom-gum-f-container, #bottom-gum-l-container').empty();
    $('#top-gum-l-container, #bottom-gum-l-container').append('<div class="gum-label">M</div>');
    $('#top-gum-f-container, #bottom-gum-f-container').append('<div class="gum-label">D</div>');
    for (var i = 0; i < 32; i++) {
      if (i < 16) $('#top-gum-l-container').append(build.gumContainer(i, 'l', data.gumsL));
      if (i < 16) $('#top-gum-f-container').append(build.gumContainer(i, 'f', data.gumsF));
      if (i < 16) $('#top-teeth').append(build.container(i));
      if (i >= 16) $('#bottom-teeth').append(build.container(i));
      if (i >= 16) $('#bottom-gum-f-container').append(build.gumContainer(i, 'f', data.gumsF));
      if (i >= 16) $('#bottom-gum-l-container').append(build.gumContainer(i, 'l', data.gumsL));
      build.tooth(i);
    }
    $('#guml').val(JSON.stringify(data.gumsL));
    $('#gumf').val(JSON.stringify(data.gumsF));
  }
};

var action = {
  replace: function(number, replacement) {
    data.teeth.splice(number, 1, replacement);
  },
  select: function(number) {
    if (data.cavityAction == true) {
      $('.number').removeClass('selected');
      $('.gum-num').removeClass('gum-select');
      data.selected = [];
      data.gumSelect = [];
      data.cavityAction = false;
    }
    if ($('#' + number).hasClass('selected')) {
      function remove(item) {
        for (var i = data.selected.length; i--;) {
          if (data.selected[i] === item) {
            data.selected.splice(i, 1);
          }
        }
      }
      $('#' + number).removeClass('selected');
      remove(number);
    } else {
      $('#' + number).addClass('selected');
      data.selected.push(number);
    }
  },
  loop: function(num) {
    for (var i = 0; i < data.selected.length; i++) {
      action.replace(data.selected[i], num);
      build.tooth(data.selected[i]);
      $('#' + data.selected[i]).addClass('selected');
    }
    $('.number').removeClass('selected');
    $('.gum-num').removeClass('gum-select');
    data.selected = [];
    data.gumSelect = [];
  },
  remove: function() {
    action.loop(0);
  },
  reset: function() {
    action.loop(1);
  },
  screw: function() {
    action.loop(2);
  },
  extract: function() {
    action.loop(3);
  },
  crown: function(num) {
    action.loop(num);
  },
  bridge: function(num) {
    action.loop(num);
  },
  deselect: function() {
    $('.number').removeClass('selected');
    $('.gum-num').removeClass('gum-select');
    data.selected = [];
    data.gumSelect = [];
  },
  selectAll: function() {
    data.selected = [];
    for (var i = 0; i < 32; i++) data.selected.push(i);
    $('.number').addClass('selected');
  },
  cavity: function(place, color) {
    for (var i = 0; i < data.selected.length; i++) {
      // update cavity array
      data.cavity[data.selected[i]].push([place, color])
      // build tooth
      build.tooth(data.selected[i])
    }
  },
  clearCav: function() {
    for (var i = 0; i < data.selected.length; i++) {
      $('div#roots-' + data.selected[i] + ' div.v').css({
        backgroundColor: '#fff'
      });
      $('div#tooth-' + data.selected[i] + ' div.quad').css({
        backgroundColor: '#fff'
      });
      data.cavity[data.selected[i]] = [];
      build.tooth(data.selected[i]);
    }
  },
  gumber: function(number, array, letter, that) {
    var number = number.match(/\d+$/);
    // selecting clicked function
    function selecting() {
      if ($(that).hasClass('gum-select')) {
        $(that).removeClass('gum-select');
        data.gumSelect.splice(data.gumSelect.indexOf('gum-' + letter + '-' + number), 1);
      } else { // adding
        $(that).addClass('gum-select');
        data.gumSelect.push('gum-' + letter + '-' + number);
      }
    }
    $('#' + data.gumSelect[0]).removeClass('gum-select');
    data.gumSelect.splice(data.gumSelect.indexOf(data.gumSelect[0]), 1);
    selecting();
    $('#gum' + letter).val(JSON.stringify(array));
  },
  mand: function() {
    data.selected = [];
    for (var i = 16; i < 32; i++) data.selected.push(i);
    if (data.teeth[16] == 0) action.loop(1);
    else action.loop(0);
    data.selected = [];
  },
  max: function() {
    data.selected = [];
    for (var i = 0; i < 16; i++) data.selected.push(i);
    if (data.teeth[0] == 0) action.loop(1);
    else action.loop(0);
    data.selected = [];
  },
};

// init app build
$(document).ready(function() {
  if (data.teeth.length < 32) data.teeth = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  if (data.gumsF.length < 32) data.gumsF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (data.gumsL.length < 32) data.gumsL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (data.cavity.length < 32) for (var i = 0; i < 32; i++) data.cavity.push([]);
  build.table();
  // functionality
  $('#remove').mousedown(function() {
    action.remove();
  });
  $('#extraction').mousedown(function() {
    action.extract();
  });
  $('#screw').mousedown(function() {
    action.screw();
  });
  $('#crown').mousedown(function() {
    if (data.color == 'red') action.crown(5);
    else action.crown(4);
  });
  $('#bridge').mousedown(function() {
    if (data.color == 'red') action.bridge(6);
    else action.bridge(7);
  });
  $('#deselect').mousedown(function() {
    action.deselect();
  });
  // cavity btns
  $('.cav-btn').mousedown(function() {
    action.cavity($(this).attr('id'), data.color);
  });
  $('#clear').mousedown(function() {
    action.clearCav();
  })
  $('#reset').mousedown(function() {
    action.reset();
  });
  $('#select-all').mousedown(function() {
    action.selectAll();
  });
  $('#mand').mousedown(function() {
    action.mand();
  });
  $('#max').mousedown(function() {
    action.max();
  });
  $('#red-blue').mousedown(function() {
    var max = data.colors.length,
    currentColor = data.colors.indexOf(data.color) + 1;
    if (currentColor >= max) currentColor = 0;
    data.color = data.colors[currentColor];
    $('#red-blue').css({
      backgroundColor: data.color
    });
  });
  $('#download').click(function() {
    html2canvas($('#app'), {
      proxy: 'index.html',
      allowTaint: true,
      onrendered: function(canvas) {
        data.image = canvas;
        $('#download').empty().append('Download Image').attr('href', canvas.toDataURL());
      }
    });
  });
  $('#load-set').mousedown(function() {
    data.teeth = JSON.parse($('#teeth').val());
    data.cavity = JSON.parse($('#cavity').val());
    data.gumsF = JSON.parse($('#gumf').val());
    data.gumsL = JSON.parse($('#guml').val());
    build.table();
  });
  // undo btn prototyping
  $('.btn').click(function() {
    var before = data.undo;
    data.undo = [];
    data.undo.push(data.teeth, data.cavity, data.gumsF, data.gumsL);
  });
}).bind('mousedown', function() {
  $('selector').css('cursor', 'crosshair');
  // number functionality
  $('.number').selectable({
    stop: function() {
      action.select($(this).attr('id'));
    }
  });
  $('.gum-num').selectable({
    stop: function() {
      if ($(this).hasClass('gum-l')) action.gumber($(this).attr('id'), data.gumsL, 'l', this);
      else action.gumber($(this).attr('id'), data.gumsF, 'f', this);
    }
  });
}).keydown(function(e) {
  if (e.keyCode > 47 && e.keyCode < 58) {
    for (var i = 0; i < data.gumSelect.length; i++) {
      var $container = $('#' + data.gumSelect[i] + ' span');
      var number = data.gumSelect[i].match(/\d+$/);
      var letter = data.gumSelect[i].slice(4, 5);
      if (data.teeth[number] != 0) $container.empty().append(String.fromCharCode(e.keyCode));
      if (String.fromCharCode(e.keyCode) > 4) {
        $container.css({
          color: 'red'
        });
      } else if (String.fromCharCode(e.keyCode) == 0) {
        $container.css({
          color: '#fff'
        });
      } else {
        $container.css({
          color: '#000'
        });
      }
      // skipping to next function
      // swapped L to M & F to D
      function next() {
        if (data.gumSelect.length == 1) {
          var number = data.gumSelect[i].match(/\d+$/);
          var letter = data.gumSelect[i].slice(4, 5);
          if (number < 32) {
            $('#gum-' + letter + '-' + number).removeClass('gum-select');
            if (data.teeth[number + 1] == 0) number++;
            if (letter == 'l') {
              letter = 'f';
            } else if (data.teeth[parseInt(number) + 1] == 0 && letter == 'f') {
              do {
                number = parseInt(number) + 1;
              } while (data.teeth[parseInt(number)] == 0);
              letter = 'l';
            } else {
              number++;
              letter = 'l';
            }
            $('#gum-' + letter + '-' + number).addClass('gum-select');
            data.gumSelect = ['gum-' + letter + '-' + number];
          } else {
            $('#gum-' + letter + '-' + number).removeClass('gum-select');
            number = 0;
            $('#gum-' + letter + '-' + number).addClass('gum-select');
            data.gumSelect = ['gum-' + letter + '-' + number];
          }
        }
      }
      if (letter == 'l') {
        data.gumsL.splice(number, 1);
        data.gumsL.splice(number, 0, Number(String.fromCharCode(e.keyCode)));
        $('#guml').val(JSON.stringify(data.gumsL));
        next();
      } else { // f
        data.gumsF.splice(number, 1);
        data.gumsF.splice(number, 0, Number(String.fromCharCode(e.keyCode)));
        $('#gumf').val(JSON.stringify(data.gumsF));
        next();
      }
    }
  }
});
