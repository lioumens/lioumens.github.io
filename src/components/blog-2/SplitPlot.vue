<template>
<svg height="10" width="10" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
      <pattern id="triangle-fill" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(20) scale(0.16)">
        <!-- <path id="a" data-color="fill" fill="none" stroke="#00ff00" stroke-width="4" d="M-25 20h50L0-20z"></path> -->
        <path id="triag-pattern" data-color="fill" fill="none" stroke="#00ff00" stroke-width="6" d="M5,10h50l-25,43.3z"></path>
          <!-- <use xlink:href="#a" x="100"></use> -->
          <!-- <use xlink:href="#a" y="100"></use> -->
          <!-- <use xlink:href="#a" x="100" y="100"></use> -->
          <!-- <use xlink:href="#triag-pattern" x="50" y="50"></use>
          <use xlink:href="#triag-pattern" x="50" y="150"></use> -->
      </pattern>
      <pattern id="circle-fill" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.17)">
        <circle id="circ-pattern" data-color="outline" fill="none" stroke="#0000FF" stroke-width="5" cx="0" cy="0" r="60"></circle>
        <!-- <use xlink:href="#circ-pattern" x="100"></use>
        <use xlink:href="#circ-pattern" x="100" y="100"></use>
        <use xlink:href="#circ-pattern" y="100"></use> -->
      </pattern>
 <pattern id="dot-fill" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(22) scale(.2)">
  <circle fill="#0000ff" stroke="none" stroke-width="none" cx="50" cy="50" r="30"></circle>
</pattern>
  <filter id="marker-shape">
      <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="warp" />
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
  </filter>
  <filter xmlns="http://www.w3.org/2000/svg" id="torn-filter">
      <feTurbulence result="TURBULENCE" baseFrequency="0.03" numOctaves="1" seed="1"/>
      <feDisplacementMap in="SourceGraphic" in2="TURBULENCE" scale="9"/>
      <feOffset in="displacementMap" dx="-4" dy="-2"/>
  </filter>
</defs>
</svg>



<div class="drawing">
      <input type="radio" id="rep-def" name="terms" checked>
      <label for="rep-def">Replicate</label> <br> <p>Replicates are also called statistical blocks. These are a set of similar whole plot experimental units. Sets of replicates are needed for a <em>valid</em> estimate of the experimental error.</p>
       <input type="radio" id="wp-def" name="terms">
      <label for="wp-def">Whole-plot Experimental Unit</label> <br>
      <p>The unit the whole-plot treatment is applied to. A block is broken into whole-plot experimental units. In the standard split-plot design, the whole plots are arranged in an RCBD, with 1 whole-plot experimental unit for each whole-plot treatment factor.</p>
      <input type="radio" id="sp-def" name="terms">
      <label for="sp-def">Split-plot Experimental Unit</label> <br> <p>A smaller size experimental unit that the split-plot factor B is applied to. In a split-plot design, this experimental unit is wholly contained within the whole-plot experimental unit. </p>
<svg width="100%" viewBox="20 20 550 400" preserveAspectRatio="xMidYMid">
  <g class="factor-text">
    <text class="A-text" x="20" y="50">WP Factor A</text>
    <text class="B-text" x="280" y="50">SP Factor B</text>
  </g>
      
  <g class="rep">
  <rect class="x1 y1"/>
    <text x="185" y="135"> Rep 1</text>
  <rect class="x1 y2"/>
    <text x ="185" y="255">Rep 2</text>
  <rect class="x1 y3"/>
    <text x="185" y="375">Rep 3</text>
  </g>
  
  <g class="wp">
    <rect class="x1 y1 a1"/><g class="x1 y1 a1"><text class="x1 y1 a1">A1</text></g>
    <rect class="x2 y1 a2"/><g class="x2 y1 a2"><text class="x2 y1 a2">A2</text></g>
    <rect class="x3 y1 a3"/><g class="x3 y1 a3"><text class="x3 y1 a3">A3</text></g>
    
    <rect class="x1 y2 a2"/><g class="x1 y2 a2"><text class="x1 y2 a2">A2</text></g>
    <rect class="x2 y2 a3"/><g class="x2 y2 a3"><text class="x2 y2 a3">A3</text></g>
    <rect class="x3 y2 a1"/><g class="x3 y2 a1"><text class="x3 y2 a1">A1</text></g>
    
    <rect class="x1 y3 a2"/><g class="x1 y3 a2"><text class="x1 y3 a2">A2</text></g>
    <rect class="x2 y3 a1"/><g class="x2 y3 a1"><text class="x2 y3 a1">A1</text></g>
    <rect class="x3 y3 a3"/><g class="x3 y3 a3"><text class="x3 y3 a3">A3</text></g>
  </g>
  
