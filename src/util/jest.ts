function randomTimeout(from:number, to: number) {
    let ms = randomFromRange(from, to)
    return new Promise(resolve => setTimeout(resolve, ms, {}));
}
function randomFromRange(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function mockTimeoutTest (success: boolean = true, from: number = 100, to: number = 500) {
    let timeout = await randomTimeout(from, to)
    return { success }
  }

export { mockTimeoutTest }
