const { isValid, isValidRequestBody } = require("./collegeController")
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");


//TODO---------------------------------------------------------------------------------------


const createInterns = async function (req, res) {
  try {
    //res.setHeader('Access-Control-Allow-Origin','*')

    const requestBody = req.body;

    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({status: false, msg: "Invalid request parameters. Please provide Intern Details"});
    }


    //Extract Params
    const { name, email, mobile, collegeName, isDeleted } = requestBody;


    //Validation Starts
    if (!isValid(name)) {
     return res.status(400).send({ status: false, msg: "Intern name is required" });
    }
    if (!isValid(email)) {
      return res.status(400).send({ status: false, message: "Intern email required" });
    }
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email.trim())) {
      return res.status(400).send({ status: false,message: `Email should be a valid email address`});
    }
    const isEmailAlreadyUsed = await internModel.findOne({ email }); // {email: email} object shorthand property

    if (isEmailAlreadyUsed) {
     return res.status(400).send({status: false,message: `${email} email address is already registered`}); 
    }

    if (!isValid(mobile)) {
      return res.status(400).send({ status: false, msg: "Mobile Number is required" });
    }

    if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(mobile.trim())) {
      return res.status(400).send({status: false, message: `Mobile should be a valid number`});
    }

    const isMobileNumberAlreadyUsed = await internModel.findOne({ mobile }); // {mobile: mobile} object shorthand property

    if (isMobileNumberAlreadyUsed) {
     return res.status(400).send({ status: false, message: `${mobile} mobile number is already registered` });
    }

    if (isDeleted == true) {
      return res.status(400).send({ status: false, message: "Cannot input isDeleted as true while registering" });
    }

    if (!isValid(collegeName)) {
     return res.status(400).send({ status: false, msg: "College Name is required" });
    }
  
    //Validation ends


    //Validating College ID
    const isValidCollegeName = await collegeModel.findOne({ name: collegeName, isDeleted: false });

    if (!isValidCollegeName) {
      return res.status(400).send({ status: false, msg: `It is not a valid College Name` });
    }

    const collegeId = isValidCollegeName._id

    const updatedBody = { name, email, mobile, collegeId, isDeleted } ;

    const newIntern = await internModel.create(updatedBody)

    const updateResponse = await internModel.findOne(newIntern).select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0 })
    
    return res.status(200).send({status: true, msg: "New Intern created successfully", data: updateResponse});

  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createInterns = createInterns;
