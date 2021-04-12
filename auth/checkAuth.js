function checkAuth(req, res, next) {
    const { user } = req.session;


    if (!user) {
        return res.status(401).json({
            error: 'Not logged in',
        })
    } else {
        next();
    }
}

module.exports = checkAuth