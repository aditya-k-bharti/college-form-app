const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const config = {
  server:"localhost",
  database:"Aditya",
  user:"sa",
  password:"12345678",
  options:{
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;
async function connectDB() {
  try {
    pool = await sql.connect(config);
    console.log("✅Connected to SQL Server");
  } catch (err){
    console.error("❌Database connection failed:", err);
  }
}
connectDB();

app.post("/submit-form", async (req, res) =>{
  try {
    console.log("Received Data:", req.body);

    const {
      firstname, lastname,
      DateOfBirth,
      email, password,
      MobileNo,
      gender,
      course,
      address,
      Hobbies,
    } = req.body;

    const hobbiesStr = Hobbies ? Hobbies.join(","):"";

    if (!pool){
      return res.status(500).json({ message:"Database connection not available"});
    }

    const request = pool.request();
    request.input("FirstName", sql.NVarChar, firstname);
    request.input("LastName", sql.NVarChar, lastname);
    request.input("DOB", sql.Date, DateOfBirth);
    request.input("Email", sql.NVarChar, email);
    request.input("Password", sql.NVarChar, password);
    request.input("MobileNo", sql.NVarChar, MobileNo);
    request.input("Gender", sql.NVarChar, gender);
    request.input("Course", sql.NVarChar, course);
    request.input("Address", sql.NVarChar, address);
    request.input("Hobbies", sql.NVarChar, hobbiesStr);

    const query = `INSERT INTO application_data (FirstName, LastName, DOB, Email, Password, MobileNo, Gender, Course, Address, Hobbies) VALUES (@FirstName, @LastName, @DOB, @Email, @Password, @MobileNo, @Gender, @Course, @Address, @Hobbies)`;

    await request.query(query);
    res.json({ message:"Application submitted successfully!"});
  } catch(err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ message:"Server error"});
  }
});

app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/get-applications", async (req, res) =>{
  try {
    let result = await pool.request().query("SELECT * FROM application_data");
    res.json(result.recordset);
  } catch(err){
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.put("/update-user/:id", async(req, res) =>{
  try{
    const userID = req.params.id;
    const { FirstName, Email } = req.body;

    await pool.request()
       .input("FirstName", sql.NVarChar, FirstName)
       .input("Email", sql.NVarChar, Email)
       .input("UserID", sql.Int, userID)
       .query("UPDATE application_data SET FirstName = @FirstName, Email = @Email WHERE ID = @UserID");
    
    res.json({ message: "User updated successfully!" });
  } catch(err){
    res.status(500).json({ message: "Error updating user", error:err.message });
  }
});

app.delete("/delete-user/:id", async (req, res) => {
  try {
    const userID = req.params.id;

    await pool.request()
       .input("UserID", sql.Int, userID)
       .query("DELETE FROM application_data WHERE ID = @UserID");
    
    res.json({ message: "User deleted succesfully!"});
  } catch (err){
    res.status(500).json({ message:"Error deleting user" });
  }
});