<g class="sp">
  <g class="sp-left">
    <rect class="x1 y1 b1"/><g class="x1 y1 b1"><text class="x1 y1 b1">B1</text></g>
    <rect class="x2 y1 b2"/><g class="x2 y1 b2"><text class="x2 y1 b2">B2</text></g>
    <rect class="x3 y1 b2"/><g class="x3 y1 b2"><text class="x3 y1 b2">B2</text></g>
      
    <rect class="x1 y2 b2"/><g class="x1 y2 b2"><text class="x1 y2 b2">B2</text></g>
    <rect class="x2 y2 b1"/><g class="x2 y2 b1"><text class="x2 y2 b1">B1</text></g>
    <rect class="x3 y2 b2"/><g class="x3 y2 b2"><text class="x3 y2 b2">B2</text></g>
      
    <rect class="x1 y3 b2"/><g class="x1 y3 b2"><text class="x1 y3 b2">B2</text></g>
    <rect class="x2 y3 b1"/><g class="x2 y3 b1"><text class="x2 y3 b1">B1</text></g>
    <rect class="x3 y3 b2"/><g class="x3 y3 b2"><text class="x3 y3 b2">B2</text></g>
  </g>
  <g class="sp-right">
    <rect class="x1 y1 b2"/><g class="x1 y1 b2"><text class="x1 y1 b2">B2</text></g>
    <rect class="x2 y1 b1"/><g class="x2 y1 b1"><text class="x2 y1 b1">B1</text></g>
    <rect class="x3 y1 b1"/><g class="x3 y1 b1"><text class="x3 y1 b1">B1</text></g>

    <rect class="x1 y2 b1"/><g class="x1 y2 b1"><text class="x1 y2 b1">B1</text></g>
    <rect class="x2 y2 b2"/><g class="x2 y2 b2"><text class="x2 y2 b2">B2</text></g>
    <rect class="x3 y2 b1"/><g class="x3 y2 b1"><text class="x3 y2 b1">B1</text></g>

    <rect class="x1 y3 b1"/><g class="x1 y3 b1"><text class="x1 y3 b1">B1</text></g>
    <rect class="x2 y3 b2"/><g class="x2 y3 b2"><text class="x2 y3 b2">B2</text></g>
    <rect class="x3 y3 b1"/><g class="x3 y3 b1"><text class="x3 y3 b1">B1</text></g>
  </g>
</g>
      <rect id="rep-highlight" width="450" height="100" x="20" y="190" opacity="0"/>
      <rect id="wp-highlight" class="x3 y1 a3"/>
      <g id="sp-highlight">
        <rect class="x2 y3"/>
      </g>
      <!-- <g style="-webkit-filter: url('#torn-filter')"> -->
  <!-- <filter xmlns="http://www.w3.org/2000/svg" id="torn-inline" color-interpolation-filters="sRGB">
      <feTurbulence result="TURBULENCE" baseFrequency="0.03" numOctaves="1" seed="1"/>
      <feDisplacementMap in="SourceGraphic" in2="TURBULENCE" scale="9"/>
      <feOffset in="displacementMap" dx="-4" dy="-2"/>
  </filter>
      <g filter="url(#torn-inline)">
      <rect id="test-highlight" class="x2 y3" width="75" height="90" x="20" stroke="red" fill="red" stroke-width="10"/>
      </g> -->
  </svg>
  <p class="figcaption">Click headings above to highlight examples.</p>
</div> 

</template>

