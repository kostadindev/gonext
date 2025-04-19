# GONEXT

**GONEXT** is a generative AI-driven analysis tool designed for live League of Legends games. It provides real-time insights and strategic recommendations through an intuitive chat interface. By analyzing ally and enemy champions, player statistics, and live match conditions, **GONEXT** offers detailed gameplay guidance, champion builds, and tactical advice generated by an AI agent.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **GenAI-powered Chatbot**  
  A knowledge-enriched chatbot that adapts to the current game state. It can suggest item builds, devise game plans, and answer any in-game questions in natural language.

- **Win Chance Estimation**  
  Advanced AI calculates the probability of victory, factoring in the chosen champions and player performance data.

- **Game Overview**  
  An LLM-generated concise summary that highlights the key strategic considerations for each match.

- **Live Game Analysis**  
  Real-time insights powered by AI and integrated data from the Riot API.

- **Match History & Rank Analysis**  
  Explore detailed match histories and rank information for all players with a single click.

- **Multi-Language Support**  
  Obtain AI-driven insights in various supported languages (English, Korean, Chinese, Spanish, Bulgarian, etc.).

- **Seamless LLM Switch**  
  Instantly switch between GPT-4o, GPT-4o-mini, and Gemini 1.5 Flash for optimal performance and cost efficiency.

---

## Screenshots

![Chat Interface](https://github.com/user-attachments/assets/9f172196-fc87-45cf-9657-47167e8bb8f3)
*Real-time chat providing AI-driven insights.*

![Game Overview](https://github.com/user-attachments/assets/03167506-09c2-4c6a-8120-46855c59f69f)
*Concise LLM-generated summary of strategic considerations.*

![Match History](https://github.com/user-attachments/assets/bfd8bd4e-78b6-4873-9a57-d207fbf54b61)
*Detailed match history and rank analysis.*

![Multi-Language Support](https://github.com/user-attachments/assets/52cf0982-39b7-42ec-ab11-fa112b9d1be2)
*Insights available in multiple languages.*

![LLM Switching](https://github.com/user-attachments/assets/95431b0e-8c4e-400d-b1ea-4c1b5d47ccb2)
*Seamless switching between different LLMs.*

---

## Tech Stack

![Tech Stack Diagram](https://github.com/user-attachments/assets/185dcec4-45da-4069-aafa-7847fbbc63a3)

- **UI:** Built with **React** for a component-based structure, styled using **Ant Design** for pre-built UI components and **Tailwind CSS** for utility-first styling, ensuring a sleek and responsive interface.
- **API:** **Node.js** with the **Express** framework provides a robust backend, seamlessly interfacing with the **Riot API** for real-time game data.
- **Machine Learning API:** **FastAPI** offers a high-performance framework for the ML services, integrated with **LangChain** for building LLM applications, leveraging **OpenAI API** and **Google AI Studio** for advanced AI-driven insights. (ML side available at [GoNext ML GitHub Repository](https://github.com/kostadindev/gonext-ml))
- **Databases:** **PostgreSQL** is used for structured data analytics, **MongoDB** provides flexible storage for general-purpose data, and **Redis** ensures high-performance caching for frequently accessed information.

---

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kostadindev/gonext.git
    cd gonext
    ```
2.  **Install backend dependencies:**
    ```bash
    # Navigate to the backend directory (adjust path if needed)
    cd server
    npm install
    ```
3.  **Install frontend dependencies:**
    ```bash
    # Navigate to the frontend directory (adjust path if needed)
    cd ../client
    npm install
    ```
4.  **Install ML dependencies:**
    Refer to the [GoNext ML GitHub Repository](https://github.com/kostadindev/gonext-ml) for instructions.
5.  **Set up environment variables:**
    - Create `.env` files in the `server`, `client`, and ML project root directories.
    - Populate them based on the respective `.env.example` files, including API keys (Riot Games, OpenAI, Google AI Studio) and database connection strings.
6.  **Set up databases:**
    - Ensure PostgreSQL, MongoDB, and Redis instances are running.
    - Configure connection details in the backend `.env` file.
    - (Optional) Run any necessary database migrations or seeding scripts.

---

## Usage

1.  **Start the backend server:**
    ```bash
    # From the server directory
    npm start
    ```
2.  **Start the frontend development server:**
    ```bash
    # From the client directory
    npm run dev
    ```
3.  **Start the ML server:**
    Refer to the [GoNext ML GitHub Repository](https://github.com/kostadindev/gonext-ml) for instructions.
4.  **Access the application:**
    Open your web browser and navigate to `http://localhost:5173` (or the port specified by the frontend development server).
5.  Enter a League of Legends summoner name and region to begin the analysis.

---

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

