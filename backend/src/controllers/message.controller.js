import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {

    try {
        const loggedInUserId = req.user._id;
        console.log(loggedInUserId);
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        // select * except password from users where _id <> loggedInUserId

        return res.status(200).json(filteredUsers);


    } catch (error) {
        console.log("Error in getAllContacts: ", error);
        return res.status(500).json({ message: "Internal server error" })
    }

};

export const getMessagesByUserId = async (req, res) => {

    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        });

        return res.status(200).json(messages);

    } catch (error) {
        console.log("Error is getMessagesByUserId controller", error);
        return res.status(500).json({ message: "Interal server error" })
    }

};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const { _id: senderId } = req.user;

        if (!(text || image)) {
            return res.status(400).json({ message: "Text or image is required." })
        }

        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." })
        }

        const receiverExists = User.exists({ _id: receiverId });
        if (!receiverExists) return res.status(404).json({ message: "Receiver not found." })

        let imageURL;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL
        });

        await newMessage.save();

        // todo: send message in real-time 

        return res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getChatPartners = async (req, res) => {

    try {

        const loggedInUser = req.user._id;

        const messages = await Message.find(
            {
                $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
            },
        );

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUser.toString() ? msg.receiverId.toString() : msg.senderId.toString()
                )
            ),
        ];

        const chatPartners = await User.find({_id: {$in:chatPartnerIds}}).select("-password");

        return res.status(200).json(chatPartners);

    } catch (error) {
        console.log("Error in getCharPartners controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

};