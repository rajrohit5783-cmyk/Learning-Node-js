const express = require('express');
const users = require('./MOCK_DATA.json');
const mongoose = require("mongoose");
const fs = require('fs');


const app = express();
const PORT = 8000;

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    fs.appendFile("log.txt", `\n${Date.now()}: ${req.method}: ${req.path}`, (err,data) => {
        next();
    })

    
});



// HTML route
app.get("/users", (req, res) => {
    const html = `
        <ul>
            ${users.map(user => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `;

    res.send(html);
});

// REST API - Get all users
app.get("/api/users", (req, res) => {
    res.setHeader("X-MyName", "Rohit Raj"); //Custom Header
    //Always add X to custom headers
    return res.json(users);
});

// REST API - Get, Update and Delete user by ID
app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        if(!user) return res.status(404).json({error: 'user not found'})

        return res.json(user);
    })
    .patch((req, res) => {
        // Edit user with ID
        return res.json({ status: "Pending" });
    })
    .delete((req, res) => {
        // Delete user with ID
        return res.json({ status: "Pending" });
    });

// REST API - Create user
app.post('/api/users', (req, res) => {
    // TODO: Create a new user
    const body = req.body;
    if(!body || !body.first_name || !body.email || !body.last_name || !body.gender || !body.job_title)
        return res.status(400).json({msg : 'All fields are req...'})

    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(201).json({ status: "Success", id: users.length });
    })

});

app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
}); 