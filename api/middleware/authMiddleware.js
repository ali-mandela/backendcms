const jwt = require('jsonwebtoken');

const protectedRoute = async (req, res, next) => {
    try {
       
        const token = req.headers['authorization'];
        
        if (!token) {
            return res.status(401).send({
                message: "Unauthorized, token missing or invalid",
                success: false
            });
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        
        req.body.userId = decodedToken.id;
        req.body.role = decodedToken.role;

        // Proceed to the next middleware 
        next();

    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            message: "Auth error",
            success: false
        });
    }


}

module.exports = {
    protectedRoute
};