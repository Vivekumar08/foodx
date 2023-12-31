const { responseHandler, errorHandler, clientHandler } = require("../../middlewares/response-handler");
const service = require('../../service/product/product');
const { default: mongoose } = require("mongoose");
const { API_CALL } = require("../../utils/apiCall");
const { search } = require("../../queries/product");

exports.create = async (req, res, next) => {
    try {
        const value = req.value;

        const userId = req.user.id;
        value.userId = userId;

        let response

        response = await service.create(value)

        responseHandler(response, res);

    } catch (error) {
        console.error("error is: ", error)
        next(error)
    }
}

exports.getList = async (req, res, next) => {
    try {
        let queryFilter = req.query ? req.query : {};
        const userId = req.user.id
        let filter
        if (queryFilter.isSpace === "true") {
            filter = { active: true };
        } else {
            filter = { active: true, userId: new mongoose.Types.ObjectId(userId) };
        }

        // handling pagination ...
        const pagination = { skip: 0, limit: 100 };
        if (queryFilter.pageNo && queryFilter.pageSize) {
            pagination.skip = parseInt((queryFilter.pageNo - 1) * queryFilter.pageSize);
            pagination.limit = parseInt(queryFilter.pageSize);
        };

        if (queryFilter.isShop) {
            filter["isShop"] = queryFilter.isShop === "true" ? true : false
        }

        if (queryFilter.isSpace) {
            filter["isSpace"] = queryFilter.isSpace === "true" ? true : false
        }

        if (queryFilter.status) {
            filter["status"] = queryFilter.status
        }

        if (queryFilter.name) {
            filter["name"] = { $regex: queryFilter.name, $options: "i" };
        };

        if (queryFilter.id) {
            filter["_id"] = { $in: queryFilter.id.split(',').map(el => new mongoose.Types.ObjectId(el)) }
        };

        if (queryFilter.spaceId) {
            filter["spaceId"] = { $in: queryFilter.spaceId.split(',').map(el => new mongoose.Types.ObjectId(el)) }
        };
        const queries = search(filter, pagination);

        let response = await service.search(queries);

        responseHandler(response, res);

    } catch (error) {
        console.error("error is ", error);
        next(error);
    }
}

exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;

        const value = req.value;

        const response = await service.update({ _id: id }, value)

        responseHandler(response, res);

    } catch (error) {
        console.error("error is ", error);
        next(error);
    }
}

exports.deleteOne = async (req, res, next) => {
    try {
        const id = req.params.id;

        const response = await service.delete(id);
        if (!response) {
            return responseHandler(null, res, "Error Occurred", 400);
        };

        responseHandler("deleted", res);

    } catch (error) {
        console.error("error is ", error);
        next(error);
    }
}
exports.deleteOneHard = async (req, res, next) => {
    try {
        const id = req.params.id;

        const response = await service.hardDelete(id);
        if (!response) {
            return responseHandler(null, res, "Error Occurred", 400);
        };

        responseHandler("deleted", res);

    } catch (error) {
        console.error("error is ", error);
        next(error);
    }
}