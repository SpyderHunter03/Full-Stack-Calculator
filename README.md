# Full-Stack Calculator

A React and ASP.NET Core calculator with an in-memory calculation history. The project is intentionally built using test-driven development (TDD): behavior is specified by tests before implementation is expanded.

## Features

- Addition, subtraction, multiplication, division, and remainder calculations.
- Calculator display with separate number and operator controls.
- Calculation results stored by the API in memory.
- Recent activity loaded from the API and sorted newest first.
- Full expressions and results shown in recent activity.
- Click a history item to put its result back into the display.
- Delete one history item with its `X` action.
- Clear the display with `C`.
- Clear the display and all server-side history with `AC`.
- Responsive calculator layout with independently positioned buttons.

Because storage is in memory, restarting the API clears the calculation history.

## Technology

- Frontend: React, TypeScript, Vite, Vitest, Testing Library.
- Backend: ASP.NET Core Web API, C#, .NET 10.
- Storage: process-local in-memory collection.
- Tests: Vitest for the frontend and xUnit for the API.

## Prerequisites

Install these tools on the computer that will run the project. The instructions below are for Windows.

### Node.js and npm

1. Download the current **LTS** Windows installer from [nodejs.org](https://nodejs.org/en/download/).
2. Run the downloaded `.msi` installer.
3. Keep the default options selected, including adding Node.js to `PATH`.
4. Close and reopen PowerShell or the VS Code terminal.

npm is installed automatically with Node.js. This project requires Node.js 20 or newer.

### .NET SDK

1. Download the **.NET 10 SDK** Windows installer from the [.NET 10 download page](https://dotnet.microsoft.com/en-us/download/dotnet/10.0).
2. Select the Windows x64 SDK installer unless the computer uses a different architecture.
3. Run the installer and accept the default options.
4. Close and reopen PowerShell or the VS Code terminal.

The project currently targets the .NET 10 preview SDK used during scaffolding. If the repository includes a `global.json` in the future, install the SDK version specified there instead.

### Optional: Git and VS Code

- Install [Git for Windows](https://git-scm.com/install/windows) if you need to clone or update the repository.
- Install [Visual Studio Code](https://code.visualstudio.com/download) if you want to use the included VS Code workspace and terminal.

Verify the installations:

```powershell
node --version
npm --version
dotnet --version
```

## Run the project

Run the API and frontend in two separate terminals from the repository root.

### Terminal 1: API

```powershell
dotnet run --project .\src\Calculator.Api\Calculator.Api.csproj --launch-profile http
```

The default API address is `http://localhost:5162`.

### Terminal 2: frontend

```powershell
Set-Location .\client
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

The API permits requests from `localhost` and `127.0.0.1` on any development port, so Vite can move to another port when `5173` is busy.

## Running on different ports

The frontend reads the API address from `VITE_API_URL`. The default is `http://localhost:5162`.

For a different API port, create `client/.env.local` with the address you are using:

```dotenv
VITE_API_URL=http://localhost:6000
```

Start the API on that port in the API terminal:

```powershell
$env:ASPNETCORE_URLS = "http://localhost:6000"
dotnet run --project .\src\Calculator.Api\Calculator.Api.csproj --no-launch-profile
```

Restart the Vite server after changing `.env.local`. Do not commit `.env.local`; it is intended for machine-specific settings.

For a client port that is already in use, Vite automatically chooses and prints the next available port. No client configuration change is required.

## API endpoints

The API base route is `/api/calculations`:

- `GET /api/calculations`: return all stored calculations.
- `POST /api/calculations`: calculate and store `{ "left": 2, "right": 3, "operator": "+" }`.
- `DELETE /api/calculations/{id}`: delete one calculation by GUID.
- `DELETE /api/calculations`: delete all calculations.

## Tests and build

Run API tests from the repository root:

```powershell
dotnet test .\FullStackCalculator.slnx
```

Run frontend tests and build:

```powershell
Set-Location .\client
npm test
npm run build
```

The frontend build also runs TypeScript validation. The API test suite covers calculator operations, expression and timestamp storage, in-memory persistence, and controller responses.

## TDD workflow

New behavior follows Red-Green-Refactor:

1. Add a focused failing test.
2. Implement the smallest change that makes it pass.
3. Refactor while keeping all tests green.

Frontend tests belong under `client/src`; API tests belong under `tests/Calculator.Api.Tests`.

## Troubleshooting

- If the browser reports a connection failure, confirm both terminals are still running and that `VITE_API_URL` matches the API URL.
- If the API executable is locked during a build, stop the running API process and run the test again.
- If history is empty after restarting the API, this is expected because the store is in memory.
- If a port is unavailable, choose another API port and update `client/.env.local`; Vite handles frontend port changes automatically.
