import type {SongInfo} from "../config/type";
export class AudioEngine {


    private audio!: HTMLAudioElement
    public currentSong!: SongInfo
    private timeUpdateCb?: (crt: number, dur: number) => void
    private endCb?: () => void
    private errorCb?: (message: string) => void
    private loadingChangeCb?: (loading: boolean) => void


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

        })

    }

    //———— 播控 ————//
    load(song: SongInfo): void {

        this.currentSong = song
        this.audio.src = song.src
        this.audio.load()

    }

    play(): void {

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

    hasAnalyserData(): boolean {

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

}