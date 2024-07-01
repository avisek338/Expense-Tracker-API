const { StatusCodes } = require('http-status-codes')
const Expense = require('../models/Expense')
const { BadRequestError, NotFoundError } = require('../Errors')
const getAllEpenses = async (req, res) => {
    const { name, price, category, sort, fields, numericFilters, spendAt } = req.query
    const queryObject = {};
    const userId = req.user.userId
    queryObject.createdBy = userId
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if (price) {
        queryObject.price = price
    }
    if (category) {
        queryObject.category = category
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'spendAt'];
        filters = filters.split(',').forEach((item) => {
            //  const [field, operator, value] = item.split('-');
            const field = item.split('-')[0]
            const operator = item.split('-')[1]
            const value = item.split('-').slice(2).join('-')

            if (options.includes(field)) {
                queryObject[field] = { [operator]: Date(value) };
            }
            console.log(value)
        });
    }

    let result = Expense.find(queryObject)

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('spendAt')
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    const expense = await result
    res.status(StatusCodes.OK).json({ expense, nbits: expense.length });

}
const createExpense = async (req, res) => {
    req.body.createdBy = req.user.userId
    const expense = await Expense.create(req.body)
    res.status(StatusCodes.CREATED).json({ expense })
}
const getExpense = async (req, res) => {
    const createdBy = req.user.userId
    const expenseId = req.params.id
    const expense = await Expense.findOne({ _id: expenseId, createdBy })
    if (!expense) {
        throw new NotFoundError(`No data with id ${expenseId}`)
    }
    res.status(StatusCodes.OK).json({ expense })
}
const deleteExpense = async (req, res) => {
    const createdBy = req.user.userId
    const expenseId = req.params.id
    const expense = await Expense.findOneAndDelete({ _id: expenseId, createdBy })
    if (!expense) {
        throw new NotFoundError(`No data with id ${expenseId}`)
    }
    res.status(StatusCodes.OK).json({ expense })
}
const updateExpense = async (req, res) => {
    const createdBy = req.user.userId
    const expenseId = req.params.id
    const expense = await Expense.findOneAndUpdate({ _id: expenseId, createdBy }, req.body, { new: true, runValidators: true })
    if (!expense) {
        throw new NotFoundError(`Not data with id ${expenseId}`)
    }
    res.status(StatusCodes.OK).json({ expense })
}

module.exports = {
    getAllEpenses,
    createExpense,
    getExpense,
    deleteExpense,
    updateExpense
}