//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var pool   = require('./mysql-connector');
const cors = require('cors');
const jwt = require('jsonwebtoken');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

// DECLARE JWT-secret
const JWT_Secret = 'your_secret_key';

var testUser = { username: 'javier', password: 'ceiot' };

const auth = function (req, res, next) {
    let autHeader = (req.headers.authorization || '')
    if (autHeader.startsWith('Bearer ')) {
        token = autHeader.split(' ')[1]
    } else {
        res.status(401).send({ message: "No hay token en la cabecera" })
    }
    jwt.verify(token, JWT_Secret, function(err) {
        if (err) {
            console.log('error en el token')
            res.status(403).send({ meesage: "Token inválido" })
        }
    })
    next()
} 

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));
// to enable cors
app.use(cors(corsOptions));

//=======[ Main module code ]==================================================
app.post('/authenticate', (req, res) => {

    if (req.body) {
        var user = req.body;
        console.log(user);

        if (testUser.username === req.body.username && testUser.password === req.body.password) {
            var token = jwt.sign(user, JWT_Secret);
            res.status(200).send({
                signed_user: user,
                token: token
            });
        } else {
            res.status(403).send({
                errorMessage: 'Auth required!'
            });
        }
    } else {
        res.status(403).send({
            errorMessage: 'Please provide username and password'
        });
    }

});

app.get('/dispositivos/', function(req, res, next) {
    pool.query('SELECT * FROM Dispositivos', function(err, rta, field) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(JSON.stringify(rta)).status(200);
    }); 
});

app.get('/dispositivos/:id', function(req, res, next) {
    pool.query('SELECT * FROM Dispositivos WHERE dispositivoId = ?',req.params.id,
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(rta)).status(200);
        }
    );
});

app.get('/ultmedicion/:dispid', function(req, res, next) {
    pool.query('SELECT * FROM Mediciones m WHERE m.medicionId = (SELECT MAX(medicionId) FROM Mediciones WHERE dispositivoId = ?)',req.params.dispid,
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(rta)).status(200);
        }
    );
});

app.post('/logriegos/', function(req, res, next) {
    pool.query('INSERT INTO `Log_Riegos` (`apertura`, `fecha`, `electrovalvulaId`) VALUES (?, ?, ?)',
        [req.body.apertura, req.body.fecha, req.body.electrovalvulaId],
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send({ 'id': rta.insertId }).status(201);
        }
    );
});

app.post('/medicion/', function(req, res, next) {
    pool.query('INSERT INTO `Mediciones` (`fecha`, `valor`, `dispositivoId`) VALUES (?, ?, ?)',
        [req.body.fecha, req.body.valor, req.body.dispositivoId],
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send({ 'id': rta.insertId }).status(201);
        }
    );
});

app.get('/dispositivos/:id/medicion/', function(req, res, next) {
    pool.query('SELECT * FROM Mediciones WHERE dispositivoId = ?',req.params.id,
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(rta)).status(200);
        }
    );
});

app.get('/riegos/:electrovalvulaId/', function(req, res, next) {
    pool.query('SELECT * FROM Log_Riegos WHERE electrovalvulaId = ?',req.params.electrovalvulaId,
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(rta)).status(200);
        }
    );
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
