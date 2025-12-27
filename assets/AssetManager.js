export class AssetManager {
    constructor() {
        this.cache = new Map();      // key -> asset
        this.promises = new Map();   // key -> Promise
        this.loaders = new Map();    // type -> loader fn
        this.base_path = ''

        this._registerDefaultLoaders()
    }

    /* ------------------------------------------------------------------ */
    /* Configuration                                                      */
    /* ------------------------------------------------------------------ */

    setBasePath(path) {
        this.base_path = path.endsWith('/') ? path : path + '/'
    }

    /* ------------------------------------------------------------------ */
    /* Public API                                                         */
    /* ------------------------------------------------------------------ */

    async load(key, url, type = 'auto') {
        if (this.cache.has(key)) {
            return this.cache.get(key)
        }

        if (this.promises.has(key)) {
            return this.promises.get(key)
        }

        const final_url = this.base_path + url
        const loader = this._resolveLoader(type, final_url)

        if (!loader) {
            throw new Error(`No loader available for asset: ${url}`)
        }

        const promise = loader(final_url)
            .then(asset => {
                this.cache.set(key, asset)
                this.promises.delete(key)
                return asset
            })
            .catch(err => {
                this.promises.delete(key)
                throw err
            })

        this.promises.set(key, promise)
        return promise
    }

    async loadAll(definitions = []) {
        return Promise.all(
            definitions.map(def =>
                this.load(def.key, def.url, def.type)
            )
        )
    }

    get(key) {
        if (!this.cache.has(key)) {
            throw new Error(`Asset not found: ${key}`)
        }
        return this.cache.get(key)
    }

    has(key) {
        return this.cache.has(key)
    }

    unload(key) {
        this.cache.delete(key)
        this.promises.delete(key)
    }

    clear() {
        this.cache.clear()
        this.promises.clear()
    }

    /* ------------------------------------------------------------------ */
    /* Loader registration                                                */
    /* ------------------------------------------------------------------ */

    registerLoader(type, loaderFn) {
        if (this.loaders.has(type)) {
            throw new Error(`Loader already registered: ${type}`)
        }
        this.loaders.set(type, loaderFn)
    }

    /* ------------------------------------------------------------------ */
    /* Internal helpers                                                   */
    /* ------------------------------------------------------------------ */

    _resolveLoader(type, url) {
        if (type !== 'auto') {
            return this.loaders.get(type)
        }

        const ext = url.split('.').pop().toLowerCase()

        if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
            return this.loaders.get('image')
        }
        if (['mp3', 'wav', 'ogg'].includes(ext)) {
            return this.loaders.get('audio')
        }
        if (['json'].includes(ext)) {
            return this.loaders.get('json')
        }
        if (['txt'].includes(ext)) {
            return this.loaders.get('text')
        }

        return null
    }

    _registerDefaultLoaders() {
        /* -------------------------------------------------------------- */
        /* Image                                                          */
        /* -------------------------------------------------------------- */
        this.registerLoader('image', url => {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = () => resolve(img)
                img.onerror = reject
                img.src = url
            })
        })

        /* -------------------------------------------------------------- */
        /* Audio                                                          */
        /* -------------------------------------------------------------- */
        this.registerLoader('audio', url => {
            return new Promise((resolve, reject) => {
                const audio = new Audio()
                audio.oncanplaythrough = () => resolve(audio)
                audio.onerror = reject
                audio.src = url
            })
        })

        /* -------------------------------------------------------------- */
        /* JSON                                                           */
        /* -------------------------------------------------------------- */
        this.registerLoader('json', async url => {
            const res = await fetch(url)
            if (!res.ok) {
                throw new Error(`Failed to load JSON: ${url}`)
            }
            return res.json()
        })

        /* -------------------------------------------------------------- */
        /* Text                                                           */
        /* -------------------------------------------------------------- */
        this.registerLoader('text', async url => {
            const res = await fetch(url)
            if (!res.ok) {
                throw new Error(`Failed to load text: ${url}`)
            }
            return res.text()
        })
    }
}

/*
engine.assets.setBasePath('/assets/')

await engine.assets.load('playerSprite', 'player.png')
await engine.assets.load('levelData', 'level01.json')

const sprite = engine.assets.get('playerSprite')
const level = engine.assets.get('levelData')

await engine.assets.loadAll([
    { key: 'player', url: 'player.png' },
    { key: 'music', url: 'theme.mp3' },
    { key: 'level', url: 'level01.json' }
])
*/
