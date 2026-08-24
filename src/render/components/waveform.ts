export class WaveformRenderer {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private rafId: number | null = null   // 存 rAF 的 id，用来停止
    private cwidth: number
    private cheight: number
    private meterWidth =5 //方块的宽度
    private gap = 2 //方块的间距
    private minHeight = 2
    private meterNum : number

    constructor(canvas: HTMLCanvasElement) {   // ① canvas 从外面传进来
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')!

        this.cwidth = canvas.width;
        this.cheight = canvas.height - 2;
        this.meterNum = Math.floor(this.cwidth / (this.meterWidth + this.gap));//根据宽度和间距计算出可以放多少个方块

        //渐变色
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(1, '#0f00f0');
        gradient.addColorStop(0.5, '#ff0ff0');
        gradient.addColorStop(0, '#f00f00');
        this.ctx.fillStyle = gradient ;//填充

    }

    start(getData: () => Uint8Array | null): void {    // ② 开始循环，数据靠回调拿
        // if(this.rafId) return
        const loop = () => {
            const array = getData()
            if(array){
                const step = Math.floor(array.length / this.meterNum)   //从频谱数据中每隔step均匀取出meterNum个数据
                this.ctx.clearRect(0, 0, this.cwidth, this.cheight);
                for (let i = 0; i < this.meterNum; i++) {
                    let value = array[i * step];
                    this.ctx.fillRect(i * (this.meterWidth + this.gap), this.cheight - value + this.minHeight, this.meterWidth, value); //绘制
                }
            }
            this.rafId = requestAnimationFrame(loop)
        }
        loop()
    }

    stop(): void {// ③ 停止循环（暂停时用）

        if(this.rafId){
            cancelAnimationFrame(this.rafId)
            this.rafId = null
        }
    }
}