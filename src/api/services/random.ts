/**
 * Given two values, return a random integer between them (inclusively)
 *
 * @param {*} arg1 either single value, or string 'val1-val2', or array [ val1, val2 ]
 * @param {*} arg2 [optional] if arg1 is single value, arg2 is the second value
 */
function getRandomInRange(arg1: number | number[] | string, arg2?: number): number {
  const arr = arg1.constructor === Array
  if (arguments.length === 1) {
    if (!arr) {
      //if there's only one argument passed in, and it's not an array, then it must
      //be a string in the form of '{min}-{max}'
      arg1 = <string>arg1
      const s = arg1.split('-')
      if (s.length > 1) {
        const n: number[] = []
        for (const item of s) {
          n.push(Number.parseInt(item))
        }
        return this.getRandomInRange(n)
      } else {
        //if we only have a single value, and at this point we know there was no
        //second argument passed, then we will just return the value passed, as
        //this is clearly not an expected state
        if (arg1 === '') {
          return 0
        }
        return Number.parseInt(arg1)
      }
    } else {
      //arg1 was an array, we can assume of numbers
      arg1 = <number[]>arg1
      if (arg1.length === 1) {
        return arg1[0]
      } else if (arg1.length > 1) {
        return this.getRandomInRange(arg1[0] * 1, arg1[1] * 1)
      } else {
        return 0
      }
    }
  }
  //Okay, so we got 2 arguments, we'll assume they're both numbers.  If not, the
  //caller is an idiot
  arg1 = <number>arg1
  arg2 = <number>arg2
  if (arg1 === arg2) return arg1
  const min = Math.min(arg1, arg2)
  const max = Math.max(arg1, arg2)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Takes an array of weights and returns a random element id
 *
 * @param {*} weights array of weights
 */
function weightedRandom(weights: number[]): number {
  let sumOfWeight = 0
  for (let i = 0; i < weights.length; i++) {
    sumOfWeight += weights[i]
  }
  let rnd = Math.floor(Math.random() * sumOfWeight)
  for (let i = 0; i < weights.length; i++) {
    if (rnd < weights[i]) {
      return i
    }
    rnd -= weights[i]
  }
}

/**
 * Returns the specified number of unique elements from the array,
 * chosen at random, with weights, if provided
 * @param {*} arr
 * @param {*} count
 * @param {*} weights
 * @param {*} dispose specify false to prevent the chosen item from being removed from the provided array
 */
function getRandomItems(arr: any[], count: number, weights: number[], dispose = true): any[] {
  const items: any[] = []
  count = count ? count : 1
  for (let i = 0; i < count; i++) {
    let choose
    if (weights) {
      choose = this.weightedRandom(weights)
      if (dispose) {
        weights.splice(choose, 1)
      }
    } else {
      choose = this.getRandomInRange(0, arr.length - 1)
    }
    const item = arr[choose]
    if (dispose) {
      arr.splice(choose, 1)
    }
    items.push(item)
  }
  return items
}

/**
 * Use this instead if you know you only need one and don't want
 * to deal with a returned array
 * @param {*} arr
 * @param {*} weights
 * @param {*} dispose specify false to prevent the chosen item from being removed from the provided array
 */
function getOneRandomItem(arr: any[], weights?: number[], dispose?: boolean): any {
  if (dispose === undefined) {
    dispose = true
  }
  return this.getRandomItems(arr, 1, weights, dispose)[0]
}

export default { getRandomInRange, weightedRandom, getRandomItems, getOneRandomItem }
