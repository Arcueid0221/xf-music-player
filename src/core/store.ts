import type { SongInfo, MusicPlayMode } from '../config/type'

export interface MusicPlayerStoreState {
    playlist: SongInfo[]
    currentIndex: number
    playMode: MusicPlayMode
}


export interface MusicPlayerStoreApi {

    getState(): MusicPlayerStoreState
    setState(partial: Partial<MusicPlayerStoreState>): void
    subscribe(
        listener: (state: MusicPlayerStoreState, prev: MusicPlayerStoreState) => void
    ): () => void

}

export function createStore(initial: MusicPlayerStoreState): MusicPlayerStoreApi {

    let state = initial
    const listeners = new Set<(state: MusicPlayerStoreState, prev: MusicPlayerStoreState) => void>()

    return {
        getState(){
            return state
        },

        setState(partial){
            const prev = state
            state = {...state, ...partial}
            listeners.forEach(l => l(state, prev))
        },

        subscribe(listener) {
            listeners.add(listener)
            return () => {
                listeners.delete(listener)
            }
        }
    }

}