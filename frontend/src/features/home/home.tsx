import React from "react";
import { Layout, Typography, Steps, Carousel } from "antd";
import GlobalSearch from "../global-search/global-search";
import { QuickSearch } from "../quick-search/quick-search";
import {
  RobotOutlined,
  SmileOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import { handleLoginSuccess } from "../../libs/apis/auth-api";
import { useUser } from "../../context/user.context";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { user, setUser } = useUser();

  const onLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    const userData = await handleLoginSuccess(token);
    setUser(userData);
  };

  const onLoginError = () => {
    console.error("Login Failed");
  };

  const stepsItems = [
    {
      title: "Search Player in Game",
      status: "process",
      icon: <SolutionOutlined />,
    },
    { title: "Ask AI", status: "wait", icon: <RobotOutlined /> },
    { title: "Win", status: "wait", icon: <SmileOutlined /> },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-start p-4 w-full gap-y-6">
        {/* Header Section */}
        <div className="w-full max-w-3xl py-4 text-center">
          <Steps className="w-full" items={stepsItems as any} />
        </div>

        {/* AI Chatbot Usage Explanation */}
        <Paragraph className="text-center max-w-4xl">
          Search for a player in an active game, then ask anything about the
          match or players in chat! The AI knows all visible game data—current
          match, player stats, and histories. Get personalized tips like the
          best item builds and laning strategies for this game.
        </Paragraph>

        {/* Conditional rendering: if user exists, show search; otherwise, show sign in */}
        <Content className="flex flex-col w-full mt-4">
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6">
            <GlobalSearch />
            <span className="hidden sm:block">or</span>
            <QuickSearch />
          </div>
        </Content>

        {/* Image Carousel */}
        <div className="w-full sm:w-[50vw] mt-8">
          <Carousel autoplay arrows>
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-full sm:w-[50vw] h-[50vh] flex items-center justify-center"
              >
                <img
                  src={`images/carousel/slide${index}.png`}
                  alt={`Slide ${index}`}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
