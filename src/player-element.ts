import {AudioEngine} from "./core/audio-engine";
import {createStore} from "./core/store";
import type {SongInfo, MusicPlayMode} from "./config/type";
import {nextIndex, prevIndex} from "./core/playlist";
import {WaveformRenderer} from "./render/components/waveform";

export class XfMusicPlayer extends HTMLElement {
    private engine!: AudioEngine;
    private store!: ReturnType<typeof createStore>
    private unsubscribe?: () => void
    private waveform?: WaveformRenderer

    static get observedAttributes(): string[] {
        return ['mode', 'playlist', 'play-mode']
    }


    connectedCallback(): void{
        //开隔离区，拿到shadowRoot
        const shadowRoot = this.attachShadow({mode: 'open'})

        //建容器
        const container = document.createElement('div')
        const canvas = document.createElement('canvas')

        //把容器放到DOM
        shadowRoot.appendChild(container)
        //初始化
        this.engine = new AudioEngine()
        canvas.height = 80
        canvas.width = 400

        //建store
        const songList: SongInfo[] = [
            {id:1, title:'a love song', src: '/audio/a-love-song.mp3'},
            {id:2, title:'化粧直し', src: '/audio/化粧直し.mp3'},
            {id:3, title:'Steal A Kiss', src: '/audio/Steal-A-Kiss.mp3'}
        ]
        this.store = createStore({
            playlist: songList,
            currentIndex: 0,
            playMode: 'order',
        })
        this.engine.load(songList[0])

        //订阅切歌
        this.unsubscribe = this.store.subscribe((state,prev) => {
            const song = state.playlist[state.currentIndex]
            if(state.currentIndex != prev.currentIndex){
                this.engine.load(song)
                this.engine.play()
                console.log(song.title)
            }
        })


        //建按钮，绑容器
        const playBtn = document.createElement('button')
        playBtn.textContent = '播放'
        playBtn.addEventListener('click',() => {
            this.engine.play()
            // 临时在 index.ts 或 player-element 里：
            const data =this.engine.getFrequencyData()
            console.log(data)  // 应该是一串 0~255 的数字，不全为 0
            console.log(this.engine.hasAnalyserData())  // true = 能画波形；false = 要降级
        })

        const pauseBtn = document.createElement('button')
        pauseBtn.textContent = '暂停'
        pauseBtn.addEventListener('click',() => this.engine.pause())

        const nextBth = document.createElement('button')
        nextBth.textContent = '下一首'
        nextBth.addEventListener('click',()=> {
            const state = this.store.getState()
            const index = nextIndex(state.playlist.length, state.currentIndex, state.playMode)
            this.store.setState({currentIndex: index})
        })

        const prevBth = document.createElement('button')
        prevBth.textContent = '上一首'
        prevBth.addEventListener('click',()=> {
            const state = this.store.getState()
            const index = prevIndex(state.playlist.length, state.currentIndex, state.playMode)
            this.store.setState({currentIndex: index})
        })

        const modeBtn = document.createElement('button')
        modeBtn.textContent = '换模式'
        modeBtn.addEventListener('click', ()=>{
            const order = ['order', 'single', 'random'] as const
            const current = this.store.getState().playMode
            const index = order.indexOf(current)
            const next = order[(index + 1) % order.length]
            this.store.setState({ playMode: next })
            console.log(next)
        })

        this.waveform = new WaveformRenderer(canvas)

        container.appendChild(playBtn)
        container.appendChild(pauseBtn)
        container.appendChild(nextBth)
        container.appendChild(prevBth)
        container.appendChild(modeBtn)
        container.appendChild(canvas)


        this.engine.onTimeUpdate((cur, dur) =>{
            console.log(cur, dur)
        })

        this.engine.onPlay(() => {
            this.waveform?.start(() => this.engine.getFrequencyData())
        })

        this.engine.onPause(() =>{
            this.waveform?.stop()
        })

    }

    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
        if (name === 'play-mode' && newValue) {
            this.store?.setState({ playMode: newValue as MusicPlayMode })
        }
    }

    disconnectedCallback(): void{
        this.unsubscribe?.()      // ① 取消 store 订阅
        this.waveform?.stop()     // ② 停止波形 rAF 循环
        this.engine?.destroy()    // ③ 停止播放 + 关闭 AudioContext
    }
}