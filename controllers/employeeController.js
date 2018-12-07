const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Employee } = require('../models/employee');

// => localhost:3000/employees/
router.get('/getEmp', (req, res) => {
    console.log(` ******** router.get(/) ******** `)
    Employee.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Employees :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    console.log(` ******** router.get(/:id) ******** `)
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Employee.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2)); }
    });
});

/**
 * post '/' Add new employee record to mongoDB
 */
router.post('/addEmp', (req, res) => {
    console.log(` ******** router.post(/) ******** `);
    if (req.body.hasOwnProperty('mobile') && req.body.mobile !== "") {
        Employee.findOne({ mobile: req.body.mobile }).exec((err, result) => {
            if (err) {
                console.log('Employee.findOne() Error :' + JSON.stringify(err, undefined, 2));
                res.json({ statusCode: 404, message: "Employee.$where Error ", status: false })
            } else if (result === null) {
                console.log(' ******** Employee Adding New Record ********');
                var emp = new Employee({
                    name: req.body.name,
                    position: req.body.position,
                    office: req.body.office,
                    salary: req.body.salary,
                    mobile: req.body.mobile,
                });
                emp.save((err, doc) => {
                    if (!err) {
                        console.log(' ------- Employee Record Addedd ------- ');
                        res.json({ statusCode: 200, message: "Employee Record Addedd", status: true, result: doc })
                    }
                console.log(' ******** Error Adding Employee Record ********', result);;
                res.json({ statusCode: 202, message: "Error Adding Employee Record", status: false, result: err })
                });
            } else {
                console.log(' ******** Mobile number already exists! ********');;
                res.json({ statusCode: 202, message: "Mobile number already exists! Retry another number", status: false, result: result })
            }
        })
    } else {
        console.log(' ------- Mobile number is mandatory & can not be empty ------- ');
        res.json({ statusCode: 404, message: "Mobile number is mandatory & can not be empty", status: false })
    }
});

router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var emp = {
        name: req.body.name,
        position: req.body.position,
        office: req.body.office,
        salary: req.body.salary,
        mobile: req.body.mobile,
    };
    Employee.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

/*router.delete('/', (req, res) => {
    if (!req.body.mobile) {
        console.log(' ------- Please provide Mobile number ------- ');
        res.json({ statusCode: 404, message: "Please provide Mobile number", status: false })
    } else {
        Employee.findOneAndDelete({ mobile: req.body.mobile }, (err, result) => {
            if (!err) {
                console.log(' ------- Employee Record Removed ------- ');
                res.json({ statusCode: 404, message: "Employee Record Removed", status: true, result: result })
            } else {
                console.log(' ------- Failed To Remove ------- ');
                res.json({ statusCode: 404, message: "Failed To Remove", status: false, result: result })
            }
        })
    }
})*/
module.exports = router;