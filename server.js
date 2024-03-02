import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Express App Config
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, "public")));
  console.log("__dirname: ", __dirname);
} else {
  // Configuring CORS
  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: ["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

const PORT = process.env.PORT || 5000;

// app.get("/api/toy", (req, res) => {
//   const { name, price, inStock, label } = req.query.filterBy;
//   const { value, direction } = req.query.sortBy;
//   const sortBy = { value, direction: +direction };
//   const filterBy = { name, price: +price, inStock, label };
//   toyService
//     .query(filterBy, sortBy)
//     .then(toys => {
//       res.send(toys);
//     })
//     .catch(err => {
//       loggerService.error("Cannot load toys", err);
//       res.status(400).send("Cannot load toys");
//     });
// });

app.get("/api/shelters", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius: 5000,
        type: "establishment",
        keyword: "bomb shelter",
        key: "AIzaSyBPkUDvQ4IYXXF1kBUnAmuUI_ph0dLoGiQ",
      },
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.response ? error.response.data : "Unknown error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
