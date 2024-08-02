import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import TokenService from "./token.service";

const connectWebSocket = (onMessageReceived) => {
  const token = TokenService.getLocalAccessToken();
  const socket = new SockJS("http://localhost:8080/ws");
  const stompClient = Stomp.over(() => socket);

  stompClient.connect(
    { Authorization: `Bearer ${token}` },
    (frame) => {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/board/1", (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
    },
    (error) => {
      console.error("WebSocket connection error: ", error);
    }
  );

  return stompClient;
};

export default connectWebSocket;
