const { url } = require('./config');
const fetch = require('node-fetch');

async function getChatSession(roomId) {
  // * fetch the chat session from the db
  try {
    const result = await fetch(
      `${url.client}/api/chat-sessions?roomId=${roomId}`
    );
    const data = await result.json();
    return await data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function addChatToSession(chat, roomId) {
  // * save the chat session in the db
  try {
    const chats = await getChatSession(roomId);
    chats.push(chat);
    const stringifiedChats = JSON.stringify(chats);

    const reqBody = {
      roomId: roomId,
      chats: stringifiedChats,
    };

    await fetch(`${url.client}/api/chat-sessions`, {
      method: 'PUT',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error(e);
  }
}

async function clearChatHistory(roomId) {
  try {
    const reqBody = {
      roomId: roomId,
      chats: JSON.stringify([]),
    };

    await fetch(`${url.client}/api/chat-sessions`, {
      method: 'PUT',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error(e);
  }
}

async function addRoomToUser(userId, roomId) {
  try {
    const response = await fetch(
      `${url.client}/api/user-rooms?userId=${userId}`
    );
    const rooms = await response.json();

    const item = rooms.find((r) => r.roomId === roomId);
    if (item) {
      item.date = new Date();
    } else {
      rooms.push({
        roomId: roomId,
        date: new Date(),
        meetingLink: `https://talktime.taherchabra.tech/room/${roomId}`,
        chatLink: `https://talktime.taherchabra.tech/room/${roomId}/chat`,
      });
    }

    const stringifiedRooms = JSON.stringify(rooms);

    const reqBody = {
      userId: userId,
      rooms: stringifiedRooms,
    };

    fetch(`${url.client}/api/user-rooms`, {
      method: 'PUT',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error(e);
  }
}

async function addUserToRoom(user, roomId) {
  try {
    const response = await fetch(`${url.client}/api/rooms?roomId=${roomId}`);
    const users = await response.json();
    const item = users.find((u) => u.id === user.id);
    if (!item) {
      users.push(user);
      const stringifiedUsers = JSON.stringify(users);

      const reqBody = {
        roomId: roomId,
        users: stringifiedUsers,
      };

      fetch(`${url.client}/api/rooms`, {
        method: 'PUT',
        body: JSON.stringify(reqBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getChatSession,
  addChatToSession,
  clearChatHistory,
  addRoomToUser,
  addUserToRoom,
};
