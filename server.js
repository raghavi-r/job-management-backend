const express= require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const http = require('http');

const app =express();
const server = http.createServer(app);
const port=3000;
app.use(bodyParser.json());
app.use(cors({origin:'http://localhost:4200'}));
const mySql= require('mysql2');

const con = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sq@080568",
    port:3306,
    database:'job'
  });
  
 con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.get("/jobs",(req,res)=>{
    //con.connect();
    con.query('SELECT * from job_description', function(err, rows, fields) {
        if (!err) {
            res.send(JSON.stringify(rows));
        } else {
            console.log('Error while performing Query.');
        }
    });
    //con.end();
})

app.post('/jobs', (req, res) => {
    //con.connect();
    const { customerName, jobType, jobStatus, appointmentDate, technician } = req.body;
    const sql = 'INSERT INTO job_description (customerName, jobType, jobStatus, appointmentDate, technician) VALUES (?, ?, ?, ?, ?)';
    
    con.query(sql, [customerName, jobType, jobStatus, appointmentDate, technician], (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).send({ error: 'Database error' });
        return;
      }
      res.status(200).send({ message: 'Form data received and stored successfully', data: result });
    });
    //con.end();
  });

  app.get('/jobs/:id', (req, res) => {
    //con.connect();
    const jobId = req.params.id;
    const sql = 'SELECT * FROM job_description WHERE ID = ?';
  
    con.query(sql, [jobId], (err, result) => {
      if (err) {
        console.error('Error fetching data from MySQL:', err);
        res.status(500).send({ error: 'Database error' });
        return;
      }
      if (result.length === 0) {
        res.status(404).send({ message: 'Job not found' });
        return;
      }
      res.status(200).send(result[0]);
    });
    //con.end();
  });

  app.put('/jobs/:id', (req, res) => {
    //con.connect();
    const jobId = req.params.id;
    const { customerName, jobType, jobStatus, appointmentDate, technician } = req.body;
    console.log(req.body);
    const sql = 'UPDATE job_description SET customerName = ?, jobType = ?, jobStatus = ?, appointmentDate = ?, technician = ? WHERE id = ?';
  
    con.query(sql, [customerName, jobType, jobStatus, appointmentDate, technician, jobId], (err, result) => {
      if (err) {
        console.error('Error updating data in MySQL:', err);
        res.status(500).send({ error: 'Database error' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).send({ message: 'Job not found' });
        return;
      }
      res.status(200).send({ message: 'Job updated successfully' });
    });
    //con.end();
  });

  app.delete('/jobs/:id', (req, res) => {
    //con.connect();
    const jobId = req.params.id;
    const sql = 'DELETE FROM job_description WHERE id = ?';
  
    con.query(sql, [jobId], (err, result) => {
      if (err) {
        console.error('Error deleting data from MySQL:', err);
        res.status(500).send({ error: 'Database error' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).send({ message: 'Job not found' });
        return;
      }
      res.status(200).send({ message: 'Job deleted successfully' });
    });
    //con.end();
  });

server.listen(port,()=>{
    console.log("Server running on port 3000");
})

module.exports =app;