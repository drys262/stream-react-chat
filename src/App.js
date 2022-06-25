import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  Window,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  ChannelList,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

const apiKey = process.env.REACT_APP_STREAM_API_KEY;

// const user = {
//   id: "dylan",
//   name: "Dylan Koei Chavez",
//   image: "https://avatars3.githubusercontent.com/u/17098120?s=460&v=4",
// };

const user = {
  id: "jahree",
  name: "Jahree Lester Chavez",
  image: "https://avatars3.githubusercontent.com/u/17098120?s=460&v=4",
};

const filter = { type: "messaging", members: { $in: [user.id] } };
const sort = { last_message_at: -1 };

function CustomChannelPreview(props) {
  const { channel, setActiveChannel } = props;
  const { messages } = channel.state;
  const lastMessage = messages[messages.length - 1];

  return (
    <button
      onClick={() => setActiveChannel(channel)}
      style={{ margin: "12px" }}
    >
      <div>{channel.data.name || "Unnamed Channel"}</div>
      <div style={{ fontSize: "14px" }}>{lastMessage}</div>
    </button>
  );
}

export default function App() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(user, chatClient.devToken(user.id));

      // const channel = chatClient.channel("messaging", "react-talk", {
      //   image: "https://drupal.org/files/project-images/react.png",
      //   name: "Talk about react",
      //   members: [user.id],
      // });
      const channel = chatClient.channel("messaging", "react-group", {
        image: "https://drupal.org/files/project-images/react.png",
        name: "React Group",
        members: [user.id],
      });

      await channel.watch();

      setClient(chatClient);
    }

    init();

    if (client) return () => client.disconnectUser();
  }, []);

  if (!client) return <LoadingIndicator />;

  return (
    <Chat client={client} theme="messaging light">
      <ChannelList
        filters={filter}
        sort={sort}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
