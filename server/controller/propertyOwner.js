const property = require("../model/property");

async function uploadProperty(req, res) {
  try {
    const imgUrls = req.files.map(file => file.path);
    const body = req.body;
    if (!body.name || !body.email || !body.description || !body.BHK || !body.rentLowerBound || !body.rentUpperBound || !body.nation || !body.pincode || !body.city) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    console.log('success');
    console.log(imgUrls);
    const Property = await property.findOneAndUpdate(
      { email: body.email, name: body.name },
      {
        email: body.email,
        name: body.name,
        imgLink: imgUrls, 
        description: body.description,
        BHK: body.BHK,
        rentLowerBound: body.rentLowerBound,
        rentUpperBound: body.rentUpperBound,
        nation: body.nation,
        pincode: body.pincode,
        city: body.city
      },
      { new: true, timestamps: true , upsert: true}
    );
    console.log(Property);
    return res.status(200).json({ message: "Property created" });
  } catch (error) {
    return res.status(500).json({ message: "Error uploading images", error: error });
  }
}

module.exports = {
  uploadProperty
};
