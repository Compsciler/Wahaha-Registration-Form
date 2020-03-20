var express = require("express");
var app = express();
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("database/students.db");
var bodyParser = require("body-parser");  /// Object as data record
var mailer = require("nodemailer");  /// Use of additional libraries

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));

/*
app.get("/", function(request, response){
    response.send("Hello World");
});
*/
app.get("/", getRoot);

app.get("/students", getStudents);
app.post("/students", postStudents);

app.listen(2976, portReport);

function portReport(){
    console.log("Server is running on port 2976");
}

function getRoot(request, response){
    response.send("Go to http://localhost:2976/webpage.html to fill out form!");
}
function getStudents(request, response){
    console.log("GET request received at /students");
    db.all("SELECT * FROM students", function(error, rows){
        if (error){  /// Simple selection (if-else)
            console.log("Error: " + error);
        } else {
            response.send(rows);
        }
    });
}
function postStudents(request, response){
    console.log("POST request received at /students");
    let isError = false;
    let childTotal = request.body.childTotal;
    let message = "";

    for (let i = 1; i <= childTotal; i++){
        let valNames = ["request.body.firstName", "request.body.lastName", "request.body.zhName", "request.body.gender", "request.body.dob", "request.body.school", "request.body.grade"];  /// Arrays
        if (i >= 2){
            incrementNamesOfArray(valNames, i);
        }

        let vals = [];
        for (let j = 0; j < valNames.length; j++){  /// Nested loops
            vals[j] = eval(eval("valNames[" + j + "]"));
            // vals[j] = eval("eval(\"valNames[\" + j + \"]\")" + "[j]");
        }

        message +=  "Child " + i + "\n" +
                    "English Name: " + vals[0] + " " + vals[1] + "\n" +
                    "Chinese Name: " + vals[2] + "\n" +
                    "Gender: " + vals[3] + "\n" +
                    "Date of Birth: " + vals[4] + "\n" +
                    "Regular School: " + vals[5] + "\n" +
                    "Grade: " + vals[6] + "\n\n";

        /// File I/O
        db.run("INSERT INTO students(firstName, lastName, zhName, gender, dob, grade) VALUES (?, ?, ?, ?, ?, ?)", [vals[0], vals[1], vals[2], vals[3], vals[4], vals[6]], function(error){
            if (error){
                console.log("Error: " + error);
                isError = true;
            }
        });
        // console.log("Completed " + i);
    }
    if (!isError){
        sendEmail("rogerwang2520@gmail.com", request.body, message);
        response.status(200).redirect("webpage.html");
    }
}

function incrementNamesOfArray(arr, incrementValue) {  /// User-defined methods with parameters
    for (let i = 0; i < arr.length; i++){  /// Loop
        arr[i] += incrementValue;
    }
}

var transporter = mailer.createTransport({
    service: "gmail",
    auth: {
        user: "rogerwang5040@gmail.com",
        pass: "pw314159"
    }
});
function sendEmail(recipient, requestBody, initialMessage){
    let message =   initialMessage +
                    "Parent 1" + "\n" +
                    "Name: " + requestBody.name[0] + "\n" +
                    "Cell: " + requestBody.cell[0] + "\n" +
                    "Company: " + requestBody.company[0] + "\n" +
                    "E-mail: " + requestBody.email[0] + "\n\n" +
                    
                    "Parent 2" + "\n" +
                    "Name: " + requestBody.name[1] + "\n" +
                    "Cell: " + requestBody.cell[1] + "\n" +
                    "Company: " + requestBody.company[1] + "\n" +
                    "E-mail: " + requestBody.email[1] + "\n\n" + 
                    
                    "Family Information" + "\n" +
                    "Home Address: " + requestBody.address + "\n" +
                    "Home: " + requestBody.homePhone[0] + "\n" +
                    "Specialty: " + requestBody.specialty + "\n\n" +
                    
                    "Emergency " + "\n" +
                    "Name: " + requestBody.name[2] + "\n" +
                    "Home: " + requestBody.homePhone[1] + "\n" +
                    "Cell: " + requestBody.cell[2] + "\n" +
                    "Work: " + requestBody.work;

    let mailOptions = {
        from: "rogerwang5040@gmail.com",
        to: recipient,
        subject: "Wahaha Registration Form",
        text: message
    };
    transporter.sendMail(mailOptions, errorCallbackEmail);
}
function errorCallbackEmail(error, info){
    if (error){
        console.log("Error: " + error);
    } else {
        console.log("Email sent: " + info.response);
    }
}

/*
function errorCallbackGet(error, rows){
    if (error){
        console.log("Error: " + error);
    } else {
        response.send(rows);
    }
}

function errorCallbackPost(error){
    if (error){
        console.log("Error: " + error);
    } else {
        response.status(200).redirect("webpage.html");
    }
}
*/