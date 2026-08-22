import type {MusicPlayMode} from "../config/type";

export function nextIndex ( len: number, cur: number, mode: MusicPlayMode) : number {

    if (len <= 1 ) {

        return 0

    }else{

        if (cur < 0) cur = 0

        if (cur >= len) cur = len - 1

        if (mode == 'order' || mode == "single") {

            return (cur + 1)% len

        } else {

            return shuffle(len ,cur)

        }
    }

}

export function prevIndex ( len: number, cur: number, mode: MusicPlayMode) : number {

    if (len <= 1 ) {

        return 0

    }else{

        if (cur < 0) cur = 0

        if (cur >= len) cur = len - 1

        if (mode == 'order' || mode == "single") {

            return (cur -1 + len)% len

        } else {

            return shuffle(len ,cur)

        }
    }

}


export function shuffle(len: number, cur: number): number{

    if (len == 1) return 0

    const tamp = Math.floor(Math.random() * len)

    if ( tamp == cur ) return shuffle(len, cur)

    return tamp

}