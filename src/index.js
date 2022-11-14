const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');

/**
 * ? bodyParser: indica para o express que deve considerar o body das requests como sendo um json
 */
app.use(express.json());

/**
 * ? portas de 0-1023 são reservadas
 * 
 * http://localhost:3000/
 * http://0.0.0.0:3000/
 * http://127.0.0.1:3000/
 */

const projects = [];

/**
 * ? Middleware: código que intercepta requisições de uma ou mais rotas. Assim, ele pode interromper ou tratar uma requisição antes que chegue na rota
 */

function logRoutesMiddleware(req, _res, next) {
    const { method, url } = req;
    const route = `[${method}] ${url}`;
    console.log(route)
    return next();
}

function helloMiddleware(_req, _res, next) {
    console.log('Hello')
    return next();
}

app.use(logRoutesMiddleware)

app.get('/', helloMiddleware, function(req, res) {
    return res.status(200).send('Hello')
})

app.get('/projects', function(req, res) {
    return res.status(200).json(projects);
});

app.post('/projects', function(req, res) {
    const { name, owner } = req.body;
    const project = { id: uuidv4(), name, owner };
    projects.push(project);
    return res.status(201).json(project);
});

app.put('/projects/:id', function(req, res) {
    const { id } = req.params;
    const { name, owner } = req.body;
    if (!name) return res.status(400).json({ error: '"name" is required' });
    if (!owner) return res.status(400).json({ error: '"owner" is required' });
    const index = projects.findIndex(project => project.id === id);
    if (index < 0) return res.status(404).json({ error: 'Project not found' });
    const project = { id, name, owner };
    projects[index] = project;
    return res.status(200).json(project);
});

app.delete('/projects/:id', function(req, res) {
    const { id } = req.params;
    const index = projects.findIndex(project => project.id === id);
    if (index < 0) return res.status(404).json({ error: 'Project not found' });
    projects.splice(index, 1);
    return res.status(204).end();
});

app.listen(3000, () => {
    console.log('Server listening 👂 on port 3000');
});