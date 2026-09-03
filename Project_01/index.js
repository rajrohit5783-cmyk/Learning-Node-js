const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');


const app = express();

const PORT = 8000;

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log("HEllo From Middleware 1");

    next();
});

app.use((req, res, next) => {
    console.log("HEllo From Middleware 2");
    next();
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

    return res.json(users);
});

// REST API - Get, Update and Delete user by ID
app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);

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
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "Success", id: users.length });
    })

});

app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
}); 