<style lang="scss" scoped>
@use 'sass:color';
$svg-height: 500px;
$svg-width: 700px;
$rep-width: 450px;
$rep-height: 100px;
$rep-gap: 20px;
/* wp vars */
$wp-width: $rep-width * 0.33;
$wp-height: $rep-height;
$wp-stroke: 5px;
/* sp vars */
$sp-width: $wp-width * 0.5 - $wp-stroke * 0.5;
$sp-height: $rep-height - $wp-stroke;

$x1: 20px;
$x2: $x1 + $wp-width + $wp-stroke * 0.5;
$x3: $x2 + $wp-width + $wp-stroke * 0.5;
$y1: 70px;
$y2: $y1 + $rep-height + $rep-gap;
$y3: $y2 + $rep-height + $rep-gap;

$factor-a-text-color: #5e81ac;
/* // $factor-b-text-color: #D08770; // brownish color */
$factor-b-text-color: color.adjust(#8fbcbb, $lightness: -10%);

$a2-color: $factor-a-text-color;
$a1-color: color.adjust($a2-color, $lightness: 20%);
$a3-color: color.adjust($a2-color, $lightness: -20%);
$b1-color: $factor-b-text-color;
$b2-color: color.adjust($b1-color, $lightness: -20%);

$dot-fill-color: $b1-color;
$triangle-fill-color: $b2-color;

$rep-text-color: #2e3440;
$wp-text-color: $rep-text-color;
$sp-text-color: $factor-b-text-color;
$rep-stroke-color:#2E3440; /* nord0 */
// $rep-stroke-color: #3b4252; /* nord1 */
$wp-stroke-color: $rep-stroke-color;
$sp-stroke-color: $rep-stroke-color;

$highlight-color: #A3BE8C; /* nord aurora */
$hover-color: #81A1C1;

#dot-fill circle {
  fill: $dot-fill-color;
}

#triangle-fill path {
  stroke: $triangle-fill-color;
  // fill: $triangle-fill-color;
  // stroke: purple;
}

.x3 {
  x: $x3;
}
.x2 {
  x: $x2;
}
.x1 {
  x: $x1;
}
.y3 {
  y: $y3;
}
.y2 {
  y: $y2;
}
.y1 {
  y: $y1;
}
rect.a1,
text.a1 {
  fill: $a1-color;
}
rect.a2,
text.a2 {
  fill: $a2-color;
}
rect.a3,
text.a3 {
  fill: $a3-color;
}
.rep rect {
  width: $rep-width;
  height: $rep-height;
  stroke: $rep-stroke-color;
  stroke-width: 5;
  fill: #ECEFF4; /* nord6 */
}
/* whole plot rects */
.wp > rect {
  width: $wp-width;
  height: $wp-height;
  stroke-width: $wp-stroke;
  stroke: $wp-stroke-color;
}
.sp rect {
  width: $sp-width;
  height: $sp-height;
  stroke-width: 3px;
  stroke-opacity: 70%;
  stroke: $sp-stroke-color;
  stroke-dasharray: 5, 5;
  // opacity: 0%; // hide layer temporariliy */
  fill-opacity: 0%;
  stroke-opacity: 70%;
}
.sp-left rect {
  transform: translate(
    $wp-stroke * 0.5,
    $wp-stroke * 0.5
  ); /* fill is overplotting, so shift a smaller one */
}
.sp-right rect {
  transform: translate($wp-stroke * 0.5 + $sp-width, $wp-stroke * 0.5);
}

.sp-right text.x1.y1 {
  animation: randomize-sp-right 10s ease infinite;
}

