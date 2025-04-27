export function fetch() {
    return new Promise(r => {
        setTimeout(() => {
            r('About')
        }, 1000)
    })
}