import type {SongInfo} from "../config/type";
export class AudioEngine {


    private audio!: HTMLAudioElement
    private audioCTX!: AudioContext
    public analyser!: AnalyserNode
    public currentSong!: SongInfo
    private timeUpdateCb?: (crt: number, dur: number) => void
    private endCb?: () => void
    private errorCb?: (message: string) => void
    private loadingChangeCb?: (loading: boolean) => void
    private playCb?: ()=> void
    private pauseCb?: ()=> void


    constructor() {

        this.audio = new Audio()
        this.audio.volume = 0.8

        this.audio.addEventListener('timeupdate', () => {

            this.timeUpdateCb?.(this.audio.currentTime, this.audio.duration)

        })

        this.audio.addEventListener('ended', () => {

            this.endCb?.()
        })

        this.audio.addEventListener('error', () => {

            this.errorCb?.(this.audio.error?.message ?? '播放出错')

        })

        this.audio.addEventListener('waiting', () => {

            this.loadingChangeCb?.(true)

        })

        this.audio.addEventListener('playing', () => {

            this.loadingChangeCb?.(false)
            this.playCb?.()

        })

        this.audio.addEventListener('pause', ()=> {
            this.pauseCb?.()
        })

    }

    //———— 播控 ————//
    load(song: SongInfo): void {
        this.currentSong = song
        this.audio.src = song.src
        this.audio.load()

    }

    ensureAudioContext(): void{
        if(!this.audioCTX){
            this.audioCTX = new AudioContext()
            this.analyser = this.audioCTX.createAnalyser()
            let audioSrc = this.audioCTX.createMediaElementSource(this.audio)
            audioSrc.connect(this.analyser)
            this.analyser.connect(this.audioCTX.destination)
        }
        if (this.audioCTX.state === 'suspended') {
            this.audioCTX.resume()   // 在用户手势内唤醒
        }
    }

    play(): void {

        this.ensureAudioContext()
        this.audio.play().catch(()=> {
            this.errorCb?.('播放失败：浏览器拦截了自动播放，请再点一次')
        })

    }

    pause(): void {

        this.audio.pause()

    }

    toggle(): void {

        if(this.audio.paused){
            this.play()
        }else{
            this.pause()
        }

    }

    stop(): void {

        this.pause()
        this.audio.currentTime = 0

    }

    //———— 进度/音量 ————//
    seek(second: number): void {

        this.audio.currentTime = second

    }

    setVolume(v: number): void {

        v = Math.min(Math.max(v, 0), 1)
        this.audio.volume = v

    }

    setMuted(m: boolean): void {

        this.audio.muted = m

    }

    //———— 只读查询 ————//
    getDuration(): number {

        return this.audio.duration

    }

    getCurrentTime(): number {

        return this.audio.currentTime

    }

    getFrequencyData(): Uint8Array | null {
        if(!this.analyser) return null
        const data = new Uint8Array(this.analyser.frequencyBinCount)
        this.analyser.getByteFrequencyData(data)
        return data
    }

    hasAnalyserData(): boolean {
        const array = this.getFrequencyData()
        if(!array) return false
        for(let i of array){
            if(i != 0){
                return true
            }
        }
        return false
    }

    //———— 事件回调（UI用来订阅状态变化）————//
    onTimeUpdate(cb: (currentTime: number, duration: number) => void): void {

        this.timeUpdateCb = cb

    }

    onEnded(cb: () => void): void {

        this.endCb = cb

    }

    onError(cb: (message: string) => void): void {

        this.errorCb = cb

    }

    onLoadingChange(cb: (loading: boolean) => void): void {

        this.loadingChangeCb = cb

    }

     onPlay(cb: () => void): void {
        this.playCb = cb
     }

     onPause(cb: () => void): void {
         this.pauseCb = cb
     }

    destroy(): void {
        this.audio.pause()
        this.audio.src = ''
        this.audioCTX?.close()
        this.timeUpdateCb = undefined
        this.endCb = undefined
        this.errorCb = undefined
        this.loadingChangeCb = undefined
        this.playCb = undefined
        this.pauseCb = undefined
    }

}