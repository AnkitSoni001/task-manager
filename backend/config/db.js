import mongoose from "mongoose";
import dns from "dns";

// Fix for ISPs (like BSNL) that block MongoDB SRV DNS lookups:
// Use Google's public DNS servers instead of the ISP's DNS
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error("");
    console.error("Troubleshooting steps:");
    console.error("  1. Check if your MongoDB Atlas cluster is ACTIVE (free-tier pauses after 60 days)");
    console.error("  2. Ensure IP 0.0.0.0/0 is whitelisted in Atlas → Network Access");
    console.error("  3. Verify username/password in .env MONGO_URI");
    console.error("  4. Try mobile hotspot if ISP continues to block");
    console.error("  5. Try: ipconfig /flushdns");
    console.error("");
    console.error("⚠️  Server will continue running but database operations will fail.");
  }
};

export default connectDB;
