<script>

const translateYKey = {transform:["translate(0px, 0px)", "translate(0px, 200px)"]};

const translateKey = {transform:["translate(0px, 0px)", "translate(200px, 0px)"]};

const translateOptions =  {
  id : "translate",
  duration: 1000,
  iterations: Infinity,
  direction: "alternate",
  easing: "ease-in-out",
  composite: "add"
};

const colorKey = {background: ["rgb(0, 0, 0)", "rgb(255,255,0)", "rgb(0,0,0)"]}
const colorOptions = {
  id: "color",
  duration: 3500,
  iterations: 1,
  easing: "linear",
  composite: "accumulate"
};

const scaleKey = {transform: ["translate(0px 0px) scale(1, 1)", "translate(0px, 0px) scale(1, 1.8)", "translate(0px, 0px) scale(1, 1)"]}
const scaleOptions = {
  id: "scale",
  duration: 1400,
  iterations: 1,
  direction: "alternate",
  easing: "ease-out",
  composite: "add"
}

const rotateKey = {
  transform: "rotate(0deg)", transform: "rotate(360deg)"
}

const rotateOptions = {
  id: "rotate",
  duration: 2800,
  iterations: 1,
  easing: "ease-in-out",
  composite: "add"
};


export default {
  data() {
    return {
      count: 1,
      boxAnimations: []
    }
  },
  // watch:  {
  //   boxAnimations : {
  //     handler(val) {
  //       console.log("animation added/removed")
  //   },
  //   deep: true
  // }},
  methods: {
    color() {
      let colorAnim = this.$refs.waapiBox.animate(colorKey, colorOptions);
      this.boxAnimations.push(colorAnim.id)
      colorAnim.onfinish = () => {
        let index = this.boxAnimations.indexOf(colorAnim.id)
        if (index > -1 ) {
          this.boxAnimations.splice(index, 1)
        }
      }
    },
    scale() {
      let scaleAnim = this.$refs.waapiBox.animate(scaleKey, scaleOptions);
      this.boxAnimations.push(scaleAnim.id)
      scaleAnim.onfinish = () => {
        let index = this.boxAnimations.indexOf(scaleAnim.id)
        if (index > -1 ) {
          this.boxAnimations.splice(index, 1)
        }
      }
      
    },
    rotate() {
      let rotateAnim = this.$refs.waapiBox.animate(rotateKey, rotateOptions);
      this.boxAnimations.push(rotateAnim.id)

      // event handler after animation is finished
      rotateAnim.onfinish = () => {
        let index = this.boxAnimations.indexOf(rotateAnim.id)
        if (index > -1 ) {
          this.boxAnimations.splice(index, 1)
        }
      }
    },
  },
  computed: {
    cantSubtract() {
      return this.count <= 1
    },
    cantAdd() {
      return this.count >=6
    }
  },
  mounted() {
    // kick off translate animation
    this.$refs.waapiBox.animate( translateKey, translateOptions)
    this.boxAnimations.push(this.$refs.waapiBox.getAnimations()[0].id)
  }
}
</script>

<template>
  <div style="height: 50px">
    <button class="basic-button" @click="color">Color</button>
    <button class="basic-button" @click="scale">Scale</button>
    <button class="basic-button" @click="rotate">Rotate</button>
    <figcaption style="margin: 0px; color:#9f9f9f;font-size:.9rem;">Animation composition behaves oddly in safari 16, still hacking a work around.</figcaption>
  </div>
  <figure ref="waapiParent" style="height: 80px;margin: 0px;">
    <div ref="waapiBox" class="waapi-box" style="margin-top: 60px"> 
    </div>
  </figure>
  <p>Animations: {{ boxAnimations.join(", ") }}</p>
</template>

<style lang="scss">
.waapi-box {
  position: relative;
  width: 20px;
  height: 20px;
  background: red;
  margin: 10px 0px;
  animation-composition: accumulate;
}

.basic-button {
  padding: 10px 10px; 
  background: var(--nord8);
  border: var(--nord8) 2px solid;
  border-radius: 5px;    
  color: var(--nord0);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  box-shadow: var(--shadow-elevation-low);
  margin-right: 10px;
  border: 0px;
  cursor: pointer;
  z-index: 2;
  
  &:disabled {
    background: var(--nord10);
    color: var(--nord2);
    cursor: auto;
  }
  &:not(:disabled):active {
    padding: 9px 10px;
  }
}
    
</style>