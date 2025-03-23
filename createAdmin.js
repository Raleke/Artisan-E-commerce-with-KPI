require("dotenv").config();
const { default: mongoose } = require("mongoose");
const admin = require("./models/admin");
const bcrypt = require("bcryptjs");

const createAdmin = async (email, password, name) => {
  const dburl = process.env.MONGO_URI;
  try {
    await mongoose.connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });

    const existingAdmin = await admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new admin({ name, email, password: hashedPassword });

    await newAdmin.save();
    console.log("Admin registered successfully");
    process.exit(0);
  } catch (err) {
    console.error("Server error", err);
    process.exit(1);
  }
};

const [, , email, password, name] = process.argv;

if (!email || !password || !name) {
  console.log(
    "Usage: npm run create-admin --email <email> --password <password> --name <name>",
  );
  process.exit(1);
}

createAdmin(email, password, name);
