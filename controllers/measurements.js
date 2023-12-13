const cloudinary = require("../middleware/cloudinary");
const Measurement = require("../models/Measurement");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const measurement = await Measurement.find({ user: req.user.id });
      res.render("profile.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  
  
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  
  
  getMeasurement: async (req, res) => {
    try {
      const post = await Measurement.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  
  
  // createMeasurement: async (req, res) => {
  //   try {
  //     // Upload image to cloudinary
  //     // const result = await cloudinary.uploader.upload(req.file.path);

  //     await Measurement.create({
  //       clinician_Id: req.body.title,
  //       patient_Id: result.secure_url,
  //       dateCreated: result.public_id,
  //       caption: req.body.caption,
  //       likes: 0,
  //       user: req.user.id,
  //     });
  //     console.log("Post has been added!");
  //     res.redirect("/profile");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  createMeasurement: async (req, res) => {
    try {
      console.log(req.body)
        await Measurement.create({
            clinician_Id: req.user.id, 
            patient_Id: req.body.patient_Id, 
            dateCreated: new Date(),
            exerciseGiven: req.body.exerciseGiven,
            // rom: {
            //     flexion: [req.body.rom_flexion_major, req.body.rom_flexion_moderate, req.body.rom_flexion_minimum, req.body.rom_flexion_nil],
            //     extension: [req.body.rom_extension_major, req.body.rom_extension_moderate, req.body.rom_extension_minimum, req.body.rom_extension_nil],
            //     rightGlide: [req.body.rom_rightglide_major, req.body.rom_rightglide_moderate, req.body.rom_rightglide_minimum, req.body.rom_rightglide_nil],
            //     leftGlide: [req.body.rom_leftglide_major, req.body.rom_leftglide_moderate, req.body.rom_leftglide_minimum, req.body.rom_leftglide_nil]
            // },
            painRating: req.body.rating, // Array of pain ratings
            notes: req.body.notes // Array of notes
        });
        console.log("Measurement has been added!");
        res.redirect("/profile"); // Adjust the redirect as needed
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
},

  
  
  
  
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  
  
  
  
  
  
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
