export interface SongInfo {
    id: string | number,
    title: string,
    src: string,
    artist?: string,
    cover?: string,
    duration?: number,
}

export type MusicPlayMode = 'order' | 'single' | 'random'