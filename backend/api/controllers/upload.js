const { responseHandler } = require("../middlewares/response-handler");
const mongoose = require("mongoose");

exports.getFileName = async (req, res, next) => {
    const { filename } = req.file;
    const URL = `${process.env.RENDER_URL}/Uploader/${filename}`
    // const URL = `http://localhost:5000/Uploader/${filename}`

    responseHandler(URL, res)
}

exports.getFile = async (req, res) => {
    const file = await req.bucket.find({
        filename: req.params.filename
    }).toArray();

    if (!file || file.length === 0) {
        return res.status(404)
            .json({
                err: "no files exist"
            });
    }
    await req.bucket.openDownloadStreamByName(req.params.filename).pipe(res);
}