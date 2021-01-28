type point = { x: number, z: number }

const testPass = [
    [1, 1, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 0, 1],
    [1, 1, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 1, 1],
]

const testFail = [
    [1, 1, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 0, 1],
    [1, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
]

const testPoint: point = {x:1,z:3}

console.log('Pass test result (expect true): ' + checkValid(getPoints(testPass),testPoint))
console.log('Fail test result (expect false): ' + checkValid(getPoints(testFail),testPoint))

//makes an array of points based on the map
function getPoints(arr: number[][]): point[]{
    let points: point[] = []
    for (let z = 0; z < arr.length; z++){
        for (let x = 0; x < arr[z].length; x++){
            if (arr[z][x] === 1) {
                points[points.length] = {x,z}
            }
        }
    }
    return points
}

/** this is the entry point.  give it the array of claimed chunks (x/z points), and the point you want to remove,
 *  and it will return true if all of the chunks are contiguous 
 */
function checkValid(claimed: point[], chunkToRemove: point): boolean {
    let adjacents = getAdjacents(claimed, chunkToRemove)

    //if there are only 0 or 1 adjacent chunks, the removal is valid
    if (adjacents.length < 2) return true

    //create an array of chunks we want to use for pathfinding, and remove the one we want to test
    let availableChunks = [].concat(claimed)
    removePoint(availableChunks, chunkToRemove)

    //loop through each of the initial adjacent chunks
    for (let i = 0; i < adjacents.length; i++){
        let chunk1 = adjacents[i] 
        let chunk2 = i === (adjacents.length - 1) ? adjacents[0] : adjacents[i + 1] //loop back around to the front if we made it to the last one
        //we have to re-clone our array here with each iteration, because a previous iteration may have removed a vital part of the path for
        //subsequent iterations
        if (!findPath(chunk1,chunk2,[].concat(availableChunks))) {
            return false //INVALID!
        }
    }

    //if we get here, not finding an INvalid path, it must be valid
    return true
}

/** recursively test the start and end points, looking for a path
 *  the array of available chunks will get smaller and smaller as
 *  we test - we remove them as we go to be sure that we don't
 *  repeatedly test the same paths
 */
function findPath(start: point, end: point, available: point[]): boolean {
    let adjacents = getAdjacents(available, start)
    if (has(adjacents,end)>-1) return true //FOUND A PATH!
    else {
        for (let adj of adjacents) {
            //remove our starting point first, so that it doesn't get tested
            //again in the next iteration
            removePoint(available,adj)
            //recursively call ourself until we find a path, or we fall out
            // and return false after the last iteration
            if(findPath(adj,end,available)) return true //FOUND A PATH!
        }
    }
    return false
}

/** removes the element from the array */
function removePoint(arr: point[], pt: point){
    const idx = has(arr, pt)
    if (idx > -1) {
        arr.splice(idx,1)
    }
}

/** this just returns an array of the claimed chunks that are adjacent to the start chunk */
function getAdjacents(available: point[], start: point): point[] {
    let adjacents: point[] = [
        { x: start.x + 1, z: start.z },
        { x: start.x - 1, z: start.z },
        { x: start.x, z: start.z + 1 },
        { x: start.x, z: start.z - 1}]
    let result = []
    for (let p of adjacents) {
        if (has(available, p) > -1) {
            result[result.length] = p
        }
    }
    return result
}

function comparePoint(a: point, b: point): boolean {
    return a.x === b.x && a.z === b.z
}

function has(arr: point[], pt: point): number{
    for (let i = 0; i < arr.length; i++){
        if (comparePoint(arr[i], pt)) {
            return i
        }
    }
    return -1;
}
