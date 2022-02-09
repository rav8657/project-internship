const collegeModel = require('../models/collegeModel')
const internModel = require("../models/internModel");


//!-----------------------------Functions--------------------------------------//
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

//!--------------------------------------------------------------------//

const registerCollege = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
        }
        
        // Extract body
        const { name, fullName,logoLink, isDeleted } = requestBody

        // valid Body
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Please provide valid name" })
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: "Please provide valid fullname" })
        }

        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: "Please provide valid logoLink" })
        }

        if (isDeleted == true) {
            res.status(400).send({ status: false, msg: "Cannot input isDeleted as true while registering" });
            return;
        }
        
        const nameTrim = name.trim()
        const collegeval = nameTrim.split(" ");
        const len = collegeval.length       
        if (len > 1) {
            return res.status(400).send({ status: false, msg: "Abbreviated college name should be in a single word" });
        }
        

        const isNameAlreadyRegister = await collegeModel.findOne({ name })
      
        if (isNameAlreadyRegister) {
            return res.status(400).send({ status: false, message: `${name} Name already registered` })
        }

      
        let data = await collegeModel.create(requestBody)

        let collegeResponse = await collegeModel.findOne(data).select({name:1,fullName:1,logoLink:1,isDeleted:1})
        
        return res.status(201).send({ status: true, message: collegeResponse })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}


//!.....................................................................................................

const getCollegeDetails = async function (req, res) {
    try {
        //res.setHeader('Access-Control-Allow-Origin','*')
        const filterQuery = { isDeleted: false }
        const queryParam = req.query
        if (!isValidRequestBody(queryParam)) {
          return  res.status(400).send({ status: false, msg: "No query param received" });
        }

      
        const name1 = req.query.collegeName
        if (!isValid(name1))
         {
             return res.status(400).send({ status: false, message: 'Please provide valid query-Key' }) } 
         else { filterQuery['name'] = name1 }



        const college = await collegeModel.findOne(filterQuery)
 
        if (!college) {
            res.status(400).send({ status: false, msg: "Either college details doesn't exist or Incorrect College name" });
            return;
        }
 
        const interns = await internModel.find({ collegeId: college._id, isDeleted: false}, { name: 1, email: 1, mobile: 1 })



        if (interns.length === 0) {
            res.status(400).send({ status: false, msg: "Interns details doesn't exist" });
            return;
        }

        const { name, fullName, logoLink } = college

        const response = { name: name, fullName: fullName, logoLink: logoLink }

        if (isValid(interns)) { response['interests'] = interns }

        return res.status(201).send({ status: true, data: response });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message });
    }


}


module.exports = { registerCollege, getCollegeDetails, isValid,isValidRequestBody }

