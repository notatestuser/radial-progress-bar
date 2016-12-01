function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function RadialProgress(config) {
  this.props = Object.assign({}, RadialProgress.DEFAULTS, config);
  return this;
}

RadialProgress.prototype.generatePath = function(degrees) {
  var radius = this.props.radius;
  var radians = (degrees * Math.PI / 180);
  var x = Math.sin(radians) * radius;
  var y = Math.cos(radians) * -radius;
  var halfEdgeSize = this.props.edgeSize/2;
  x += halfEdgeSize;
  y += halfEdgeSize;
  var largeArcSweepFlag = degrees > 180 ? 1 : 0;
  var startX = halfEdgeSize;
  var startY = halfEdgeSize - radius;
  return 'M'+startX+','+startY+' A'+radius+','+radius+' 0 '+largeArcSweepFlag+' 1 '+x+','+y;
};

RadialProgress.prototype.renderSvg = function(container) {
  var center = this.props.edgeSize / 2;
  var radius = this.props.radius;
  var degrees;
  var text = '';
  if (this.props.unit === 'percent') {
    var percent = clamp(this.props.value, 0, 100);
    degrees = percent / 100  * 360;
    degrees = clamp(degrees, 0, 359.9);
    text = this.props.formatText(percent);
  } else {
    degrees = this.props.value;
    degrees = clamp(degrees, 0, 359.9);
    text = this.props.formatText(degrees);
  }

  var pathDescription = this.generatePath(degrees);

  var displayText = '';
  if (this.props.displayText) {
      displayText =
        '<text x="'+center+'" y="'+(this.props.forcedTextY || center)+'" text-anchor=middle>'+
          text+
        '</text>';
  }

  var innerHtml =
    '<svg width='+this.props.edgeSize+' height='+this.props.edgeSize+'>'+
      '<circle cx="'+center+'" cy="'+center+'" r="'+radius+'"'+
          ' stroke="'+this.props.circleStroke+'"'+
          ' stroke-width="'+this.props.circleStrokeWidth+'"'+
          ' fill="'+this.props.circleFill+'"'+
          '></circle>'+
      '<path d="'+pathDescription+'"'+
          ' fill=transparent'+
          ' stroke="'+this.props.progressStroke+'"'+
          ' stroke-width="'+this.props.circleStrokeWidth+'"'+
          '></path>'+
      displayText+
    '</svg>';

  container.innerHTML = innerHtml;

  return container;
};

RadialProgress.DEFAULTS = {
  edgeSize: 100,
  radius: 45,
  forcedTextY: 0,
  circleStrokeWidth: 4,
  circleStroke: '#D8D8D8',
  circleFill: 'white',
  progressStroke: 'black',
  unit: 'degrees',
  displayText: true,
  formatText: function(value) { return value; },
  value: 0
};

window.RadialProgress = RadialProgress;
