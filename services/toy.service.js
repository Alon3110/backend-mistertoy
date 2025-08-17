
import fs from 'fs'
import { utilService } from './util.serivce.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = {}) {
    console.log('from query:',filterBy);
    
    const regex = new RegExp(filterBy.txt, 'i')
    var toysToReturn = toys.filter(toy => regex.test(toy.name))

    if (filterBy.maxPrice) {
        toysToReturn = toysToReturn.filter(toy => toy.price >= filterBy.maxPrice)
    }

    if(filterBy.labels && filterBy.labels.length) {
        toysToReturn = toysToReturn.filter(
            toy => filterBy.labels.every(label => toy.labels.includes(label))
        )
    }

    if (filterBy.inStock) {
        toysToReturn = toysToReturn.filter(
            toy => toy.inStock === JSON.parse(filterBy.inStock)
        )
    }

    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such toy')

    toys.splice(idx, 1)
    return _savetoysToFile()
}

function save(toy) {
    console.log('from save: ', toy);
    
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        //     if (!loggedinUser.isAdmin &&
        //         toyToUpdate.owner.id !== loggedinUser.id) {
        //         return Promise.reject('Not your toy')
        //     }
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.inStock = toy.inStock
        toyToUpdate.labels = toy.labels || []
        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        toy.createdAt = Date.now()
        // toy.owner = loggedinUser
        toys.push(toy)
    }
    // delete toy.owner.score
    return _savetoysToFile().then(() => toy)
}


function _savetoysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                console.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}