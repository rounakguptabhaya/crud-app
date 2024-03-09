const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const saltRounds = 10;


const app = express();
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST","GET","PUT","DELETE"],
    credentials: true
}));

app.use(express.json());
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"vaiosony",
    database:"crud_app"
});

app.get("/", verify, (req,res) => { //user dashboard
    // console.log(typeof req.isAdmin);

    const cookie = req.headers.cookie;
    if(cookie){
        // console.log(cookie);
        const token = cookie.split('=')[1];

        // console.log(token);
        const decoded = jwt.decode(token);
        console.log("Decoded Token:--",decoded);
        if(decoded.isAdmin === 1){
            console.log("You are logged in as admin please log in as user to access this route");
            res.json({Status:"You are admin"});
        }
    }

    

    if(req.isAdmin === 1){
        res.json({message:"You are not allowed to enter this route"});
    }
    const q = "SELECT * FROM users WHERE username=?";
    values = [req.username];

    db.query(q,[values],(err,result) => {
        if(err){
            return res.json({message:"Error fetching data"});
        }
        if(result.length === 0){
            return res.json({message:"No users are there"})
        }

        res.json({Status:"Success",username: req.username, result});
    })
    // res.json({Status: "Success", username: req.username})
})

app.get("/admin-dashboard", verify, (req,res) => { //admin-dashboard

    const cookie = req.headers.cookie;
    if(cookie){
        // console.log(cookie);
        const token = cookie.split('=')[1];

        // console.log(token);
        const decoded = jwt.decode(token);
        console.log("Decoded Token:--",decoded);
        if(decoded.isAdmin === 0){
            console.log("You are logged in as user please log in as user to access this route");
        
            res.json({Status:"You are user"});
        }
    }
    // console.log(typeof req.isAdmin);
    if(req.isAdmin === 0){
        res.json({message:"You are not allowed to enter this route"});
    }
    const q = "SELECT * FROM users WHERE isAdmin!=?"
    
    db.query(q,1, async(err, result) => {
        if(err){
            return res.json({Error:"Error fetching data from database"});
        }
        if(result.length === 0){
            return res.json({message:"No users are there"});
        }

        res.json({Status:"Success",username: req.username, result});
        // res.json(result);

    })
    // res.json({Status:"Success", username: req.username});
})


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            // alert("Invalid username or password")
            return res.status(401).json({ message: 'Invalid username or password' });
        }


        const user = results[0];

        // Compare hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            // alert("Invalid username or password")
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id,username: user.username,isAdmin: user.isAdmin }, 'mySecretKey', { expiresIn: '1h' });

        res.cookie('token', token);

        // Return token and user data
        return res.status(200).json({ Status:"Success", token, user });
    });
});

app.get("/logout", (req,res) => {
    res.clearCookie('token');
    return res.json({Status:"Success"});
})

// const blacklist = new Set();

// app.post("/logout", (req,res) => {
//     const authHeader = req.headers.authorization;
//     if(authHeader){
//         const token = authHeader.split(" ")[1];
//         blacklist.add(token);
//         console.log(blacklist);
        
//         return res.status(200).json({message:"Logout Successful"}); 
//     }
//     else{
//         res.status(401).json({message:"You are not authenticated"});
//     }
// })

// function checkBlackList(req,res,next){
//     const token = (req.headers.authorization).split(" ")[1];
//     if(blacklist.has(token)){
//         return res.status(401).json({message:"Token has been revoked"});
//     }
//     next();
// }


// function verify(req,res,next){
//     const authHeader = req.headers.authorization;
//     if(authHeader){
//         const token = authHeader.split(" ")[1];

//         jwt.verify(token, "mySecretKey", (err,user) => {
//             if(err){ 
//                 return res.status(403).json({message:"Token is not valid"});
//             }

//             req.user = user;
//             next();
//         })
//     }else{  
//         res.status(401).json({message:"You are not authenticated"});
//     }
// }

function verify(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.json({Error:"You are not authenticated"});
    }else{
        jwt.verify(token, "mySecretKey", function(err,decoded){
            if(err){
                return res.json({Error:"Token is not okay"});
            }else{
               req.username = decoded.username;
               req.isAdmin = decoded.isAdmin;
               next();
            }
        })
    }
}


app.delete("/delete/:id",(req,res) => {
    const userId = parseInt(req.params.id);
    console.log(userId);
    // console.log(typeof req.user.userId);
    // console.log("isAdmin::",req.user.isAdmin);
    const q = "DELETE FROM users WHERE id=?"
    db.query(q,[userId], (err,data)=> {
        if(err){
            return res.status(500).json({message:"Internal server error"});
        }
        return res.status(200).json({message:"User deleted successfully"});
    })
    
})

app.put("/update/:id",verify, async (req,res) => {
    const q = "UPDATE users SET `first_name`=?,`last_name`=?,`username`=?,`email`=? WHERE id=?";

    const userId = parseInt(req.params.id);
    console.log(userId);

    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.email,
    ];

    db.query(q,[...values,userId],(err, data) => {
        if(err){
            return res.send(err);
        }
        else{
            return res.json({message:"Updated Successfully",data});
        }
    })
})

app.get("/users",(req,res) => {
    const q = "SELECT * FROM users";
    db.query(q,(err,data) => {
        if(err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post("/users", async (req, res) => {
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });


        const q = "INSERT INTO users (`first_name`, `last_name`, `username`, `password`, `profile_pic`, `isAdmin`, `email`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.username,
            hashedPassword,
            req.body.profile_pic,
            req.body.isAdmin,
            req.body.email,
        ];

        db.query(q, values, (err, data) => {
            if (err) return res.json(err);
            return res.json({Status:"Success"});
        });
    } catch (error) {
        return res.json(error);
    }
});


app.post("/create", verify, async (req, res) => {
    if(req.isAdmin === 0){
        res.json({message:"You are not allowed to access this route"});
    }

    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });




        const q = "INSERT INTO users (`first_name`, `last_name`, `username`, `password`, `profile_pic`, `isAdmin`, `email`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.username,
            hashedPassword,
            req.body.profile_pic,
            req.body.isAdmin,
            req.body.email,
        ];

        db.query(q, values, (err, data) => {
            if (err) return res.json(err);
            return res.json({Status:"Success"});
        });
    } catch (error) {
        return res.json(error);
    }
});

app.get("/read/:id", (req,res) => {
    const q = "SELECT * FROM users WHERE id = ?"
    const id = req.params.id;
    db.query(q,[id],(err,result) => {
        return res.json(result);
    })
})


app.listen(8800, () => {
    console.log("Server Listening to port 8800");
})