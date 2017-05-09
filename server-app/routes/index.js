module.exports = function(app, Book)
{
    app.get('/api/books', function(req, res){
        res.end();
    });

    app.post('/api/books', function(req, res){
        var book = new Book();
        book.title = req.body.name;
        book.author = req.body.author;
        book.published_date = new Date(req.body.published_date);
        book.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result:1});
        });
    });
}
