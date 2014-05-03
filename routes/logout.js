app.post('/api/logout', function (req, res) {
    console.log('try logging out');
    req.logout();
    if (!req.user) {
        console.log('You are logged out');
        res.send('You are logged out');
    }
});