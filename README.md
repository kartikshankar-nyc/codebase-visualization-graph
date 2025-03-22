# CODEBASE VISUALIZER (BETA)

## Project info

**DEMO URL**: https://kartikshankar-nyc.github.io/codebase-visualization-graph/

## Screenshots of the app in action
![1](https://github.com/user-attachments/assets/74d33d99-ac03-4797-94cc-272aa83561a9) <br>
![2](https://github.com/user-attachments/assets/96893d57-2967-42b7-816a-5749f81d6e06) <br>
![3](https://github.com/user-attachments/assets/bb5989ad-d9a7-495f-be0d-7cd4f5304544) <br>
![4](https://github.com/user-attachments/assets/19c24fa3-7e7c-4ac5-bd6a-97675a0c8453) <br>
![5](https://github.com/user-attachments/assets/e73032b9-03c9-40e4-9018-c90daccc2fbe) <br>






# Codebase Visualization Graph

The "Codebase Visualization Graph" application is designed to visualize the structure and dependencies of your codebase. This guide will help you get started with using the application effectively.

```markdown

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/) (version 14 or higher).
- You have a codebase that you want to visualize.

## Installation
To install the application, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/kartikshankar-nyc/codebase-visualization-graph.git
    cd codebase-visualization-graph
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

## Running the Application
To run the application, use the following command:
```bash
npm start
```

This will start the application on the default port (e.g., `http://localhost:3000`).

## Using the Application
Once the application is running, you can use it as follows:

1. Open your web browser and navigate to `http://localhost:3000`.
2. You will see the main interface of the Codebase Visualization Graph.
3. Upload your codebase or specify the path to the codebase you want to visualize.
4. The application will analyze the codebase and generate a visual representation of the structure and dependencies.
5. Use the interactive graph to explore the relationships between different parts of your codebase.

## Configuration
The application provides several configuration options to customize its behavior. You can modify these settings in the `config.json` file located in the root directory of the repository.

Example configuration:
```json
{
  "port": 3000,
  "analyzeExtensions": [".ts", ".tsx", ".js", ".jsx"],
  "exclude": ["node_modules", "dist"]
}
```

- `port`: The port number on which the application will run.
- `analyzeExtensions`: An array of file extensions to include in the analysis.
- `exclude`: An array of directories or files to exclude from the analysis.

## Troubleshooting
If you encounter any issues, check the following:

- Ensure that all prerequisites are met.
- Verify that you have installed all dependencies.
- Check the application logs for any error messages.
- Consult the [Issues](https://github.com/kartikshankar-nyc/codebase-visualization-graph/issues) section on GitHub for similar problems and possible solutions.

## Contributing
Contributions are welcome! To contribute, follow these steps:

1. Fork the repository.
2. Create a new feature branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to reach out via the [GitHub Issues](https://github.com/kartikshankar-nyc/codebase-visualization-graph/issues) if you have any questions or need further assistance. Happy coding!
```


