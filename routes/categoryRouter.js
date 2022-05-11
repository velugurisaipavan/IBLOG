const express  = require('express')
const Category = require("../models/categoryModel")
const router   = express.Router()

//* POST => creates category
router.post("/createCategory", async (req, res) => {
    await Category.lookupCategory(req.body.category_name, (lookUpError, lookUpData) => {
        if(lookUpError) return res.json({message: "Error while lookup category", error: lookUpError})
        if(lookUpData == 0) {
            Category.createCategory(req.body, (error, data) => {
                if(error) return res.status(500).send({message: "Error while creating category", error: error})
                res.json({message: "Category created Successfully", data: data})
            })
            return
        }
        res.json({message: "Found existing category", error: lookUpData, found: true})
    })

})

//* GET => gets all category
router.get("/getAllCategory", async (req, res) => {
    await Category.getAllCategory((error, data) => {
        if(error) return res.status(500).send({message: "Error while getting categories", error: error})
        if(data.length == 0) return res.status(404).send({message: "Category not found"})
        res.json(data)
    })
})

module.exports = router;