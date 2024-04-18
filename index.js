import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import cors from "cors";

const app = express();

// allows to use json data in express
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json("hello this is Arushan Manoharan from backend");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// Connecting to the Data base
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "arush123",
  database: "work",
});

/**Get All the Employees from the database API */
app.get("/employees", async (req, res) => {
  //   const q = "SELECT * FROM employee";
  try {
    const data = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM employee", (err, data) => {
        if (err) {
          console.error("Error retrieving to get Employees:", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

/**Add Employees API*/
app.post("/employees", async (req, res) => {
  //creating post request to add data to the database

  try {
    const values = [
      req.body.empNo,
      req.body.empName,
      req.body.empAdressLine1,
      req.body.empAddressLine2,
      req.body.empAddressLine3,
      req.body.empDataOfJoin,
      req.body.empStatus,
      req.body.empImage,
    ];
    const d =
      "INSERT INTO employee (`empNo`, `empName`, `empAdressLine1`, `empAddressLine2`,`empAddressLine3`, `empDataOfJoin`,`empStatus`, `empImage`) VALUES(?)";
    await new Promise((resolve, reject) => {
      db.query(d, [values], (err, data) => {
        if (err) {
          console.error("Error adding Employee:", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    return res.json("Employee added successfully");
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

/**Get Employee By ID API*/
app.get("/employees/:id", async (req, res) => {
  try {
    const empId = req.params.id;

    const data = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM employee WHERE id = ?", [empId], (err, data) => {
        if (err) {
          console.error("Error retrieving Employee by ID:", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving Employee by ID:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/**Update Employee API*/
app.put("/employees/:id", async (req, res) => {
  try {
    const empId = req.params.id;

    const check = "SELECT * FROM employee WHERE id = ?";
    // console.log(check);

    // Check if the Employee with the provided ID exists
    const existingEmployee = await new Promise((resolve, reject) => {
      db.query(check, [empId], (err, data) => {
        if (err) {
          console.error("Error checking Employees existence:", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    if (existingEmployee && existingEmployee.length > 0) {
      const values = [
        req.body.empNo,
        req.body.empName,
        req.body.empAdressLine1,
        req.body.empAddressLine2,
        req.body.empAddressLine3,
        req.body.empDataOfJoin,
        req.body.empStatus,
        req.body.empImage,
      ];
      const UPDATE_EMPLOYEE_QUERY =
        "UPDATE employee SET empNo = ?, empName = ?, empAdressLine1 = ?, empAddressLine2 = ?, empAddressLine3 = ?, empDataOfJoin = ?, empStatus = ?, empImage = ? WHERE id = ?";
      await new Promise((resolve, reject) => {
        db.query(UPDATE_EMPLOYEE_QUERY, [...values, empId], (err, data) => {
          if (err) {
            console.error("Error updating Employee:", err);
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      return res.status(200).json("Employee Updated successfully");
    } else {
      return res.status(404).json({ error: "Employee ID not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

/**Delete Employee API*/
app.delete("/employees/:id", async (req, res) => {
  try {
    const empId = req.params.id;

    if (!empId && isNaN(empId)) {
      return res.status(400).json({ error: "Please provide a valid ID" });
    }

    await new Promise((resolve, reject) => {
      db.query("DELETE FROM employee WHERE id = ?", [empId], (err, data) => {
        if (err) {
          console.error("Error deleting Employee:", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    return res.json("Employee deleted successfully");
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});
