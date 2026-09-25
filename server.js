import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { userDetails , userDetailsSearch} from "./db.js";

const app = express();

app.use(express.json());
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get("/", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});


// Upload userData 
// app.post('/userDetails', async (req, res) => {
//     console.log(req.body);
//     const { name, imageUrl} = req.body;
//     const items = await userDetails(name,imageUrl);
//     console.log(items);
//     console.log(res);
//     res.status(200).send("success");
//  });

app.post("/userDetails", upload.single("image"), async (req, res) => {
    try {
        const mobileNumber = req.body.mobileNumber || "";
        const name = req.body.name || "";
        const gender = req.body.gender || "";
        const checkindate = req.body.checkindate || "";
        const pov = req.body.pov || "";
        const city = req.body.city || "";
        const roomNo = req.body.roomNo || ""; 

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Please provide a valid name"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image"
            });
        }

        const imageUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "customer-images", resource_type: "image" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            );

            stream.end(req.file.buffer);
        });

        const result = await userDetails(name.trim(), imageUrl, mobileNumber, gender, checkindate, pov, city, roomNo);

        res.status(201).json({
            message: "User added successfully",
            userId: result.insertId,
            imageUrl
        });
    } catch (error) {
        console.error("Upload/save failed:", error);
        res.status(500).json({
            message: "Failed to upload image or save user"
        });
    }
});

// Search Product List
app.get("/userDetails", async (req, res) => {
    try {
      const mobileNumber = req.query.mobileNumber || "";
      const users = await userDetailsSearch(mobileNumber);
      console.log(users);
  
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch customer details"
      });
    }
  });

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });