class STKCanvasComponent {
  private $el: HTMLCanvasElement

  constructor($el: HTMLCanvasElement) {
    this.$el = $el;
  }

  resizeCanvas() {

    //this.$el.height = window.innerHeight*0.70; 
    //this.$el.width = window.innerWidth *0.80;
    this.$el.height = 789;
    this.$el.width = 1189;
  }
  width() {
    return this.$el.width;
  }

  height() {
    return this.$el.height;
  }
  clearCanvas() {
    const { height, width } = this.$el;
    this.getContext().clearRect(0, 0, width, height);
  }

  getCursorPosition(e): [number, number] {
    const pos = this.$el.getBoundingClientRect();
    const canvasX = e.clientX - pos.left;
    const canvasY = e.clientY - pos.top;
    return [canvasX, canvasY]

  }

  getContext(): CanvasRenderingContext2D {
    const ctx = this.$el.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get 2d context');
    }
    return ctx;
  }


  emptyMsg() {
    const ctx = this.getContext();
    ctx.font = "24px poppins";
    ctx.fillText("Empty Tree...", this.$el.width / 2 - (this.$el.width * 0.10), this.$el.height / 2);
  }
}
