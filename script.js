// INIT & GLOBAL VARIABLES-------------------------------------------
// /!\ Respect order of instantiation /!\

async function getJson (url) {
    const response = await fetch(url)
    const json = await response.json()

    let array = flattenArray(json)
    const keys = createKeys(array)

    defineStructure(keys)
    populateTable(array, keys)
    populateEventsListeners(array, keys)
}

getJson('https://jsonplaceholder.typicode.com/users')


let flattenedUser = []


// FLATTEN ARRAY-----------------------------------------------
// Makes arrays with objects nested with other objects inside compatible by flattening them
// Outputs an array of objects
function flattenArray(array){

    let flattenedArray = []
    let lastCategory = ""
    let isInArray = undefined

    array.forEach(user => {
        flattenSubArray(user)
        let flatUserArray = {}
        let listKeys = []

        flattenedUser.forEach(flatObjectUser =>{

            // Check for key duplicate
            isInArray = listKeys.includes(flatObjectUser[0])
            if (isInArray === true) {
                flatObjectUser[0] = lastCategory + " " +flatObjectUser[0]
            }

            // Update the list of used keys
            listKeys.push(flatObjectUser[0])

            // Update the last category encountered
            if (flatObjectUser[1] === "") {
                lastCategory = flatObjectUser[0]
            }

            // Create the final list of users
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

    let temp = []

    for (const key in user) {
        if (typeof user[key] !== 'object') {
            temp = [key, user[key]]
            flattenedUser.push(temp)

        } else {
            let temp2 = [key, ""]
            flattenedUser.push(temp2)
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
        th.dataset.order = "empty"
        th.innerHTML = key
        tableColumns.append(th)
    })
}


// POPULATE ARRAY --------------------------------------------
// Generates Y axis
function populateTable(array, keys) {
    const table = document.getElementById("table")
    table.innerHTML = ''

    array.forEach( user => {
        const tr = document.createElement("tr")
        table.append(tr)

        keys.forEach(key => {
            const line = document.createElement('td')
            line.innerHTML = user[key]
            tr.appendChild(line)
        })
    })
}


// SORT ARRAY ------------------------------------------------
function populateEventsListeners(array, keys){
    document.addEventListener("click", e => {
        if (!e.target.matches("th")) return

        let headerSection = e.target.closest("th")
        let header = headerSection.innerHTML

        // Prevents first click from showing an arrow that does nothing
        if(headerSection.dataset.order === "empty") {
            headerSection.dataset.order = "desc"
        }

        headerSection.dataset.order = headerSection.dataset.order === "asc" ? "desc" : "asc"
        const orderDirection = headerSection.dataset.order === "asc" ? -1 : 1
        array.sort((a, b) => {
            if (a[header] > b[header]) return -1 * orderDirection
            if (a[header] < b[header]) return 1 * orderDirection
            return 0
        })

        // Removes every arrows except the one for the th we just selected
        let selectedThAttr = headerSection.dataset.order
        let everyTh = document.querySelectorAll("th")
        everyTh.forEach(th => {
            th.dataset.order = "empty"
        })
        headerSection.dataset.order = selectedThAttr

        populateTable(array, keys)
    })
}







// EXPERIMENTATIONS---------------------------------------------
// let users = [
//     {"name": "kyle", "address": {"street": "123 ave", "city": "belfast"}, "id": "09"},
//     {"name": "Sally", "address": {"street": "321 ave", "city": "Lille"}, "id": "02"},
// ]
//
// users.forEach(user => {
//     let array = []
//     array.push(flattenKeys(user))
// })
//
// function flattenKeys(obj) {
//     return Object.entries(obj).reduce(([key, value], kvp) => {
//         if (typeof value === "object") return { ...kvp, ...flattenKeys(value) }
//         return { ...kvp, [key]: value }
//     }, {})
// }