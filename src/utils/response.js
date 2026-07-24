const successResponse = (
    res,
    data,
    message = "Success",
    statusCode = 200
) => {

    return res.status(statusCode).json({
        success: true,
        message,
        count: Array.isArray(data)
            ? data.length
            : undefined,
        data
    });

};

module.exports = {
    successResponse
};