.b1 {
  // fill: url(#diagonal-stripe-2) #ff0;
  /* // fill-opacity: 0%; */
  // fill: url(#circle-fill) #ff0;
  fill: url(#dot-fill) #ff0;
}
.b2 {
  fill: url(#triangle-fill) #ff0;
}

// textual elements
.factor-text {
  font-size: 2em;
  font-family: Verdana;
}
.A-text {
  fill: $factor-a-text-color;
}
.B-text {
  fill: $factor-b-text-color;
}
.wp text {
  font-size: 2.5em;
  font-family: Verdana;
}
.sp text {
  font-size: 2em;
  font-family: Verdana;
  fill: $sp-text-color; /* will be updated with treatment colors? */
}
.rep text {
  font-size: 2.5em;
  font-family: Verdana;
  fill: $rep-text-color;
}
.sp text.b1 {
  fill: $b1-color;
}
.sp text.b2 {
  fill: $b2-color;
}

/* animation code for reps: fade rep, and show whole plots */
$x-pos-rep: 180;
$y-pos-rep: (
  y1: $y1 + 0.65 * $rep-height,
  y2: $y2 + 0.65 * $rep-height,
  y3: $y3 + 0.65 * $rep-height
);

@keyframes fade-rep-text {
  0%,
  5% {
    opacity: 100%;
  }
  10%,
  100% {
    opacity: 0%;
  }
}

@keyframes fade-in-rep {
  0%,
  5% {
    stroke-opacity: 0%;
  }
  10%,
  100% {
    stroke-opacity: 100%;
  }
}

.rep text {
  animation: fade-rep-text 10s ease infinite;
}
.wp rect {
  stroke-opacity: 0%;
  animation: fade-in-rep 10s ease infinite;
}

/* animation code for whole plots */
$x-pos-wp: (
  x1: $x1,
  x2: $x2,
  x3: $x3
);
/* For whole plots, will set the keyframes for randomization by rep (rows), so each y poshas its own timing. */
$y-pos-wp: (y1 $y1 15% 20%, y2 $y2 22.5% 27.5%, y3 $y3 30% 35%);

@each $col, $col-value in $x-pos-wp {
  @each $row, $row-value, $keyin, $keyout in $y-pos-wp {
    @keyframes randomize-wp-#{$row}-#{$col} {
      0%,
      #{$keyin} {
        // -webkit-transform: translate3d(20px, 50px, 0px);
        transform: translate(20px, 50px);
        opacity: 0%;
      }
      #{$keyout},
      100% {
        // -webkit-transform: translate3d(
        //   $col-value + $wp-width * 0.3,
        //   $row-value + $wp-height * 0.65,
        //   0px
        // );
        transform: translate(
          $col-value + $wp-width * 0.3,
          $row-value + $wp-height * 0.65
        );
        opacity: 100%;
      }
    }
    @keyframes colorize-wp-#{$row} {
      0%,
      5% {
        stroke-opacity: 0%;
      }
      10%,
      100% {
        stroke-opacity: 100%;
      }
      0%,
      #{$keyout + 5%} {
        fill-opacity: 0%;
      }
      #{$keyout + 10%},
      100% {
        fill-opacity: 100%;
      }
    }

    .wp g.#{$row}.#{$col} {
      animation: randomize-wp-#{$row}-#{$col} 10s ease-in infinite;
    }
    // .wp text.#{$row}.#{$col} {
    //   animation: randomize-wp-#{$row}-#{$col} 10s ease-in infinite;
    // }
    .wp > rect.#{$row} {
      animation: colorize-wp-#{$row} 10s ease infinite;
    }
  }
}

/* animation code for splitplots */
$x-pos-sp: (
  x1 $x1 0% 1.6%,
  // offset keyframes added to base y pos value
  x2 $x2 1.6% 3.3,
  x3 $x3 3.3% 5%
);
$y-pos-sp: (
  y1 $y1 50%,
  // base value for keyframes
  y2 $y2 55%,
  y3 $y3 60%
);

