class apiResponse {
    constructor(statusCode, data, message = "Success",token = "") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode
        this.token = token
    }
}

export default apiResponse;