app.get('/api/user', function (req, res) {
    console.log('try to get user details');
    if (req.user) {
        res.send({user: req.user});
    }
});