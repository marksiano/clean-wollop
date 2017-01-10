$(document).ready(function () {

	var SVG_HEIGHT = '300';
	var SVG_WIDTH = '1200';

	// Opera 8.0+
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	// Firefox 1.0+
	var isFirefox = typeof InstallTrigger !== 'undefined';
	// Safari 3.0+ "[object HTMLElementConstructor]" 
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
	// Internet Explorer 6-11
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	// Edge 20+
	var isEdge = !isIE && !!window.StyleMedia;
	// Chrome 1+
	var isChrome = !!window.chrome && !!window.chrome.webstore;
	// Blink engine detection
	var isBlink = (isChrome || isOpera) && !!window.CSS;

	if (!isChrome) {
		document.body.innerHTML = "<p style=\"position:fixed;top:50%;width:100%;text-align:center;font-size:30px;color:rgb(160, 242, 207)\">Sorry! For now, Music Visualizer only works with Google Chrome.</p>";
	}

  	var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  	var audioElement = document.getElementById('audioElement');
  	var audioSource = audioContext.createMediaElementSource(audioElement);
  	var audioAnalyzer = audioContext.createAnalyser();

  	audioSource.connect(audioAnalyzer);
  	audioSource.connect(audioContext.destination);

  	var numBars = 80;
  	var frequencyData = new Uint8Array(numBars);
  	var barPadding = '4';

  	var paused = true;

  	var hover_text = document.getElementById("hover_text");

  	var play_button = document.getElementById("play");

  	play_button.onclick = function() {
	  	document.getElementById('audioElement').play();
	  	paused = false;
  	}

  	play_button.onmouseover = function() {
	  	play_button.setAttribute("style", "background: url(images/play_button_hovered.png);height:90px;width:90px;border:0");
	  	hover_text.innerHTML = "Play";
  	};
  	play_button.onmouseout = function() {
	  	play_button.setAttribute("style", "background: url(images/play_button.png);height:90px;width:90px;border:0");
	  	if (paused == true) {
  			hover_text.innerHTML = "Press Play to Start Visualization";
  		} else {
	  		hover_text.innerHTML = "";
	  	}
  	};

	var pause_button = document.getElementById("pause");

  	pause_button.onclick = function() {
	  	document.getElementById('audioElement').pause();
	  	paused = true;
  	}

  	pause_button.onmouseover = function() {
	  	pause_button.setAttribute("style", "background: url(images/pause_button_hovered.png);height:90px;width:90px;border:0");
	  	hover_text.innerHTML = "Pause";
  	};
  	pause_button.onmouseout = function() {
	  	pause_button.setAttribute("style", "background: url(images/pause_button.png);height:90px;width:90px;border:0");
	  	if (paused == true) {
  			hover_text.innerHTML = "Press Play to Start Visualization";
  		} else {
	  		hover_text.innerHTML = "";
	  	}
  	};

  	var upload_button = document.getElementById("upload");
  	upload_button.onmouseover = function() {
	  	hover_text.innerHTML = "Upload Audio";
	  	upload_button.setAttribute("src", "images/upload_hovered.png");
  	};
  	upload_button.onmouseout = function() {
	  	if (paused == true) {
  			hover_text.innerHTML = "Press Play to Start Visualization";
  		} else {
	  		hover_text.innerHTML = "";
	  	}
	  	upload_button.setAttribute("src", "images/upload.png");
  	};

  	var svg = d3.select('#thetd').append('svg').attr('height', SVG_HEIGHT).attr('width', SVG_WIDTH);

  	// Create bar graph
  	svg.selectAll('rect')
	 	.data(frequencyData)
	 	.enter()
	 	.append('rect')
	 	.attr('x', function (d, i) {
			return i * (SVG_WIDTH / frequencyData.length);
	 	})
	 	.attr('width', SVG_WIDTH / frequencyData.length - barPadding);

		svg.attr('style', 'top:0;bottom:0;left:0;right:0;margin:auto;');

  	function update_svg() {
	 	requestAnimationFrame(update_svg);

	 	audioAnalyzer.getByteFrequencyData(frequencyData);

	 	// Update svg with new height array data
	 	svg.selectAll('rect')
			.data(frequencyData)
			.attr('y', function(d) {
		   		return (SVG_HEIGHT - d) * 1;
			})
			.attr('height', function(d) {
		   		return d;
			})
			.attr('fill', function(d) {
		   		return '#82D4BB';
			});
	}

  	update_svg();

    document.getElementById('audio').addEventListener('change', function(event){

    	var blob = window.URL || window.webkitURL;
	    if (!blob) {
	    	return;           
    	}
        var file = this.files[0],
        fileURL = blob.createObjectURL(file);
        document.getElementById('audioElement').src = fileURL;

	});
});
