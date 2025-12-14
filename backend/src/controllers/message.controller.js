import User from "../modals/auth.modal.js";
import Message from "../modals/message.modal.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const usersList = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: userId } });
    return res.status(200).json(filteredUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiver_id } = req.params;
    const sender_id = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: sender_id, receiverId: receiver_id },
        { receiverId: sender_id, senderId: receiver_id },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiver_id } = req.params;
    const sender_id = req.user._id;

    const { text, image } = req.body;
    let image_url;

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image_url = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: sender_id,
      receiverId: receiver_id,
      text,
      image: image_url,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiver_id);
    if (receiverSocketId) {
      //means user is online
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
