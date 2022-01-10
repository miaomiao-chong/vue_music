<template>
  <teleport to="body">
    <transition name="confirm-fade">
      <div class="confirm" v-show="visible">
        <div class="confirm-wrapper">
          <div class="confirm-content">
            <p class="text">{{ text }}</p>
            <div class="operate">
              <div
                class="operate-btn left"
                @click="confirm"
              >{{ confirmBtnText }}
              </div>
              <div
                class="operate-btn"
                @click="cancel"
              >{{ cancelBtnText }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      visible: false
    }
  },
  emits: ['confirm', 'cancel'],
  methods: {
    confirm() {
      this.hide()
      this.$emit('confirm')
    },
    cancel() {
      this.hide()
      this.$emit('cancel')
    },
    hide() {
      this.visible = false
    },
    show() {
      this.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;

  &.confirm-fade-enter-active {
    animation: confirm-fadein .3s;

    .confirm-content {
      animation: confirm-zoom-in .3s;
    }
  }

  &.confirm-fade-leave-active {
    animation: confirm-fadeout .3s;

    .confirm-content {
      animation: confirm-zoom-out .3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    background-color: #6f6f6c;
    .confirm-content {
      width: 270px;
      border-radius: 13px;

      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
      }
      .operate {
        display: flex;
        align-items: center;
        text-align: center;

        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          background-color: #954e4e;

          &.left {
            background-color: darkolivegreen;
          }
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes confirm-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes confirm-zoom-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes confirm-zoom-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
