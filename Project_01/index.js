const express = require('express');
const users = require('./MOCK_DATA.json');

const app = express();

const PORT = 8000;
app.get("/users", (req, res) => {
    const html = `
        <ul>
            ${users.map(user => `<li>${user.first_name}</li>`).join("")}
        </ul>
    `;

    //REST API

app.get("/api/users", (req, res) => {
    return res.json(users);
});


    res.send(html);
});


app.route('/api/users/:id').get((req,res) => {
    const id  =  Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user);

}).patch(req,res => {
     //Edit with user ID
     res.join.json({status: "Pending"});
})
.delete((req,res) => {
    //Delete user with id
    res.join.json({status: "Pending"});
});

app.post('/api/users', (req,res)=> {
    //TODO: Create a new user
    return res.join({status: "pending"});

});






app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
});