@each $col, $col-value, $keyin, $keyout in $x-pos-sp {
  @each $row, $row-value, $basekey in $y-pos-sp {
    @keyframes randomize-sp-left-#{$row}-#{$col} {
      0%,
      #{$basekey + $keyin} {
        opacity: 0%;
        transform: translate(350px, 50px);
      }
      #{$basekey + $keyout} {
        transform: translate(
          $col-value + $sp-width * 0.25,
          $row-value + $sp-height * 0.65
        );
        opacity: 100%;
      }
      #{$basekey + $keyout + 10%} {
        opacity: 100%;
      }
      #{$basekey + $keyout + 15%} {
        opacity: 0%;
      }
      100% {
        transform: translate(
          $col-value + $sp-width * 0.25,
          $row-value + $sp-height * 0.65
        );
        opacity: 0%;
      }
    }
    @keyframes randomize-sp-right-#{$row}-#{$col} {
      0%,
      #{$basekey + $keyin} {
        opacity: 0%;
        transform: translate(350px, 50px);
      }
      #{$basekey + $keyout} {
        transform: translate(
          $col-value + $sp-width * 1.25,
          $row-value + $sp-height * 0.65
        );
        opacity: 100%;
      }
      #{$basekey + $keyout + 10%} {
        opacity: 100%;
      }
      #{$basekey + $keyout + 15%} {
        opacity: 0%;
      }
      100% {
        transform: translate(
          $col-value + $sp-width * 1.25,
          $row-value + $sp-height * 0.65
        );
        opacity: 0%;
      }
    }
    @keyframes show-sp-#{$row} {
      0%,
      45% {
        // opacity: 0%;
        fill-opacity: 0%;
        stroke-opacity: 0%;
      }
      50% {
        fill-opacity: 0%;
        stroke-opacity: 100%
      }
      #{$basekey + 15%} {
        opacity: 100%;
        stroke-opacity: 100%;
        fill-opacity: 0%;
      }
      #{$basekey + 20%} {
        opacity: 100%;
        fill-opacity: 100%;
      }
      100% {
        opacity: 100%;
        fill-opacity: 100%;
        stroke-opacity: 100%;
      }
    }
    .sp rect.#{$row} {
      animation: show-sp-#{$row} 10s ease infinite;
      animation-delay: 0ms;
    }
    .sp-right g.#{$row}.#{$col} {
      animation: randomize-sp-right-#{$row}-#{$col} 10s ease infinite;
    }
    .sp-left g.#{$row}.#{$col} {
      animation: randomize-sp-left-#{$row}-#{$col} 10s ease infinite;
      animation-delay: 0ms;
    }
  }
}

/* click highlighting section */
/* select all radio buttons, and make invisible */
.drawing [type="radio"] {
  opacity: 0;
  position: absolute;
}
/* change font/cursor to clickable */
.drawing label {
  cursor: pointer;
  font-size: 1.5rem;
  font-family: "Gloria Hallelujah", cursive;
  z-index: 2;
  white-space: nowrap;
  
}
// .drawing label:hover:after {
//   background-color: black;
//   color: $hover-color;
//   width: 1em;
//   transition: color .2s ease-out;
//   --highlight-width: 5em;
//   animation: highlight 1s ease-out infinite; // inherited properties
// }

/* create the underline with the ::after pseudo element */
@mixin marker-under($element, $width: 0.3em, $degree: -5deg) {
  #{$element} + label {
    position: relative;
  }
  #{$element} + label::after {
    content: "";
    height: 0.3em;
    background-color: $highlight-color;
    position: absolute;
    width: $width;
    filter: url(#torn-filter);
    left: -0.25em;
    z-index: -1;
    top: 0.1em;
    padding: 0 0.25em;
    transform: rotate($degree) translate(0.2em, 1.2em);
    transform: width 1s ease-out;
  }
}
@include marker-under("#rep-def", $width: 4.5em, $degree: -5deg);
@include marker-under("#wp-def", $width: 14em, $degree: -1.5deg);
@include marker-under("#sp-def", $width: 13.5em, $degree: -1.5deg);

/* dynamic animation for @mixin click-highlight */
@keyframes highlight {
  0% {
    width: 0em;
    transform: rotate(var(--rotate-from)) translate(var(--fromX), var(--fromY));
  }
  100% {
    width: var(--highlight-width);
    transform: rotate(var(--rotate-to)) translate(var(--toX), var(--toY));
  }
}

