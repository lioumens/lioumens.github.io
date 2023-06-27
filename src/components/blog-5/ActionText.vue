<template>
<span class="link__container" tabindex="0">
    <span class="link link--iocaste">
        <slot></slot>
    <svg class="link__graphic link__graphic--slide" width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
    </svg>
    </span>
</span>
</template>

<style scoped lang="scss">

// https://github.com/codrops/LineHoverStyles/blob/main/css/base.css
.link__container {
  display: inline-block;
  width: fit-content;
  overflow: hidden;  
  position: relative;
  padding: 0;
  margin: 0;
  vertical-align: bottom;

  &:focus {
  /* Provide a fallback style for browsers
  that don't support :focus-visible */
  outline: none;
  background: lightgrey;
  }

  &:focus:not(:focus-visible) {
  /* Remove the focus indicator on mouse-focus for browsers
  that do support :focus-visible */
  background: transparent;
  }

  &:focus-visible {
  /* Draw a very noticeable focus style for
  keyboard-focus on browsers that do support
  :focus-visible */
  outline: 2px solid var(--nord11);
  background: transparent;
  }
}


.link {
    cursor: pointer;
    font-size: 18px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
}

.link::before,
.link::after {
    position: absolute;
    width: 100%;
    height: 1px;
    background: currentColor;
    top: 100%;
    left: 0;
    pointer-events: none;
}

.link::before {
    content: '';
    /* show by default */
}
.link--iocaste {
    overflow: hidden;
    padding: 7px 0;
}

.link__graphic {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
    fill: none;
    stroke: var(--nord15);
    stroke-width: 1px;
}

.link__graphic--slide {
    top: -3px;
    stroke-width: 2px;
}

.link:hover .link__graphic--slide {
    // transform: translate3d(-66.6%, 0, 0);
    // transform: translateX(-66.6%);
    // transition: transform 0.7s alternate infinite;
    animation: slide 0.7s infinite;
    // transition-timing-function: cubic-bezier(0, 0.25, 0.5, 1);
}

@keyframes slide {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-66.6%);
    }
}
</style>