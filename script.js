// INIT & GLOBAL VARIABLES-------------------------------------------
// /!\ Respect order of instantiation /!\
const url = 'https://jsonplaceholder.typicode.com/users'

async function getJson () {
    const response = await fetch(url)
    const json = await response.json()

    let Array = flattenArray(json)

    const keys = createKeys(Array)

    defineStructure(keys)
    populateTable(Array, keys)
}
getJson()


let flattenedUser = []


// FLATTEN ARRAY-----------------------------------------------
// Makes arrays with objects nested with other objects inside compatible by flattening them
// Outputs an array of objects
function flattenArray(array){

    let flattenedArray = []

    array.forEach(user => {
        flattenSubArray(user)
        let flatUserArray = {}

        flattenedUser.forEach(flatObjectUser =>{
            Object.assign(flatUserArray, {
                [flatObjectUser[0]]: flatObjectUser[1]
            })
        })

        flattenedArray.push(flatUserArray)
        flattenedUser = []
    })
 return flattenedArray
}


function flattenSubArray(user){

    for (const key in user) {
        if (typeof user[key] !== 'object') {
            let temp = [key, user[key]]
            flattenedUser.push(temp)

        } else {
            flattenSubArray(user[key])
        }
    }
}


// CREATE KEYS------------------------------------------------
// Generates list of unique keys based on the keys of the first user
function createKeys(array){
    return Object.keys(array[0])
}

// STRUCTURE--------------------------------------------------
// Generates X axis based on the amount of keys
function defineStructure(keys){
    const tableColumns = document.getElementById("row")

    keys.forEach(key => {
        const th = document.createElement('th')
        th.innerHTML = key
        tableColumns.append(th)
    })
}


// POPULATE ARRAY --------------------------------------------
// Generates Y axis
function populateTable(arrayUsers, arrayKeys) {
    const table = document.getElementById("table")
    table.innerHTML = ''

    arrayUsers.forEach( user => {
        const tr = document.createElement("tr")
        table.append(tr)

        arrayKeys.forEach(key => {
            const line = document.createElement('td')
            line.classList.add("desc")
            line.innerHTML = user[key]
            tr.appendChild(line)
        })
    })
}


// SORT ARRAY ------------------------------------------------
// document.addEventListener("click", e => {
//     if (!e.target.matches("th")) return
//
//     let headerSection = e.target.closest("th")
//     let header = headerSection.innerHTML.toLowerCase()
//
//     headerSection.dataset.order = headerSection.dataset.order === "asc" ? "desc" : "asc"
//     const orderDirection = headerSection.dataset.order === "asc" ? -1 : 1
//     currentArray.sort((a, b) => {
//         if (a[header] > b[header]) return -1 * orderDirection
//         if (a[header] < b[header]) return 1 * orderDirection
//         return 0
//     })
//
//     populateTable(currentArray)
// })