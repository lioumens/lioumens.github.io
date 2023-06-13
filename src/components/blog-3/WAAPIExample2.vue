<script>

const boxKey = [{transform: "translate(0px, 0px)"}, {transform: "translate(200px, 0px)"}];
const boxOptions =  {duration: 1000, iterations: Infinity, direction: "alternate", easing: "ease-in-out"};


export default {
  data() {
    return {
      count: 1,
    }
  },
  methods: {
    add() {
        this.count++
        let box = document.createElement("div")
        box.classList.add("waapi-box")
        this.$refs.waapiParent.appendChild(box)
        let boxAnim = box.animate( boxKey, boxOptions);
        // console.log(this.$refs.waapiParent.firstChild.getAnimations())
        const firstBox = this.$refs.waapiParent.firstChild.getAnimations()[0]
        boxAnim.startTime = firstBox.startTime
        boxAnim.playbackRate = firstBox.playbackRate
    },
    subtract() {
        if (this.count > 1) {
            this.count--
            this.$refs.waapiParent.lastChild.remove()
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
    const waapiBox = document.querySelector('.waapi-box')
    waapiBox.animate( boxKey, boxOptions)
  }
}
</script>

<template>
    <p>Number of Boxes: {{ count }}</p>
    <div style="height: 50px">
    <button class="basic-button" @click="subtract" :disabled="cantSubtract">Subtract Box</button>
    <button class="basic-button" @click="add" :disabled="cantAdd"> Add Box </button>
    </div>
    <figure ref="waapiParent" style="height: 180px;margin: 0px">
    <div class="waapi-box"> 
    </div>
    </figure>
</template>

<style lang="scss">
.waapi-box {
  position: relative;
    // display: flex;
    // align-items: flex-start;
    // justify-content: flex-start;
    width: 20px;
    height: 20px;
    background: red;
    margin: 10px 0px;
}

.basic-button {
    // display: inline-block;
    // position: absolute;
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

    &:disabled {
        background: var(--nord10);
        color: var(--nord2);
        cursor: auto;
        // border: var(--nord10) 2px solid;
    }
    &:not(:disabled):active {
      padding: 9px 10px;
      // border: var(--nord0) 2 solid;
    }
    // &:not(:disabled):hover {
    //     background: var(--nord1);
    // }
    // &:active .basic-button-face {
    //   translate: 0px -2px;
    // }
}
    
</style>