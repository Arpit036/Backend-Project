import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (requestAnimationFrame, res) => {
    res.send(200).json({
        message: "ok"
    })
})