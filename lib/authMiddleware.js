module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.json({ authorized: false })
    }
}