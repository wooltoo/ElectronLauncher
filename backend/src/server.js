const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const connectionString = "mongodb+srv://admin:ascent@electronlauncher.wjgepu3.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function() {
    console.log('Express listening on 3000');
})

MongoClient.connect(connectionString, {useUnifiedTopology: true}).then(client => {
    console.log("Connected to remote MongoDB");
    const launcherDb = client.db('launcher');

    const newsCollection = launcherDb.collection('news');
    const realmsCollection = launcherDb.collection('realms');
    const filesCollection = launcherDb.collection('files');
    const urlCollection = launcherDb.collection('urls');
    const infoCollection = launcherDb.collection('info');
    const addonsCollection = launcherDb.collection('addons');

    app.get('/reachable', (req, res) => {
        res.send({'status': 'true'});
    });

    app.get('/news', (req, res) => {
        let promise = newsCollection.find().limit(3).toArray();
        promise.then(results => {
            res.send(results);
        }).catch(error => console.error(error));
    });

    app.get('/realms', (req, res) => {
        let promise = realmsCollection.find().limit(2).toArray();
        promise.then(results => {
            res.send(results);
        }).catch(error => console.error(error));
    });

    app.get('/files', (req, res) => {
        let promise = filesCollection.find({
            $or: [{type: 'patch'}, {type: 'resource'}, {type: 'client'}]
        }).toArray();
        promise.then(results => {
            res.send(results);
        }).catch(error => console.error(error));
    });

    app.get('/download-file', (req, res) => {
        if (req.query == null)
            res.send({'error' : 'No request values provided.'});

        if (!req.query.id) 
            res.send({'error' : 'No ID provided for the download file to fetch.'});

        let promise = filesCollection.find({
            id: parseInt(req.query.id) 
        }).toArray();

        promise.then((result) => {
            res.send(result[0]);
        });
    });

    app.get('/youtube-video', (req, res) => {
        let promise = urlCollection.find({ name: 'youtube-video-url'}).toArray();

        promise.then(results => {
            res.send(
                {'video' : results[0]['url']}
            );
        });
    });

    app.get('/version', (req, res) => {
        let promise = infoCollection.find({name: 'version'}).toArray();

        promise.then(results => {
            res.send(
                {'version': results[0]['version']}
            )
        });
    });

    app.get('/addons', (req, res) => {
        let promise = addonsCollection.find().toArray();

        promise.then(results => {
            res.send(results);
        });
    });

    /*
        POST ROUTES
    */

    const realmStatusKey = '<x.c9"i^,q/P=$X1LC<A8$jb,Iksiq';
    app.post('/realms/change-status', (req, res) => {
        if (req.body == null)
            res.send({"status": "error - no body"});
        
        if (req.body.id == null || req.body.key == null || req.body.status == null)
            res.send({"status": "error - invalid params"});

        if (req.body.key != realmStatusKey) 
            res.send({"status": "error - invalid permissions"});

        let realmId = parseInt(req.body.id);
        let status = parseInt(req.body.status) == 0 ? "OFFLINE" : "ONLINE";

        let filter = { id: realmId };
        let update = { $set: { status: status }};

        realmsCollection.updateOne(filter, update);

        res.send({"status": "success"});
    });
});


