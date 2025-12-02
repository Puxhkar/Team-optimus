 const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/menu", require("./routes/menuRoutes"));

app.use("/api/orders", require("./routes/orderRoutes"));

app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));
app.use("/api/qr", require("./routes/qrRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/rewards", require("./routes/rewardRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/weekly-menu", require("./routes/weeklyMenuRoutes"));


app.get("/", (_, res) => res.send("All working correctly"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} http://localhost:${PORT}`));