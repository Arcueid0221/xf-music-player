import {AudioEngine} from "./core/audio-engine";
import {createStore} from "./core/store";
import type {SongInfo, MusicPlayMode} from "./config/type";
import {nextIndex, prevIndex} from "./core/playlist";

export class XfMusicPlayer extends HTMLElement {
    private engine!: AudioEngine;
    private store!: ReturnType<typeof createStore>
    static get observedAttributes(): string[] {
        return ['mode', 'playlist', 'play-mode']
    }


    connectedCallback(): void{
        //开隔离区，拿到shadowRoot
        const shadowRoot = this.attachShadow({mode: 'open'})

        //建容器和engine
        const container = document.createElement('div')
        shadowRoot.appendChild(container)
        this.engine = new AudioEngine()

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
        this.store.subscribe((state,prev) => {
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
        playBtn.addEventListener('click',() => this.engine.play())

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
            container.appendChild(playBtn)
            container.appendChild(pauseBtn)
            container.appendChild(nextBth)
            container.appendChild(prevBth)
            container.appendChild(modeBtn)


        this.engine.onTimeUpdate((cur, dur) =>{
            console.log(cur, dur)
        })

    }

    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
        if (name === 'play-mode' && newValue) {
            this.store?.setState({ playMode: newValue as MusicPlayMode })
        }
    }

    disconnectedCallback(): void{

    }
}