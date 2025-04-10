import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Button, Avatar, Spin, Card } from "antd";
import TextArea from "antd/es/input/TextArea";
import { RobotOutlined, SendOutlined } from "@ant-design/icons";
import { OpenAIFilled } from "@ant-design/icons";
import DefaultPrompts from "./default-prompts/default-prompts";
import {
  addMessageToSession,
  getSessionByGameId,
} from "../../libs/apis/sessions-api";
import { useUser } from "../../context/user.context";
import { sendChatMessageStream } from "../../libs/apis/chatbot-api";
import { Game } from "../../libs/league/league-types";
import MarkdownRenderer from "../markdown-renderer/markdown-renderer";
import { theme } from "antd";

const { useToken } = theme;
interface Message {
  content: string;
  role: "user" | "system";
}

interface ChatContext {
  game?: Game;
  history?: any;
}

const ChatComponent: React.FC<{
  game: Game | null;
  height: string;
  showAvatar?: boolean;
  context?: ChatContext;
}> = ({ game, height, showAvatar = true, context = {} }) => {
  const { user } = useUser();
  const { token } = useToken();
  const primaryColor = token.colorPrimary;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loadingSession, setLoadingSession] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messageContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messageContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setIsUserScrolling(!isAtBottom);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      if (game?.gameId) {
        try {
          setLoadingSession(true);
          const session = await getSessionByGameId(game.gameId);
          if (session && isMounted) {
            setSessionId(session._id);
            setMessages(session.messages || []);
          }
        } catch (error) {
          console.error("Failed to fetch session:", error);
        } finally {
          setLoadingSession(false);
        }
      } else {
        setLoadingSession(false);
      }
    };

    initializeSession();
    return () => {
      isMounted = false;
    };
  }, [game]);

  const handleSendMessage = async (message?: string) => {
    if (isSending) return; // Prevent duplicate sending

    const textToSend = message || input;

    if (textToSend.trim()) {
      // Add the user message
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: textToSend, role: "user" },
      ]);
      setInput("");
      setIsSending(true);
      console.log("Sending message:", textToSend, sessionId);

      try {
        if (sessionId) {
          await addMessageToSession(sessionId, {
            content: textToSend,
            role: "user",
          });

          // Start streaming response
          let partialResponse = "";
          let systemMessageIndex = -1;
          // Append a new system message and store its index
          setMessages((prevMessages: any) => {
            const updatedMessages = [
              ...prevMessages,
              { content: "", role: "system" },
            ];
            systemMessageIndex = updatedMessages.length - 1;
            return updatedMessages;
          });

          // Stream the response chunks
          await sendChatMessageStream(
            sessionId,
            { query: textToSend, match: game, context },
            (chunk) => {
              partialResponse += chunk;
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                // Verify that the message at our tracked index is a system message before updating
                if (
                  systemMessageIndex >= 0 &&
                  updatedMessages[systemMessageIndex]?.role === "system"
                ) {
                  updatedMessages[systemMessageIndex].content = partialResponse;
                }
                return updatedMessages;
              });
            }
          );

          // Save the final response to the session
          await addMessageToSession(sessionId, {
            content: partialResponse,
            role: "system",
          });
        } else {
          console.error("Session ID is missing");
        }
      } catch (error) {
        console.error("Error interacting with chatbot API:", error);
      } finally {
        setIsSending(false);
        scrollToBottom();
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, isUserScrolling]);

  return (
    <div className="flex justify-center pt-5">
      <div
        className="flex flex-col w-[100%] min-w-[500px]"
        style={{ height: height }}
      >
        {messages.length === 0 && !loadingSession && (
          <DefaultPrompts handleSendMessage={handleSendMessage} />
        )}
        <div
          className="flex-1 overflow-auto p-4 h-full"
          ref={messageContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((msg, index) => (
            <div key={index} className="my-2 flex pb-1">
              {showAvatar &&
                (msg.role === "system" ? (
                  <Avatar style={{ marginRight: 8 }} icon={<RobotOutlined />} />
                ) : (
                  <Avatar style={{ marginRight: 8 }} src={user?.picture} />
                ))}
              {msg.role === "user" ? (
                <div
                  className="inline-block p-2 px-4 rounded-lg break-words text-white"
                  style={{
                    backgroundColor: primaryColor,
                    maxWidth: showAvatar ? "calc(100% - 40px)" : "100%",
                  }}
                >
                  {msg.content}
                </div>
              ) : (
                <Card
                  className="inline-block rounded-lg shadow-md text-black w-full break-words"
                  hoverable
                  style={{
                    maxWidth: showAvatar ? "calc(100% - 40px)" : "100%",
                  }}
                >
                  <MarkdownRenderer content={msg.content} />
                </Card>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex justify-center pt-2">
          <div className="p-1 flex gap-3 w-[80%]">
            <TextArea
              autoSize
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              style={{ fontSize: "16px" }}
              maxLength={256}
              disabled={isSending}
            />
            <Button
              icon={<SendOutlined />}
              onClick={() => handleSendMessage()}
              disabled={isSending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