@mixin click-highlight($element, 
  $width: 4.5em,
  $animation-time: 0.1s, 
  $rotate: -5deg, $translateX: 0.2em, $translateY: 0.4em,
  $rotate-from: -3deg, $rotate-to: -5deg,
  $fromX:.2em, $fromY:0.6em, $toX: 0.2em, $toY: 0.4em) {
  #{$element} + label {
    position: relative;
  }
  #{$element}:checked + label::before {
    --highlight-width: #{$width};
    --rotate-from: #{$rotate-from};
    --rotate-to: #{$rotate-to};
    --fromX: #{$fromX};
    --fromY: #{$fromY};
    --toX: #{$toX};
    --toY: #{$toY};
    // --test-color: red;
    content: "";
    height: 1em;
    background-color: $highlight-color;
    position: absolute;
    width: $width;
    filter: url(#torn-filter);
    left: -0.25em;
    top: 0.1em;
    z-index: -1;
    padding: 0 0.25em;
    transform: rotate($rotate) translate($translateX, $translateY);
    animation: highlight $animation-time ease-out; // inherited properties
  }

  // move highlight on hover
  #{$element}:not(:checked) + label:hover::after {
    --highlight-width: calc(#{$width} * .91);
    --rotate-from: #{$rotate-from};
    --rotate-to: #{$rotate-to};
    --fromX: #{$fromX};
    --fromY: #{$fromY};
    --toX: #{$toX};
    --toY: #{$toY};
    content: "";
    background-color: $highlight-color;
    position: absolute;
    filter: url(#torn-filter);
    left: -0.25em;
    top: .85em;
    z-index: -1;
    padding: 0 0.25em;
    transform: rotate($rotate) translate($translateX, $translateY);
    animation: highlight 1s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
  }
}
@include click-highlight("#rep-def", $width: 4.5em, $animation-time: .5s,
  $rotate: -5deg, $translateX: 0.2em, $translateY: 0.4em,
  $rotate-from:-3deg, $rotate-to: -5deg,
  $fromX: .2em, $fromY: 0.6em,
  $toX: 0.2em, $toY:0.4em);

@include click-highlight("#wp-def", $width: 15em, $animation-time: .6s,
  $rotate: -1.5deg, $translateX: 0em, $translateY: 0.5em,
  $rotate-from:-1.5deg, $rotate-to: -1.5deg,
  $fromX: 0em, $fromY: 0.67em,
  $toX: 0em, $toY:0.5em);

@include click-highlight("#sp-def", $width: 15em, $animation-time: .6s,
  $rotate: -1.5deg, $translateX: 0em, $translateY: 0.5em,
  $rotate-from:-1.5deg, $rotate-to: -1.5deg,
  $fromX: 0em, $fromY: 0.65em,
  $toX: 0em, $toY:0.5em);

#rep-def:checked ~ svg > #rep-highlight {
  opacity: 100%;
  fill: none;
  stroke: $highlight-color !important;
  stroke-width: 10px;
  // filter: url(#torn-filter);
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: draw-rect 1s ease-out forwards;
}
#wp-def:checked ~ svg > #wp-highlight {
  height: $wp-height;
  width: $wp-width;
  opacity: 100%;
  fill: none;
  stroke: $highlight-color !important;
  stroke-width: 10px;
  // filter: url(#torn-filter);
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-rect 1.5s ease-out forwards;
}
@keyframes draw-rect {
  to {
    stroke-dashoffset: 0;
  }
}

#sp-def:checked ~ svg > #sp-highlight > rect {
  height: $sp-height;
  width: $sp-width;
  opacity: 100%;
  fill: transparent;
  stroke: $highlight-color !important;
  // stroke: red;
  stroke-width: 10px;
  transform: translate(0px, $wp-stroke * 0.5);
  // filter: url(#torn-filter); // couldn't get this to work on safari browsers
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-rect 1.5s ease-out forwards;
}

// #test-highlight {
//   transform: translate(0, $wp-stroke);
//   // stroke: $highlight-color;
//   // -webkit-filter: url(#torn-filter);
//   // filter: url(#torn-filter);
//   // display: block;
//   // fill: transparent;
//   // filter: url('data:image/svg+xml,\
//   //   <svg xmlns="http://www.w3.org/2000/svg">\
//   // <filter xmlns="http://www.w3.org/2000/svg" id="torn-filter">\
//   //     <feTurbulence result="TURBULENCE" baseFrequency="0.03" numOctaves="1" seed="1"/>\
//   //     <feDisplacementMap in="SourceGraphic" in2="TURBULENCE" scale="9"/>\
//   //     <feOffset in="displacementMap" dx="-4" dy="-2"/>\
//   //     </filter>\
//   //   </svg>#torn-filter');
// }

h2,
p {
  // font-family: "KoHo", sans-serif;
  font-family: 'Crimson Pro Variable', sans-serif;
  color: #ECEFF4; /* nord6 */ 
  // color: rebeccapurple;
}

.figcaption {
  transform: translate(20px, -20px);
  color: #b0b0b0;
}


</style>