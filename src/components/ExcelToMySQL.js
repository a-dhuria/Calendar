const fs = require('fs');
const mysql = require('mysql2/promise');
const exceljs = require('exceljs');
const moment = require('moment');

// MySQL database configuration
const dbConfig = {
  host:"calendar.mysql.database.azure.com", user:"GCal", password:"password@123", database:"calendar", port:3306,
  ssl:{ca:fs.readFileSync("C:\\Users\\adhuria003\\Downloads\\DigiCertGlobalRootCA.crt.pem")}
};

// Path to your Excel file
const excelFilePath = 'C:\\Users\\adhuria003\\Downloads\\calendar (4)\\calendar\\Calendar.xlsx';

async function createConnection() {
  return await mysql.createConnection(dbConfig);
}

async function processExcelFile() {
  const workbook = new exceljs.Workbook();

  try {
    await workbook.xlsx.readFile(excelFilePath);

    for (const worksheet of workbook.worksheets) {
      const sheetName = worksheet.name;
      console.log(`Processing sheet: ${sheetName}`);

      const rows = [];
      let headerRowSkipped = false;

      worksheet.eachRow({ includeEmpty: false }, (row) => {
        if (!headerRowSkipped) {
          // Skip the header row
          headerRowSkipped = true;
          return;
        }

        const rowData = {};

        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          const header = worksheet.getRow(1).getCell(colNumber).text;

          // Convert cell value to string
          const cellValue = cell.text;

          // Handle NULL values
          rowData[header] = cellValue === 'NULL' ? null : cellValue;
        });

        console.log('Current row:', rowData);
        rows.push(rowData);
      });

      await insertData(sheetName, rows);
    }

    console.log('Excel file successfully processed');
  } catch (error) {
    console.error('Error reading Excel file: ' + error);
  }
}

async function insertData(sheetName, rows) {
  const connection = await createConnection();

  for (const row of rows) {
    console.log(`Processing row for sheet ${sheetName}: ${JSON.stringify(row)}`);

    const sql = `
      INSERT INTO Calender 
      (source, startProgramDates, endProgramDates, startTime, endTime, courseName, targetAudience, format) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const startProgramDate = moment(row['Start Program Date'], 'MMMM Do', true);
      const endProgramDate = moment(row['End Program Dates'], 'MMMM Do', true);

      
      if (['January', 'February', 'March'].includes(startProgramDate.format('MMMM'))) {
        startProgramDate.year(2024);
      }
      if (['January', 'February', 'March'].includes(endProgramDate.format('MMMM'))) {
        endProgramDate.year(2024);
      }
      const data = [
        row['Source'],
        startProgramDate.isValid() ? startProgramDate.format('DD-MM-YYYY') : 'TBD',
        endProgramDate.isValid() ? endProgramDate.format('DD-MM-YYYY') : 'TBD',
        row['Start Time'],
        row['End Time'],
        row['Course Name'],
        row['Target Audience'],
        row['Format']
      ];

      const [results] = await connection.query(sql, data);
      console.log(`Inserted row with ID ${results.insertId}`);
    } catch (error) {
      console.error(`Error inserting row into MySQL for sheet ${sheetName}: ${error}`);
      // eslint-disable-next-line no-undef
      console.error('Failed SQL Query:', connection.format(sql,data));
    }
  }

  await connection.end();
}


// Call the function to process the Excel file
processExcelFile().catch(error => {
  console.error('Error processing Excel file:', error);
});