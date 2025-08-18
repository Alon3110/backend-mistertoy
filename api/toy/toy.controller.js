import { toyService } from './api/toy/toy.service.js'
import { loggerService } from './services/logger.service.js'


export async function getToys(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            maxPrice: +req.query.maxPrice || 0,
            labels: req.query.labels || [],
            inStock: req.query.inStock,
            sortBy: req.query.sortBy
        }
        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (err) {
        loggerService.error('Cannot get toys', err)
        res.status(400).send('Cannot get toys')
    }
}

export async function getToyById(req, res) {

    try {
        const { toyId } = req.params
        const toy = await toyService.getById(toyId)
        res.send(toy)
    } catch (err) {
        loggerService.error('Cannot get toy', err)
        res.status(400).send('Cannot get toy')
    }
}

export async function addToy(req, res) {
    try {

        const toy = {
            createdAt: Date.now(),
            imgUrl: "hardcoded-url-for-now",
            inStock: Math.random() > 0.5,
            labels: req.body.labels || [],
            name: req.body.name,
            price: +req.body.price,
        }
        const savedToy = await toyService.save(toy)
        res.send(savedToy)
    } catch (err) {
        loggerService.error('Cannot save toy', err)
        res.status(400).send('Cannot save toy')
    }
}

export async function updateToy(req, res) {
    try {
        const toy = {
            _id: req.params.id,
            name: req.body.name,
            price: +req.body.price,
            inStock: req.body.inStock,
            labels: req.body.labels,
        }
        const savedToy = await toyService.save(toy)
        res.send(savedToy)
    } catch (err) {
        loggerService.error('Cannot save toy', err)
        res.status(400).send('Cannot save toy')
    }
}

export async function removeToy(req, res) {
    try {
        const { toyId } = req.params
        const deletedCount = await toyService.remove(toyId)
        res.send(`${deletedCount} toys removed`)
    } catch (err) {
        loggerService.error('Cannot remove toy', err)
        res.status(400).send('Cannot remove toy')
    }
}