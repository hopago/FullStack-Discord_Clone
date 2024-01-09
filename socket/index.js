import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import connectDB from './config/connectDB';

const PORT = process.env.PORT || 5000;

const app = express();

const expressServer = app.listen(PORT, () => {
    console.log(`Socket listening on port: ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:8000", "https://devboardapi.vercel.app", "https://full-stack-discord-clone.vercel.app", "https://devboardapi-hopagos-projects.vercel.app", "https://full-stack-discord-clone-m1c79drzz-hopagos-projects.vercel.app/"]
    }
});

const UsersState = {
    users: [],
};

io.on('connection', socket => {
    socket.on("activateUser", (user) => {
        const { friends, ...currentUser } = user;

        activateUser(currentUser, friends, socket.id);

        if (friends.length) {
            friends.map(friend => {
                const friendSocketId = findUserById(friend._id)?.socketId;
    
                if (friendSocketId) {
                    const onlineFriends = getOnlineFriends(friend._id);
                    io.to(friendSocketId).emit('onlineFriendList', onlineFriends);
                } else {
                    console.log(`${currentUser?.userName} has no friend...`);
                }
            });
        }

        console.log(`${currentUser.userName}#${currentUser.tag} connected...`);
    });

    socket.on("getOnlineFriends", (_id) => {
        const currentUser = findUserById(_id);
        const onlineFriends = getOnlineFriends(_id);

        if (currentUser) {
            io.to(currentUser.socketId).emit('onlineFriendList', onlineFriends);
        } else {
            console.log("Something went wrong in getOnlineFriends...");
        }
    });

    socket.on('sendNotification', async ({ senderId, receiverId, requestType, ...args }) => {
        let receiver;

        if (receiverId) {
            receiver = findUserById(receiverId);
        }

        if (!receiverId && args.receiverUserName && args.receiverTag) {
            receiver = findUserByUserNameAndTag(args.receiverUserName, args.receiverTag)
        }

        if (!receiver) {
            return socket.emit("userNotFound", {
                status: 400,
                message: "Receiver not found..."
            })
        }

        try {
            io.to(receiver.socketId).emit("getNotification", {
                receiver,
                requestType
            });
        } catch (err) {
            console.log(`SendNotification: ${err}`);
        }
    });

    socket.on("logout", (_id) => {
        console.log(UsersState);
        const user = findUserById(_id);
        if (user) {
            console.log(`${user.userName}#${user.tag} has been disconnected...`);
            disconnectUser(_id);
        } else {
            return console.log('logout: User Not Found...');
        }
    });
});

function activateUser(user, friends, socketId) {
    console.log(friends);
    const activateUser = {
        ...user,
        friendsInfoArray: friends,
        socketId
    };

    console.log(activateUser);

    !UsersState.users.some((user) => user._id === activateUser._id) &&
      UsersState.users.push(activateUser);
}

function disconnectUser(_id) {
    UsersState.users = UsersState.users.filter((user) => user._id !== _id);
}

function findUserById(_id) {
    return UsersState.users.find((user) => user._id === _id);
}

function findUserByUserNameAndTag(userName, tag) {
    const user = UsersState.users.find((user) => user.userName === userName && user.tag === tag);
    return user;
}

function getOnlineFriends(_id) {
    console.log(UsersState.users);
    const currentUser = UsersState.users.find(user => user._id === _id);
    if (!currentUser) {
        console.log(`CurrentUser has not found...`);
        return;
    }
    const friends = currentUser.friendsInfoArray;
    if (Array.isArray(friends) && !friends.length) {
        console.log(`${currentUser.userName}#${currentUser.tag} has no friend...`);
        return;
    }
    return UsersState.users.filter(user => friends.filter(friend => friend._id === user._id ));
}