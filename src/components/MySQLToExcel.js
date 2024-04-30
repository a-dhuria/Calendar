//const fs = require('fs');
const mysql = require("mysql2/promise");
const exceljs = require("exceljs");

// MySQL database configuration
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "calender",
};

// Path to save the generated Excel file
const outputFilePath =
  "C:\\Users\\adhuria003\\Downloads\\calendar (4)\\calendar\\Enrollment.xlsx";

// Function to fetch data from MySQL
async function fetchDataFromMySQL() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.query("SELECT * FROM Enrollment ");
    return rows;
  } finally {
    await connection.end();
  }
}

// Function to export MySQL data to Excel
async function exportMySQLDataToExcel() {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet("Enrollment");

  // Fetch data from MySQL
  const dataFromMySQL = await fetchDataFromMySQL();

  // Write headers to the Excel sheet
  const headers = Object.keys(dataFromMySQL[0]);
  sheet.addRow(headers);

  // Write data to the Excel sheet
  dataFromMySQL.forEach((row) => {
    const rowData = Object.values(row);
    sheet.addRow(rowData);
  });

  // Save the Excel workbook
  await workbook.xlsx.writeFile(outputFilePath);
  console.log("Exported MySQL data to Excel successfully.");
}

// Call the function to export MySQL data to Excel
exportMySQLDataToExcel().catch((error) => {
  console.error("Error exporting MySQL data to Excel:", error);
});
