export function fetch() {
    return new Promise(r => {
        setTimeout(() => {
            r({
                name: 'jack',
                age: 18
            })
        }, 1000)
    })
}