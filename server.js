import express from "express";
import { userDetails } from "./db.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

// Upload userData 
app.post('/userDetails', async (req, res) => {
    console.log(req.body);
    const { name} = req.body;
    const items = await userDetails(name);
    console.log(items);
    console.log(res);
    res.status(200).send("success");
 });

// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});