const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
const PORT = 8000;


// ===============================
// MongoDB Connection
// ===============================

mongoose
    .connect("mongodb://127.0.0.1:27017/youtube-app-1")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error", err));


// ===============================
// Schema
// ===============================

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        jobTitle: {
            type: String,
        },

        gender: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);


// ===============================
// Model
// ===============================

const User = mongoose.model("user", userSchema);


// ===============================
// Middleware
// ===============================

// Parse form data
app.use(express.urlencoded({ extended: false }));


// Request logging middleware
app.use((req, res, next) => {
    fs.appendFile(
        "log.txt",
        `\n${Date.now()}: ${req.method}: ${req.path}`,
        (err) => {
            if (err) {
                console.log("Log Error:", err);
            }

            next();
        }
    );
});


// ===============================
// GET /users
// HTML Route
// ===============================

app.get("/users", async (req, res) => {
    try {
        const allDbUsers = await User.find({});

        const html = `
            <ul>
                ${allDbUsers
                    .map(
                        (user) =>
                            `<li>${user.firstName} - ${user.email}</li>`
                    )
                    .join("")}
            </ul>
        `;

        res.send(html);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
});


// ===============================
// GET /api/users
// REST API - Get All Users
// ===============================

app.get("/api/users", async (req, res) => {
    try {
        const allDbUsers = await User.find({});

        res.setHeader("X-MyName", "Rohit Raj");

        return res.json(allDbUsers);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Something went wrong",
        });
    }
});


// ===============================
// /api/users/:id
// GET, PATCH, DELETE
// ===============================

app.route("/api/users/:id")

    // ===============================
    // GET USER BY ID
    // ===============================

    .get(async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    error: "User not found",
                });
            }

            return res.json(user);
        } catch (error) {
            return res.status(400).json({
                error: "Invalid User ID",
            });
        }
    })


    // ===============================
    // UPDATE USER
    // ===============================

    .patch(async (req, res) => {
        try {
            const body = req.body;

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    firstName: body.first_name,
                    lastName: body.last_name,
                    email: body.email,
                    gender: body.gender,
                    jobTitle: body.job_title,
                },
                {
                    new: true,
                }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    error: "User not found",
                });
            }

            return res.json({
                msg: "User updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    })


    // ===============================
    // DELETE USER
    // ===============================

    .delete(async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(
                req.params.id
            );

            if (!deletedUser) {
                return res.status(404).json({
                    error: "User not found",
                });
            }

            return res.json({
                msg: "User deleted successfully",
                user: deletedUser,
            });
        } catch (error) {
            return res.status(400).json({
                error: "Invalid User ID",
            });
        }
    });


// ===============================
// POST /api/users
// Create New User
// ===============================

app.post("/api/users", async (req, res) => {
    try {
        const body = req.body;

        // Validate request body
        if (
            !body ||
            !body.first_name ||
            !body.last_name ||
            !body.email ||
            !body.gender ||
            !body.job_title
        ) {
            return res.status(400).json({
                msg: "All fields are required",
            });
        }

        // Create user in MongoDB
        const result = await User.create({
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            gender: body.gender,
            jobTitle: body.job_title,
        });

        return res.status(201).json({
            msg: "success",
            user: result,
        });

    } catch (error) {
        console.log("Create User Error:", error);

        return res.status(500).json({
            msg: "Something went wrong",
            error: error.message,
        });
    }
});


// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
});