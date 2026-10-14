const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const usermodel = require("../models/usermodel");

const createInventoryController = async (req, res) => {
  try {
    const { email, inventoryType } = req.body
    //validation
    const user = await usermodel.findOne({ email })
    if (!user) {
      throw new Error('User Not Found')
    }
    const organisationUser = await usermodel.findById(req.userId);

    if (!organisationUser || organisationUser.role !== "organisation") {
      return res.status(403).send({
        success: false,
        message: "Only an organisation can manage this inventory",
      });
    }

    req.body.organisation = organisationUser._id;

    if (!organisationUser) {
      throw new Error("Organisation Not Found");
    }
    req.body.organisation = organisationUser._id;
    //   if(inventoryType === "in" && user.role !=='donor'){
    //  throw new Error('Not a Donor Account')
    //   }
    //   if(inventoryType === 'out' && user.role !=='hospital'){
    //  throw new Error('Not a hospital')
    //   }
    console.log("LOGGED IN USER ID:", req.userId);
    console.log("ORGANISATION FROM BODY:", req.body.organisation);
    console.log("DONOR EMAIL:", req.body.email);
    console.log("FOUND USER:", user._id);
    console.log("FOUND USER ROLE:", user.role);

    if (req.body.inventoryType == 'out') {
      const requestedBloodGroup = req.body.bloodGroup
      const requestedQuantityOfBlood = Number(req.body.quantity)
      const organisation = new mongoose.Types.ObjectId(req.body.organisation)
      // calculate blood quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation: organisation,
            inventoryType: 'in',
            bloodGroup: requestedBloodGroup
          }
        }, {
          $group: {
            _id: '$bloodGroup',
            total: { $sum: '$quantity' }
          }
        }

      ])
      // console.log('Total In', totalInOfRequestedBlood);

      const totalIn = totalInOfRequestedBlood[0]?.total || 0
      //calculate  OUT Blood Quantity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation: organisation,
            inventoryType: 'out',
            bloodGroup: requestedBloodGroup
          }
        },
        {
          $group: {
            _id: '$bloodGroup',
            total: { $sum: '$quantity' }
          }
        }
      ])

      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0

      //in & out calc
      const availableQuantityOfBloodGroup = totalIn - totalOut
      //quantity validation
      if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donor = user?._id;
    }
    //save record
    // SAVE RECORD
    console.log("BEFORE SAVING INVENTORY:");
    console.log("REQ USER ID:", req.userId);
    console.log("ORGANISATION ID:", req.body.organisation);
    console.log("DONOR ID:", req.body.donor);
    console.log("HOSPITAL ID:", req.body.hospital);
    console.log("FULL BODY:", req.body);

    const inventory = new inventoryModel(req.body)
    await inventory.save()
    return res.status(201).send({
      success: true,
      message: "new record added",
    })

    const donors = await usermodel.find({ _id: { $in: donorId } })

    return res.status(200).send({
      success: true,
      message: 'Donor Record Fetched Successfully',
      donors,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error In Create Inventory API',
      error,
    })
  }
};

//get all blood records

const getInventoryController = async (req, res) => {
  try {
    const user = await usermodel.findById(req.userId);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }

    let filter = {};

    if (user.role === "organisation") {
      filter = { organisation: user._id };
    } else if (user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied",
      });
    }

    const inventory = await inventoryModel
      .find(filter)
      .populate("donor")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Inventory records fetched successfully",
      inventory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching inventory",
    });
  }
};



//get hospital blood records
const getInventoryHospitalController = async (req, res) => {
  try {

    // console.log("USER ID:", req.userId);

    const inventory = await inventoryModel.find({
      inventoryType: 'out',
      hospital: req.userId
    })
      .populate('donor')
      .populate('hospital')
      .populate('organisation')
      .sort({ createdAt: -1 })

    // console.log("INVENTORY FROM DB:", inventory);
    console.log("HOSPITAL ID:", req.userId);
    console.log("HOSPITAL INVENTORY:", inventory);
    return res.status(200).send({
      success: true,
      message: "get hospital consumer records successfully",
      inventory,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error In GET consumer Inventory',
      error,
    })
  }
}

const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error In Recent Inventory API',
      error,
    })
  }
}

//GET DONOR RECORDS
const getDonorsController = async (req, res) => {
  try {
    const organisation = req.userId
    //find donors
    const donorId = await inventoryModel.distinct('donor', {
      organisation: organisation,
      inventoryType: 'in'
    })
    const donors = await usermodel.find({
      _id: { $in: donorId }
    })
    // Find donor details


    return res.status(200).send({
      success: true,
      message: 'Donor Record Fetched Successfully',
      donors,
    })


  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error in Donor records',
      error: error.message,
    })
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organisation = await usermodel.findById(req.userId);

    if (!organisation || organisation.role !== "organisation") {
      return res.status(403).send({
        success: false,
        message: "Access denied",
      });
    }

    const hospitals = await usermodel
      .find({ role: "hospital" })
      .select("-password");

    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log("Get Hospital Error:", error.message);

    return res.status(500).send({
      success: false,
      message: "Error In get Hospital API",
    });
  }
};

//GET ORG PROFILES
const getOrganisationController = async (req, res) => {
  try {
    const donor = req.userId
    const orgId = await inventoryModel.distinct('organisation', { donor })
    //find org
    const organisations = await usermodel.find({
      _id: { $in: orgId }
    })
    return res.status(200).send({
      success: true,
      message: 'Org Data Fetched Successfully',
      organisations,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error In ORG API',
      error
    })
  }
}
//GET ORG  for Hospital
const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.userId
    const orgId = await inventoryModel.distinct('organisation', { hospital })
    //find org
    const organisations = await usermodel.find({
      _id: { $in: orgId }
    })
    return res.status(200).send({
      success: true,
      message: 'Hospital Org Data Fetched Successfully',
      organisations,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message: 'Error In Hospital ORG API',
      error
    })
  }
}

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonorsController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController
};